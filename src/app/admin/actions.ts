"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/admin-auth";
import { parseProductEdit, type ProductEditResult } from "@/lib/admin-product";

export async function login(_previous: { message: string }, form: FormData) {
  const email = form.get("email");
  const password = form.get("password");
  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    email.length > 254 ||
    typeof password !== "string" ||
    !password.length ||
    password.length > 1024
  )
    return { message: "Ingresá tu correo y contraseña." };
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error)
      return {
        message:
          "No pudimos iniciar sesión. Revisá tus datos e intentá nuevamente.",
      };
    if (!(await getAdminSession())) {
      await supabase.auth.signOut({ scope: "local" });
      return { message: "Esta cuenta no tiene acceso a la administración." };
    }
  } catch {
    return {
      message:
        "El acceso no está disponible en este momento. Intentá nuevamente.",
    };
  }
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error)
    throw new Error("No pudimos cerrar la sesión. Intentá nuevamente.");
  redirect("/admin/login");
}

export async function saveProduct(
  previous: ProductEditResult,
  form: FormData,
): Promise<ProductEditResult> {
  const failure = (message: string): ProductEditResult => ({
    ok: false,
    message,
    updatedAt: previous?.updatedAt,
  });
  try {
    const session = await getAdminSession();
    if (!session)
      return failure("Tu sesión no tiene permiso. Volvé a iniciar sesión.");
    const { id, updatedAt, changes } = parseProductEdit(form);
    const result = await session.supabase
      .from("products")
      .update(changes)
      .eq("id", id)
      .eq("updated_at", updatedAt)
      .select("updated_at")
      .maybeSingle();
    if (result.error)
      return failure("No pudimos guardar los cambios. Intentá nuevamente.");
    if (!result.data)
      return failure(
        "El producto cambió o ya no está disponible. Actualizá el panel antes de editar.",
      );
    revalidatePath("/mayorista");
    revalidatePath("/minorista");
    revalidatePath("/pedido", "layout");
    return {
      ok: true,
      message:
        "Cambios guardados. Las tiendas ya pueden consultar los nuevos valores.",
      updatedAt: result.data.updated_at,
    };
  } catch (error) {
    return failure(
      error instanceof Error && error.message.startsWith("Ingresá")
        ? error.message
        : "No pudimos guardar. Revisá los datos o actualizá el panel.",
    );
  }
}
