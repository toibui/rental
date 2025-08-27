"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [newTenant, setNewTenant] = useState({
    fullName: "",
    dob: "",
    nationalId: "",
    hometown: "",
    phone: "",
    email: "",
    temporaryResidence: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({
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

  const addTenant = async () => {
    await axios.post("/api/tenants", {
      ...newTenant,
      dob: newTenant.dob ? new Date(newTenant.dob) : null,
    });
    setNewTenant({
      fullName: "",
      dob: "",
      nationalId: "",
      hometown: "",
      phone: "",
      email: "",
      temporaryResidence: "",
    });
    loadTenants();
  };

  const startEdit = (tenant: any) => {
    setEditingId(tenant.id);
    setEditData({
      fullName: tenant.fullName || "",
      dob: tenant.dob ? tenant.dob.substring(0, 10) : "",
      nationalId: tenant.nationalId || "",
      hometown: tenant.hometown || "",
      phone: tenant.phone || "",
      email: tenant.email || "",
      temporaryResidence: tenant.temporaryResidence || "",
    });
  };

  const saveEdit = async (id: number) => {
    await axios.put(`/api/tenants/${id}`, {
      ...editData,
      dob: editData.dob ? new Date(editData.dob) : null,
    });
    setEditingId(null);
    loadTenants();
  };

  const deleteTenant = async (id: number) => {
    await axios.delete(`/api/tenants/${id}`);
    loadTenants();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Quản lý khách thuê
      </h1>

      {/* Form thêm */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Thêm khách thuê mới</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            className="border p-2 rounded hover:border-gray-500"
            placeholder="Họ tên"
            value={newTenant.fullName}
            onChange={(e) =>
              setNewTenant({ ...newTenant, fullName: e.target.value })
            }
          />
          <input
            type="date"
            className="border p-2 rounded hover:border-gray-500"
            value={newTenant.dob}
            onChange={(e) => setNewTenant({ ...newTenant, dob: e.target.value })}
          />
          <input
            className="border p-2 rounded hover:border-gray-500"
            placeholder="CCCD/CMND"
            value={newTenant.nationalId}
            onChange={(e) =>
              setNewTenant({ ...newTenant, nationalId: e.target.value })
            }
          />
          <input
            className="border p-2 rounded hover:border-gray-500"
            placeholder="Quê quán"
            value={newTenant.hometown}
            onChange={(e) =>
              setNewTenant({ ...newTenant, hometown: e.target.value })
            }
          />
          <input
            className="border p-2 rounded hover:border-gray-500"
            placeholder="SĐT"
            value={newTenant.phone}
            onChange={(e) =>
              setNewTenant({ ...newTenant, phone: e.target.value })
            }
          />
          <input
            className="border p-2 rounded hover:border-gray-500"
            placeholder="Email"
            value={newTenant.email}
            onChange={(e) =>
              setNewTenant({ ...newTenant, email: e.target.value })
            }
          />
          <input
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400 col-span-2"
            placeholder="Đăng ký tạm trú"
            value={newTenant.temporaryResidence}
            onChange={(e) =>
              setNewTenant({
                ...newTenant,
                temporaryResidence: e.target.value,
              })
            }
          />
        </div>
        <button
          onClick={addTenant}
          className="w-full bg-gray-800 hover:bg-black text-white font-semibold py-2 rounded-xl shadow-md transition-all duration-200"
        >
          Thêm mới
        </button>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left text-gray-800">
              <th className="border p-3">STT</th>
              <th className="border p-3">Tên</th>
              <th className="border p-3">Ngày sinh</th>
              <th className="border p-3">CCCD/CMND</th>
              <th className="border p-3">Quê quán</th>
              <th className="border p-3">SĐT</th>
              <th className="border p-3">Email</th>
              <th className="border p-3">Tạm trú</th>
              <th className="border p-3 text-center">Hành động</th>
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
                  <td className="border p-2 font-medium">{idx + 1}</td>
                  <td className="border p-2">
                    {editingId === t.id ? (
                      <input
                        className="border p-1 rounded"
                        value={editData.fullName}
                        onChange={(e) =>
                          setEditData({ ...editData, fullName: e.target.value })
                        }
                      />
                    ) : (
                      t.fullName
                    )}
                  </td>
                  <td className="border p-2">
                    {editingId === t.id ? (
                      <input
                        type="date"
                        className="border p-1 rounded"
                        value={editData.dob}
                        onChange={(e) =>
                          setEditData({ ...editData, dob: e.target.value })
                        }
                      />
                    ) : t.dob ? new Date(t.dob).toLocaleDateString("vi-VN") : ""}
                  </td>
                  <td className="border p-2">
                    {editingId === t.id ? (
                      <input
                        className="border p-1 rounded"
                        value={editData.nationalId}
                        onChange={(e) =>
                          setEditData({ ...editData, nationalId: e.target.value })
                        }
                      />
                    ) : (
                      t.nationalId
                    )}
                  </td>
                  <td className="border p-2">
                    {editingId === t.id ? (
                      <input
                        className="border p-1 rounded"
                        value={editData.hometown}
                        onChange={(e) =>
                          setEditData({ ...editData, hometown: e.target.value })
                        }
                      />
                    ) : (
                      t.hometown
                    )}
                  </td>
                  <td className="border p-2">
                    {editingId === t.id ? (
                      <input
                        className="border p-1 rounded"
                        value={editData.phone}
                        onChange={(e) =>
                          setEditData({ ...editData, phone: e.target.value })
                        }
                      />
                    ) : (
                      t.phone
                    )}
                  </td>
                  <td className="border p-2">
                    {editingId === t.id ? (
                      <input
                        className="border p-1 rounded"
                        value={editData.email}
                        onChange={(e) =>
                          setEditData({ ...editData, email: e.target.value })
                        }
                      />
                    ) : (
                      t.email
                    )}
                  </td>
                  <td className="border p-2">
                    {editingId === t.id ? (
                      <input
                        className="border p-1 rounded"
                        value={editData.temporaryResidence}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            temporaryResidence: e.target.value,
                          })
                        }
                      />
                    ) : (
                      t.temporaryResidence
                    )}
                  </td>
                  <td className="border p-2 text-center space-x-2">
                    {editingId === t.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(t.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded shadow-sm transition-all"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded shadow-sm transition-all"
                        >
                          Hủy
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(t)}
                          className="bg-gray-700 hover:bg-black text-white px-3 py-1 rounded shadow-sm transition-all"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => deleteTenant(t.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow-sm transition-all"
                        >
                          Xóa
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-4 text-gray-500 italic"
                >
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
