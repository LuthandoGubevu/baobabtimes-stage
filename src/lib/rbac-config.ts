/**
 * RBAC Configuration for The Baobab Times
 * 
 * This file maintains the source of truth for administrative and executive roles.
 */

export const CEO_EMAIL = "grant@baobabbrands.com";

export const ADMIN_ALLOWLIST = [
  "megan@baobabbrands.com",
  "shayna@baobabbrands.com",
  "cindy@baobabbrands.com",
  "lee-anne@kfcbaobab.com",
  "luthando@baobabbrands.com",
  "riaan@baobabbrands.com",
  "roslyn@baobabbrands.com",
  "stacey@kfcbaobab.com",
  "tereza@baobabbrands.com",
  "wikus@baobabbrands.com",
  "nicky@baobabbrands.com"
];

export type UserRole = "ceo" | "admin" | "user";

/**
 * Normalizes an email and determines the associated role.
 * 
 * @param email The user's email address
 * @returns The determined UserRole
 */
export function getRoleForEmail(email?: string | null): UserRole {
  if (!email) return "user";
  
  const normalizedEmail = email.toLowerCase().trim();

  if (normalizedEmail === CEO_EMAIL.toLowerCase()) {
    return "ceo";
  }

  const isAdmin = ADMIN_ALLOWLIST.some(
    (adminEmail) => adminEmail.toLowerCase() === normalizedEmail
  );

  if (isAdmin) {
    return "admin";
  }

  return "user";
}
