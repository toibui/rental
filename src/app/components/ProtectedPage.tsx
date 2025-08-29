"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProtectedPageProps {
  children: React.ReactNode;
  role?: "user" | "admin"; // nếu muốn giới hạn quyền
}

export default function ProtectedPage({ children, role }: ProtectedPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (role && session?.user?.role !== role) {
      router.push("/"); // không đủ quyền thì về login
    }
  }, [status, session, role, router]);  

  if (status === "loading") {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center text-gray-500">
        Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  if (!session) return null; // chưa login → không render gì

  return <>{children}</>;
}
