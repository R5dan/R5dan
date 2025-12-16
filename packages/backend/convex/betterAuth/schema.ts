import { defineSchema } from "convex/server";
import { tables } from "./generatedSchema";

const schema = defineSchema({
  ...tables,

  member: tables.member.index("role_user", ["role", "userId"]),
});

export default schema;
