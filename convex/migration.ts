import { Migrations } from "@convex-dev/migrations";
import { components, internal } from "./_generated/api.js";
import type { DataModel } from "./_generated/dataModel.js";

export const migrations = new Migrations<DataModel>(components.migrations);
export const run = migrations.runner();

export const migrateURL  = migrations.define({
  table: "blogs",
  migrateOne:async (ctx, doc) => {
    if (!doc.url) {
      await ctx.db.patch(doc._id, { url: doc.title.replace(" ", "-") });
    }
  }
})

export const runIt = migrations.runner(internal.migration.migrateURL);
