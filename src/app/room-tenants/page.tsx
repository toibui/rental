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
  const [filters, setFilters] = useState({ roomId: "", tenantId: "" });

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
    if (!newRT.roomId || !newRT.tenantId) {
      alert("Vui lòng chọn phòng và người thuê!");
      return;
    }
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
    if (confirm("Bạn có chắc muốn xóa quan hệ này?")) {
      await axios.delete(`/api/room-tenants/${id}`);
      loadData();
    }
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
    if (!editData.roomId || !editData.tenantId) {
      alert("Vui lòng chọn phòng và người thuê!");
      return;
    }
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

  // filter client-side
  const filteredRT = roomTenants.filter((rt) => {
    return (
      (filters.roomId ? rt.roomId === Number(filters.roomId) : true) &&
      (filters.tenantId ? rt.tenantId === Number(filters.tenantId) : true)
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Quản lý phòng trọ - khách trọ</h1>

      {/* Form thêm RoomTenant */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Thêm mới</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <select
            className="border p-2 rounded hover:border-gray-500"
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
            className="border p-2 rounded hover:border-gray-500"
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
          className="w-full bg-gray-800 hover:bg-black text-white font-semibold py-2 rounded-xl shadow-md transition-all duration-200"
        >
          Thêm mới
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="bg-gray-100 shadow rounded-xl p-4 mb-6 flex gap-4">
        <select
          className="border p-2 rounded"
          value={filters.roomId}
          onChange={(e) => setFilters({ ...filters, roomId: e.target.value })}
        >
          <option value="">Lọc theo phòng</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.roomName}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded"
          value={filters.tenantId}
          onChange={(e) => setFilters({ ...filters, tenantId: e.target.value })}
        >
          <option value="">Lọc theo người thuê</option>
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>
              {t.fullName}
            </option>
          ))}
        </select>
        <button
          onClick={() => setFilters({ roomId: "", tenantId: "" })}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Xóa lọc
        </button>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left text-gray-800">
              <th className="border p-3">STT</th>
              <th className="border p-3">Phòng</th>
              <th className="border p-3">Người thuê</th>
              <th className="border p-3">Ngày bắt đầu</th>
              <th className="border p-3">Ngày kết thúc</th>
              <th className="border p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredRT.length > 0 ? (
              filteredRT.map((rt, idx) => (
                <tr
                  key={rt.id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition-colors`}
                >
                  <td className="border p-2 font-medium">{idx + 1}</td>
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
                    ) : rt.startDate ? (
                      new Date(rt.startDate).toLocaleDateString("vi-VN")
                    ) : (
                      ""
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
                    ) : rt.endDate ? (
                      new Date(rt.endDate).toLocaleDateString("vi-VN")
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="border p-2 text-center space-x-2">
                    {editingId === rt.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(rt.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded shadow-sm transition-all"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded shadow-sm transition-all"
                        >
                          Hủy
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(rt)}
                          className="bg-gray-700 hover:bg-black text-white px-3 py-1 rounded shadow-sm transition-all"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => deleteRT(rt.id)}
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
                <td colSpan={6} className="text-center py-4 text-gray-500 italic">
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
