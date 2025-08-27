"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UsagePage() {
  const [usages, setUsages] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [newUsage, setNewUsage] = useState({
    roomId: "",
    month: "",
    electricReading: "",
    waterReading: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});

  const [filters, setFilters] = useState({
    roomId: "",
    month: "",
  });

  const loadData = async () => {
    const [usageRes, roomRes] = await Promise.all([
      axios.get("/api/usages"),
      axios.get("/api/rooms"),
    ]);
    setUsages(usageRes.data);
    setRooms(roomRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addUsage = async () => {
    if (!newUsage.roomId || !newUsage.month) {
      alert("Vui lòng chọn phòng và tháng!");
      return;
    }
    await axios.post("/api/usages", {
      roomId: Number(newUsage.roomId),
      month: newUsage.month || new Date(),
      electricReading: parseFloat(newUsage.electricReading) || 0,
      waterReading: parseFloat(newUsage.waterReading) || 0,
    });
    setNewUsage({ roomId: "", month: "", electricReading: "", waterReading: "" });
    loadData();
  };

  const deleteUsage = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa bản ghi này?")) {
      await axios.delete(`/api/usages/${id}`);
      loadData();
    }
  };

  const startEdit = (usage: any) => {
    setEditingId(usage.id);
    setEditData({
      roomId: usage.roomId,
      month: usage.month ? usage.month.slice(0, 7) : "",
      electricReading: usage.electricReading,
      waterReading: usage.waterReading,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async (id: number) => {
    if (!editData.roomId || !editData.month) {
      alert("Vui lòng chọn phòng và tháng!");
      return;
    }
    await axios.put(`/api/usages/${id}`, {
      roomId: Number(editData.roomId),
      month: editData.month || new Date(),
      electricReading: parseFloat(editData.electricReading) || 0,
      waterReading: parseFloat(editData.waterReading) || 0,
    });
    setEditingId(null);
    setEditData({});
    loadData();
  };

  // Filter dữ liệu theo state filters
  const filteredUsages = usages.filter((u) => {
    const matchRoom = filters.roomId ? u.roomId === Number(filters.roomId) : true;
    const matchMonth = filters.month ? u.month.startsWith(filters.month) : true;
    return matchRoom && matchMonth;
  });

  return (
    <div className="p-6 w-full max-w-full">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">Quản lý chỉ số điện nước</h1>

      {/* Form thêm Usage */}
      <div className="bg-white shadow rounded-2xl p-6 mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Thêm chỉ số mới</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <select
            className="border p-2 rounded"
            value={newUsage.roomId}
            onChange={(e) => setNewUsage({ ...newUsage, roomId: e.target.value })}
          >
            <option value="">Chọn phòng</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.roomName}
              </option>
            ))}
          </select>
          <input
            type="month"
            className="border p-2 rounded"
            value={newUsage.month}
            onChange={(e) => setNewUsage({ ...newUsage, month: e.target.value })}
          />
          <input
            type="number"
            className="border p-2 rounded"
            placeholder="Điện (kWh)"
            value={newUsage.electricReading}
            onChange={(e) => setNewUsage({ ...newUsage, electricReading: e.target.value })}
          />
          <input
            type="number"
            className="border p-2 rounded"
            placeholder="Nước (m³)"
            value={newUsage.waterReading}
            onChange={(e) => setNewUsage({ ...newUsage, waterReading: e.target.value })}
          />
        </div>
        <button
          onClick={addUsage}
          className="w-full bg-gray-800 hover:bg-black text-white font-semibold py-2 rounded-xl shadow transition-all duration-200"
        >
          Thêm Usage
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white shadow rounded-2xl p-4 mb-4 border border-gray-200">
        <h3 className="font-semibold mb-2 text-gray-700">Bộ lọc</h3>
        <div className="flex space-x-4">
          <select
            className="border p-2 rounded"
            value={filters.roomId}
            onChange={(e) => setFilters({ ...filters, roomId: e.target.value })}
          >
            <option value="">Tất cả phòng</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.roomName}
              </option>
            ))}
          </select>
          <input
            type="month"
            className="border p-2 rounded"
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: e.target.value })}
          />
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white shadow rounded-2xl overflow-hidden border border-gray-200">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left text-gray-800">
              <th className="border p-3">STT</th>
              <th className="border p-3">Phòng</th>
              <th className="border p-3">Tháng</th>
              <th className="border p-3">Điện</th>
              <th className="border p-3">Nước</th>
              <th className="border p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsages.length > 0 ? (
              filteredUsages.map((usage, idx) => (
                <tr
                  key={usage.id}
                  className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                >
                  <td className="border p-2 font-medium">{idx + 1}</td>
                  <td className="border p-2">
                    {editingId === usage.id ? (
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
                      usage.room?.roomName
                    )}
                  </td>
                  <td className="border p-2">
                    {editingId === usage.id ? (
                      <input
                        type="month"
                        className="border p-1 rounded"
                        value={editData.month}
                        onChange={(e) => setEditData({ ...editData, month: e.target.value })}
                      />
                    ) : (
                      new Date(usage.month).toLocaleDateString("vi-VN", {
                        month: "2-digit",
                        year: "numeric",
                      })
                    )}
                  </td>
                  <td className="border p-2">
                    {editingId === usage.id ? (
                      <input
                        type="number"
                        className="border p-1 rounded"
                        value={editData.electricReading}
                        onChange={(e) => setEditData({ ...editData, electricReading: e.target.value })}
                      />
                    ) : (
                      usage.electricReading.toLocaleString("vi-VN")
                    )}
                  </td>
                  <td className="border p-2">
                    {editingId === usage.id ? (
                      <input
                        type="number"
                        className="border p-1 rounded"
                        value={editData.waterReading}
                        onChange={(e) => setEditData({ ...editData, waterReading: e.target.value })}
                      />
                    ) : (
                      usage.waterReading.toLocaleString("vi-VN")
                    )}
                  </td>
                  <td className="border p-2 text-center space-x-2">
                    {editingId === usage.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(usage.id)}
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
                          onClick={() => startEdit(usage)}
                          className="bg-gray-700 hover:bg-black text-white px-3 py-1 rounded shadow-sm transition-all"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => deleteUsage(usage.id)}
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
