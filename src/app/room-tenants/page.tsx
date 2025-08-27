"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RoomTenantsPage() {
  const [roomTenants, setRoomTenants] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    roomId: "",
    tenantId: "",
    startDate: "",
    endDate: "",
  });

  const loadData = async () => {
    const [rtRes, rRes, tRes] = await Promise.all([
      axios.get("/api/room-tenants"),
      axios.get("/api/rooms"),
      axios.get("/api/tenants"),
    ]);
    setRoomTenants(rtRes.data);
    setRooms(rRes.data);
    setTenants(tRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Thêm mới hoặc lưu sửa
  const handleSubmit = async () => {
    if (editingId) {
      await axios.put(`/api/room-tenants/${editingId}`, formData);
    } else {
      await axios.post("/api/room-tenants", formData);
    }

    setFormData({
      roomId: "",
      tenantId: "",
      startDate: "",
      endDate: "",
    });
    setEditingId(null);
    loadData();
  };

  const startEdit = (rt: any) => {
    setEditingId(rt.id);
    setFormData({
      roomId: rt.roomId || "",
      tenantId: rt.tenantId || "",
      startDate: rt.startDate ? rt.startDate.substring(0, 10) : "",
      endDate: rt.endDate ? rt.endDate.substring(0, 10) : "",
    });
  };

  const deleteRT = async (id: number) => {
    await axios.delete(`/api/room-tenants/${id}`);
    loadData();
  };

  return (
    <div className="p-6 w-full max-w-full">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Quản lý Hợp đồng thuê phòng
      </h1>

      {/* Form thêm/sửa */}
      <div
        className={`${
          editingId ? "bg-yellow-50" : "bg-white"
        } shadow-lg rounded-2xl p-6 mb-6 w-full`}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {editingId ? "Chỉnh sửa hợp đồng" : "Thêm hợp đồng mới"}
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <select
            className="border p-2 rounded"
            value={formData.roomId}
            onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
          >
            <option value="">Chọn phòng</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.roomName}
              </option>
            ))}
          </select>
          <select
            className="border p-2 rounded"
            value={formData.tenantId}
            onChange={(e) =>
              setFormData({ ...formData, tenantId: e.target.value })
            }
          >
            <option value="">Chọn người thuê</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.fullName} ({t.phone})
              </option>
            ))}
          </select>
          <input
            type="date"
            className="border p-2 rounded"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className={`${
              editingId
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-800 hover:bg-black"
            } text-white px-4 py-2 rounded shadow`}
          >
            {editingId ? "Lưu" : "Thêm mới"}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  roomId: "",
                  tenantId: "",
                  startDate: "",
                  endDate: "",
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
              <th className="px-4 py-2 border">Phòng</th>
              <th className="px-4 py-2 border">Người thuê</th>
              <th className="px-4 py-2 border">Ngày bắt đầu</th>
              <th className="px-4 py-2 border">Ngày kết thúc</th>
              <th className="px-4 py-2 border text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {roomTenants.length > 0 ? (
              roomTenants.map((rt, idx) => (
                <tr
                  key={rt.id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition-colors`}
                >
                  <td className="border p-2 text-center">{idx + 1}</td>
                  <td className="border p-2">
                    {rooms.find((r) => r.id === rt.roomId)?.roomName}
                  </td>
                  <td className="border p-2">
                    {tenants.find((t) => t.id === rt.tenantId)?.fullName}
                  </td>
                  <td className="border p-2">
                    {rt.startDate
                      ? new Date(rt.startDate).toLocaleDateString("vi-VN")
                      : ""}
                  </td>
                  <td className="border p-2">
                    {rt.endDate
                      ? new Date(rt.endDate).toLocaleDateString("vi-VN")
                      : ""}
                  </td>
                  <td className="border p-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => startEdit(rt)}
                        className="bg-gray-700 hover:bg-black text-white px-3 py-1 rounded shadow-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => deleteRT(rt.id)}
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
                <td colSpan={6} className="text-center py-4 text-gray-500 italic">
                  Chưa có hợp đồng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
