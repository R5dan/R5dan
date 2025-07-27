import { Redis } from "@upstash/redis";
import env from "~/env";
import { ok, err, type Result, type Ok } from "neverthrow";
import type { z } from "zod";
import {
  REDIRECT_ID,
  REDIRECT_SCHEMA,
  KEYS_ORDER,
  LAST_KEY_CHAR,
  FIRST_KEY,
} from "~/server/upstash/types";

export const REDIS_CLIENT = new Redis({
  url: env.UPSTASH_REDIS_URL,
  token: env.UPSTASH_REDIS_PASSWORD,
});

export async function getRedirect(id: string) {
  console.log(`[REDIS] ${id}`);
  if (!REDIRECT_ID.safeParse(id).success) {
    return err(new Error("Invalid ID"));
  }
  const url = await REDIS_CLIENT.get(id);
  if (REDIRECT_SCHEMA.safeParse(url).success) {
    return ok(url) as Ok<string, never>;
  } else {
    return err(new Error("Invalid URL"));
  }
}

export async function setRedirect(
  id: z.infer<typeof REDIRECT_ID>,
  url: z.infer<typeof REDIRECT_SCHEMA>,
) {
  console.log(`[REDIS] ${id} < ${url}`);

  try {
    await REDIS_CLIENT.set(id, url);
    return ok(true);
  } catch (e) {
    return err(e);
  }
}

export async function deleteRedirect(id: z.infer<typeof REDIRECT_ID>) {
  console.log(`[REDIS] ${id}`);
  try {
    await REDIS_CLIENT.del(id);
    return ok(true);
  } catch (e) {
    return err(e);
  }
}

export async function getAllRedirects() {
  console.log("[REDIS] getAllRedirects");
  try {
    const keys = await REDIS_CLIENT.keys("*");
    keys.splice(keys.indexOf("lastID"), 1);
    const urls = await REDIS_CLIENT.mget(keys);
    return ok(urls);
  } catch (e) {
    return err(e);
  }
}

const LENGTH = 5;

export async function getNextID(): Promise<Result<string, Error>> {
  console.log("[LAST] getNextID");
  const lastID = await (REDIS_CLIENT.get<string>("_lastID"));
  console.log(`[LAST] '${lastID}'`);
  if (!lastID) {
    console.log("[SETTING FIRST]");
    await REDIS_CLIENT.set("lastID", FIRST_KEY);
    console.log("[RETURNING FIRST]");
    return ok(FIRST_KEY);
  }

  // Ensure lastID is a string

  const lastIDString = String(lastID);
  console.log("[LAST]", lastIDString);
  const splitID = lastIDString.split("");
  console.log("[SPLIT]", splitID);
  const newID = [];
  let shouldContinue = true;

  for (let i = 0; i < LENGTH; i++) {
    const char = String(splitID[i]);
    const charIndex = KEYS_ORDER.indexOf(char);
    if (char === LAST_KEY_CHAR && shouldContinue) {
      newID.push(FIRST_KEY);
      if (i === LENGTH - 1) {
        // If we've reached the end and all chars were LAST_KEY_CHAR, add one more char
        newID.push(FIRST_KEY);
      }
    } else if (shouldContinue) {
      if (charIndex !== -1) {
        const nextIndex = charIndex + 1;
        if (nextIndex < KEYS_ORDER.length) {
          newID.push(KEYS_ORDER[nextIndex]);
        } else {
          newID.push(KEYS_ORDER[0]);
        }
      } else {
        // If char is not found, just push FIRST_KEY
        newID.push(FIRST_KEY);
      }
      shouldContinue = false;
    } else {
      newID.push(char);
    }
  }

  const newIDString = newID.join("");
  await (REDIS_CLIENT.set("lastID", newIDString));
  return ok(newIDString);
}
