import { sql } from "@/lib/db";
import { isUserRole, type UserRole } from "@/lib/roles";
import type { CreateUserData, User, UserWithPassword } from "@/features/users/types";

type UserRow = {
  id: number;
  name: string;
  email: string;
  password_hash?: string;
  phone: string | null;
  role: string;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

function mapUser(row: UserRow): User {
  if (!isUserRole(row.role)) {
    throw new Error(`Invalid user role: ${row.role}`);
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    avatarUrl: row.avatar_url,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapUserWithPassword(row: UserRow): UserWithPassword {
  return {
    ...mapUser(row),
    passwordHash: row.password_hash ?? "",
  };
}

export async function findUserByEmail(email: string) {
  const rows = await sql<UserRow[]>`
    SELECT id, name, email, password_hash, phone, role, avatar_url, is_active, created_at, updated_at
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `;

  return rows[0] ? mapUserWithPassword(rows[0]) : null;
}

export async function findUserById(id: number) {
  const rows = await sql<UserRow[]>`
    SELECT id, name, email, phone, role, avatar_url, is_active, created_at, updated_at
    FROM users
    WHERE id = ${id}
    LIMIT 1
  `;

  return rows[0] ? mapUser(rows[0]) : null;
}

export async function getUsers() {
  const rows = await sql<UserRow[]>`
    SELECT id, name, email, phone, role, avatar_url, is_active, created_at, updated_at
    FROM users
    ORDER BY created_at DESC
  `;

  return rows.map(mapUser);
}

export async function getUsersByRole(role: UserRole) {
  const rows = await sql<UserRow[]>`
    SELECT id, name, email, phone, role, avatar_url, is_active, created_at, updated_at
    FROM users
    WHERE role = ${role}
    ORDER BY name ASC
  `;

  return rows.map(mapUser);
}

export async function createUser(data: CreateUserData) {
  const rows = await sql<UserRow[]>`
    INSERT INTO users (name, email, password_hash, phone, role)
    VALUES (${data.name}, ${data.email}, ${data.passwordHash}, ${data.phone ?? null}, ${data.role})
    RETURNING id, name, email, phone, role, avatar_url, is_active, created_at, updated_at
  `;

  return mapUser(rows[0]);
}

export async function updateUserStatus(id: number, isActive: boolean) {
  const rows = await sql<UserRow[]>`
    UPDATE users
    SET is_active = ${isActive}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING id, name, email, phone, role, avatar_url, is_active, created_at, updated_at
  `;

  return rows[0] ? mapUser(rows[0]) : null;
}
