"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RoomTenantsPage() {
  const [roomTenants, setRoomTenants] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [newRT, setNewRT] = useState({
    roomId: "",
    tenantId: "",
    startDate: "",
    endDate: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});

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

  const addRoomTenant = async () => {
    await axios.post("/api/room-tenants", {
      roomId: Number(newRT.roomId),
      tenantId: Number(newRT.tenantId),
      startDate: newRT.startDate || new Date(),
      endDate: newRT.endDate || null,
    });
    setNewRT({ roomId: "", tenantId: "", startDate: "", endDate: "" });
    loadData();
  };

  const deleteRT = async (id: number) => {
    await axios.delete(`/api/room-tenants/${id}`);
    loadData();
  };

  const startEdit = (rt: any) => {
    setEditingId(rt.id);
    setEditData({
      roomId: rt.roomId,
      tenantId: rt.tenantId,
      startDate: rt.startDate ? rt.startDate.slice(0, 10) : "",
      endDate: rt.endDate ? rt.endDate.slice(0, 10) : "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async (id: number) => {
    await axios.put(`/api/room-tenants/${id}`, {
      roomId: Number(editData.roomId),
      tenantId: Number(editData.tenantId),
      startDate: editData.startDate || new Date(),
      endDate: editData.endDate || null,
    });
    setEditingId(null);
    setEditData({});
    loadData();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Quản lý Room-Tenant</h1>

      {/* Form thêm RoomTenant */}
      <div className="bg-white shadow-md rounded-2xl p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Thêm quan hệ phòng - người thuê</h2>
        <div className="grid grid-cols-2 gap-3">
          <select
            className="border p-2 rounded"
            value={newRT.roomId}
            onChange={(e) => setNewRT({ ...newRT, roomId: e.target.value })}
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
            value={newRT.tenantId}
            onChange={(e) => setNewRT({ ...newRT, tenantId: e.target.value })}
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
            value={newRT.startDate}
            onChange={(e) => setNewRT({ ...newRT, startDate: e.target.value })}
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={newRT.endDate}
            onChange={(e) => setNewRT({ ...newRT, endDate: e.target.value })}
          />
        </div>
        <button
          onClick={addRoomTenant}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          Thêm quan hệ
        </button>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white shadow-md rounded-2xl overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2">ID</th>
              <th className="border p-2">Phòng</th>
              <th className="border p-2">Người thuê</th>
              <th className="border p-2">Ngày bắt đầu</th>
              <th className="border p-2">Ngày kết thúc</th>
              <th className="border p-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {roomTenants.map((rt, idx) => (
              <tr key={rt.id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="border p-2">{rt.id}</td>
                <td className="border p-2">
                  {editingId === rt.id ? (
                    <select
                      className="border p-1 rounded"
                      value={editData.roomId}
                      onChange={(e) => setEditData({ ...editData, roomId: e.target.value })}
                    >
                      {rooms.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.roomName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    rt.room?.roomName
                  )}
                </td>
                <td className="border p-2">
                  {editingId === rt.id ? (
                    <select
                      className="border p-1 rounded"
                      value={editData.tenantId}
                      onChange={(e) => setEditData({ ...editData, tenantId: e.target.value })}
                    >
                      {tenants.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.fullName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    rt.tenant?.fullName
                  )}
                </td>
                <td className="border p-2">
                  {editingId === rt.id ? (
                    <input
                      type="date"
                      className="border p-1 rounded"
                      value={editData.startDate}
                      onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                    />
                  ) : (
                    rt.startDate ? new Date(rt.startDate).toLocaleDateString("vi-VN") : ""
                  )}
                </td>
                <td className="border p-2">
                  {editingId === rt.id ? (
                    <input
                      type="date"
                      className="border p-1 rounded"
                      value={editData.endDate || ""}
                      onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
                    />
                  ) : (
                    rt.endDate ? new Date(rt.endDate).toLocaleDateString("vi-VN") : "—"
                  )}
                </td>
                <td className="border p-2 text-center space-x-2">
                  {editingId === rt.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(rt.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(rt)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => deleteRT(rt.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Xóa
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {roomTenants.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Chưa có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
