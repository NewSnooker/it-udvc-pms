import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { Session } from "next-auth";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const session: Session | null = await getServerSession(authOptions);

  if (session && session?.user) {
    const { id, email, role, name } = session.user as AuthUser;
    return { id, email, role, name };
  }

  return null;
}
