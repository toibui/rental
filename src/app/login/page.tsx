"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (!res?.error) {
      router.push("/admin"); // login xong vào admin
    } else {
      alert("Sai email hoặc mật khẩu");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <form
        onSubmit={handleLogin}
        className="p-6 border rounded shadow-md flex flex-col gap-3"
      >
        <h1 className="text-xl font-bold">Đăng nhập</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
