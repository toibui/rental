// app/components/ProtectedPage.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../lib/authOptions";

interface ProtectedPageProps {
  children: React.ReactNode;
  role?: "user" | "admin"; // nếu muốn giới hạn quyền
}

export default async function ProtectedPage({
  children,
  role,
}: ProtectedPageProps) {
  const session = await getServerSession(authOptions);

  // Nếu chưa login → về trang login
  if (!session) {
    redirect("/login");
  }

  // Nếu có yêu cầu role → check
  if (role && session.user.role !== role) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
