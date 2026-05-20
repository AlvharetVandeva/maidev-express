import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

import { SESSION_COOKIE_NAME, type SessionPayload } from "@/lib/session";
import { isUserRole, roleDashboardPath, type UserRole } from "@/lib/roles";

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

export async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const secret = getSecretKey();

  if (!token || !secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret);

    if (
      typeof payload.userId !== "number" ||
      typeof payload.name !== "string" ||
      typeof payload.email !== "string" ||
      !isUserRole(payload.role)
    ) {
      return null;
    }

    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export function redirectToRoleDashboard(request: NextRequest, role: UserRole) {
  return NextResponse.redirect(new URL(roleDashboardPath[role], request.url));
}
