// import { Migrations } from "@convex-dev/migrations";
// import { components, internal } from "./_generated/api.js";
// import type { DataModel } from "./_generated/dataModel.js";

// export const migrations = new Migrations<DataModel>(components.migrations);
// export const run = migrations.runner();

// export const migrateBlogToDeployments = migrations.define({
//   table: "blogs",
//   migrateOne: async (ctx, doc) => {
//     const deployment = await ctx.db.insert("deployment", {
//       blog: doc._id,
//       title: doc.title!,
//       description: doc.content,
//       image: doc.image,
//       imageAlt: "",
//       default: true,
//     })

//     await ctx.db.patch(doc._id, {
//       url: typeof doc.url === "string" ? doc.url :  doc.url[0]!,
//       title: undefined!,
//       description: undefined,
//       image: undefined,
//       defaultDeployment: deployment,
//     });
//   },
// });
// export const runIt = migrations.runner(internal.migration.migrateBlogToDeployments);
