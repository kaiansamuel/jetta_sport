import { auth } from "@/auth";
import { logoutAction } from "../actions";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-jetta-black">
      <header className="flex items-center justify-between border-b border-jetta-metal/15 px-6 py-4">
        <span className="font-display text-sm font-bold tracking-widest text-jetta-ice uppercase">
          Jetta Sport · Admin
        </span>
        {session?.user && (
          <form action={logoutAction} className="flex items-center gap-3">
            <span className="text-sm text-jetta-metal">{session.user.email}</span>
            <button
              type="submit"
              className="text-sm text-jetta-metal underline-offset-4 hover:text-jetta-red hover:underline"
            >
              Sair
            </button>
          </form>
        )}
      </header>
      <div className="flex">
        <AdminSidebar />
        <main className="min-w-0 flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
