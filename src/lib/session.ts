import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { findUserById } from "@/features/users/repository";
import { isUserRole, roleDashboardPath, type UserRole } from "@/lib/roles";

export const SESSION_COOKIE_NAME = "cargoku_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

export type SessionPayload = {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
};

function getSecretKey() {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters");
  }

  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function createSession(payload: SessionPayload) {
  const token = await signSession(payload);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function verifySession(token?: string): Promise<SessionPayload | null> {
  try {
    const sessionToken =
      token ?? (await cookies()).get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) return null;

    const { payload } = await jwtVerify(sessionToken, getSecretKey());
    const role = payload.role;

    if (
      typeof payload.userId !== "number" ||
      typeof payload.name !== "string" ||
      typeof payload.email !== "string" ||
      !isUserRole(role)
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
      role,
    };
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser() {
  const session = await verifySession();
  if (!session) return null;

  return findUserById(session.userId);
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user || !user.isActive) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireUser();

  if (!allowedRoles.includes(user.role)) {
    redirect(roleDashboardPath[user.role]);
  }

  return user;
}
