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
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Danh sách khách thuê</h1>

      {/* Form thêm */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <input
          className="border p-2 rounded"
          placeholder="Tên"
          value={newTenant.fullName}
          onChange={(e) =>
            setNewTenant({ ...newTenant, fullName: e.target.value })
          }
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={newTenant.dob}
          onChange={(e) =>
            setNewTenant({ ...newTenant, dob: e.target.value })
          }
        />
        <input
          className="border p-2 rounded"
          placeholder="CCCD/CMND"
          value={newTenant.nationalId}
          onChange={(e) =>
            setNewTenant({ ...newTenant, nationalId: e.target.value })
          }
        />
        <input
          className="border p-2 rounded"
          placeholder="Quê quán"
          value={newTenant.hometown}
          onChange={(e) =>
            setNewTenant({ ...newTenant, hometown: e.target.value })
          }
        />
        <input
          className="border p-2 rounded"
          placeholder="SĐT"
          value={newTenant.phone}
          onChange={(e) =>
            setNewTenant({ ...newTenant, phone: e.target.value })
          }
        />
        <input
          className="border p-2 rounded"
          placeholder="Email"
          value={newTenant.email}
          onChange={(e) =>
            setNewTenant({ ...newTenant, email: e.target.value })
          }
        />
        <input
          className="border p-2 rounded col-span-2"
          placeholder="Đăng ký tạm trú"
          value={newTenant.temporaryResidence}
          onChange={(e) =>
            setNewTenant({
              ...newTenant,
              temporaryResidence: e.target.value,
            })
          }
        />
        <button
          onClick={addTenant}
          className="bg-blue-500 text-white px-4 py-2 rounded col-span-2"
        >
          Thêm
        </button>
      </div>

      {/* Bảng danh sách */}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Ngày sinh</th>
            <th className="border p-2">CCCD/CMND</th>
            <th className="border p-2">Quê quán</th>
            <th className="border p-2">SĐT</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Tạm trú</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((t) => (
            <tr key={t.id}>
              <td className="border p-2">{t.id}</td>
              <td className="border p-2">
                {editingId === t.id ? (
                  <input
                    className="border p-1"
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
                    className="border p-1"
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
                    className="border p-1"
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
                    className="border p-1"
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
                    className="border p-1"
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
                    className="border p-1"
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
                    className="border p-1"
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
              <td className="border p-2 flex gap-2">
                {editingId === t.id ? (
                  <>
                    <button
                      onClick={() => saveEdit(t.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 text-white px-2 py-1 rounded"
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(t)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => deleteTenant(t.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Xóa
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
