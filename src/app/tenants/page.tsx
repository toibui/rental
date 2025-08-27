"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    nationalId: "",
    hometown: "",
    phone: "",
    email: "",
    temporaryResidence: "",
  });

  const loadTenants = async () => {
    const res = await axios.get("/api/tenants");
    setTenants(res.data);
  };

  useEffect(() => {
    loadTenants();
  }, []);

  // xử lý submit (thêm mới hoặc lưu sửa)
  const handleSubmit = async () => {
    if (editingId) {
      // sửa
      await axios.put(`/api/tenants/${editingId}`, {
        ...formData,
        dob: formData.dob ? new Date(formData.dob) : null,
      });
    } else {
      // thêm mới
      await axios.post("/api/tenants", {
        ...formData,
        dob: formData.dob ? new Date(formData.dob) : null,
      });
    }

    // reset
    setFormData({
      fullName: "",
      dob: "",
      nationalId: "",
      hometown: "",
      phone: "",
      email: "",
      temporaryResidence: "",
    });
    setEditingId(null);
    loadTenants();
  };

  // bắt đầu sửa
  const startEdit = (tenant: any) => {
    setEditingId(tenant.id);
    setFormData({
      fullName: tenant.fullName || "",
      dob: tenant.dob ? tenant.dob.substring(0, 10) : "",
      nationalId: tenant.nationalId || "",
      hometown: tenant.hometown || "",
      phone: tenant.phone || "",
      email: tenant.email || "",
      temporaryResidence: tenant.temporaryResidence || "",
    });
  };

  const deleteTenant = async (id: number) => {
    await axios.delete(`/api/tenants/${id}`);
    loadTenants();
  };

  return (
    <div className="p-6 w-full max-w-full">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Quản lý khách thuê
      </h1>

      {/* Form thêm/sửa (tái sử dụng chung) */}
      <div
        className={`${
          editingId ? "bg-yellow-50" : "bg-white"
        } shadow-lg rounded-2xl p-6 mb-6 w-full`}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {editingId ? "Chỉnh sửa khách thuê" : "Thêm khách thuê mới"}
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            className="border p-2 rounded"
            placeholder="Họ tên"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="CCCD/CMND"
            value={formData.nationalId}
            onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Quê quán"
            value={formData.hometown}
            onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="SĐT"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            className="border p-2 rounded col-span-2"
            placeholder="Đăng ký tạm trú"
            value={formData.temporaryResidence}
            onChange={(e) =>
              setFormData({ ...formData, temporaryResidence: e.target.value })
            }
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className={`${
              editingId ? "bg-green-600 hover:bg-green-700" : "bg-gray-800 hover:bg-black"
            } text-white px-4 py-2 rounded shadow`}
          >
            {editingId ? "Lưu" : "Thêm mới"}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  fullName: "",
                  dob: "",
                  nationalId: "",
                  hometown: "",
                  phone: "",
                  email: "",
                  temporaryResidence: "",
                });
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow"
            >
              Hủy
            </button>
          )}
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full table-auto border rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left text-gray-800">
              <th className="px-4 py-2 border">STT</th>
              <th className="px-4 py-2 border">Tên</th>
              <th className="px-4 py-2 border">Ngày sinh</th>
              <th className="px-4 py-2 border">CCCD/CMND</th>
              <th className="px-4 py-2 border">Quê quán</th>
              <th className="px-4 py-2 border">SĐT</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Tạm trú</th>
              <th className="px-4 py-2 border text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {tenants.length > 0 ? (
              tenants.map((t, idx) => (
                <tr
                  key={t.id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition-colors`}
                >
                  <td className="border p-2 text-center">{idx + 1}</td>
                  <td className="border p-2">{t.fullName}</td>
                  <td className="border p-2">
                    {t.dob ? new Date(t.dob).toLocaleDateString("vi-VN") : ""}
                  </td>
                  <td className="border p-2">{t.nationalId}</td>
                  <td className="border p-2">{t.hometown}</td>
                  <td className="border p-2">{t.phone}</td>
                  <td className="border p-2">{t.email}</td>
                  <td className="border p-2">{t.temporaryResidence}</td>
                  <td className="border p-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => startEdit(t)}
                        className="bg-gray-700 hover:bg-black text-white px-3 py-1 rounded shadow-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => deleteTenant(t.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow-sm"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-500 italic">
                  Chưa có khách thuê nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
