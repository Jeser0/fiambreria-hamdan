import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return (
    <div className="mx-auto mt-8 max-w-md rounded-3xl border border-[#8f1f23]/15 bg-white/80 p-6 shadow-sm sm:p-8">
      <h1 className="font-display text-3xl font-black text-[#742026]">
        Ingresar al panel
      </h1>
      <p className="mt-3 text-sm leading-6 text-[#796052]">
        Usá el correo y la contraseña de tu cuenta administradora.
      </p>
      <AdminLoginForm />
    </div>
  );
}
