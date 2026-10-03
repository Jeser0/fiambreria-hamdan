import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export async function getAdminSession() {
  const supabase = await createClient();
  // getUser verifies with Auth; never authorize using unverified cookie/session metadata.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user || user.is_anonymous) return null;
  const membership = await supabase
    .from("admin_users")
    .select("user_id, role, active")
    .eq("user_id", user.id)
    .eq("active", true)
    .in("role", ["owner", "admin", "editor"])
    .maybeSingle();
  if (membership.error || !membership.data) return null;
  return { supabase, user };
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
