import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statement = {
  blogs: ["create", "read", "update"], // <-- Permissions available for created roles
  storage: ["read", "create", "update", "delete"],
  ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  blogs: ["create", "update"],
  storage: ["create", "read", "update", "delete"],
  ...adminAc.statements,
});

export const reviewer = ac.newRole({
  blogs: ["read"],
  storage: ["read"],
});
