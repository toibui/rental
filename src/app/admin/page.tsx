"use client";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const [editingUser, setEditingUser] = useState<any>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("user");
  const [editPassword, setEditPassword] = useState("");

  // Lấy danh sách user khi vào trang
  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Tạo user mới
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Tạo user thành công!");
      fetchUsers();
      setEmail("");
      setPassword("");
      setRole("user");
    } else {
      alert(data.error || "Có lỗi xảy ra");
    }
  };

  // Xoá user
  const handleDeleteUser = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xoá user này?")) return;

    const res = await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Xoá user thành công!");
      setUsers(users.filter((u) => u.id !== id));
    } else {
      alert(data.error || "Có lỗi xảy ra");
    }
  };

  // Sửa user
  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditPassword("");
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingUser.id,
        email: editEmail,
        role: editRole,
        password: editPassword || undefined,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Cập nhật user thành công!");
      setEditingUser(null);
      fetchUsers();
    } else {
      alert(data.error || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Trang Admin</h1>

      {/* Form tạo user */}
      <form
        onSubmit={handleCreateUser}
        className="bg-white p-4 rounded-xl shadow-md mb-6 max-w-md"
      >
        <h2 className="text-lg font-semibold mb-2">Tạo User mới</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          className="w-full p-2 border rounded mb-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Tạo User
        </button>
      </form>

      {/* Danh sách user */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-2">Danh sách User</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="border p-2">{u.id}</td>
                <td className="border p-2">{u.email}</td>
                <td className="border p-2">{u.role}</td>
                <td className="border p-2">
                  {new Date(u.createdAt).toLocaleString()}
                </td>
                <td className="border p-2 text-center space-x-2">
                  <button
                    onClick={() => handleEditUser(u)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Form sửa user */}
        {editingUser && (
          <form
            onSubmit={handleUpdateUser}
            className="mt-4 bg-gray-50 p-4 rounded-xl"
          >
            <h3 className="font-semibold mb-2">
              Sửa User ID {editingUser.id}
            </h3>
            <input
              type="email"
              className="w-full p-2 border rounded mb-2"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Mật khẩu mới (bỏ trống nếu không đổi)"
              className="w-full p-2 border rounded mb-2"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
            />
            <select
              className="w-full p-2 border rounded mb-2"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Lưu
              </button>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
