"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [newRoom, setNewRoom] = useState({
    roomName: "",
    price: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    roomName: "",
    price: "",
  });

  const loadRooms = async () => {
    const res = await axios.get("/api/rooms");
    setRooms(res.data);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const addRoom = async () => {
    if (!newRoom.roomName || !newRoom.price) return;
    await axios.post("/api/rooms", {
      roomName: newRoom.roomName,
      price: parseFloat(newRoom.price) || 0,
    });
    setNewRoom({ roomName: "", price: "" });
    loadRooms();
  };

  const startEdit = (room: any) => {
    setEditingId(room.id);
    setEditData({
      roomName: room.roomName || "",
      price: room.price?.toString() || "",
    });
  };

  const saveEdit = async (id: number) => {
    await axios.put(`/api/rooms/${id}`, {
      roomName: editData.roomName,
      price: parseFloat(editData.price) || 0,
    });
    setEditingId(null);
    loadRooms();
  };

  const deleteRoom = async (id: number) => {
    await axios.delete(`/api/rooms/${id}`);
    loadRooms();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Quản lý thông tin phòng trọ</h1>

      {/* Form thêm phòng */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Thêm phòng mới</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <input
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            placeholder="Tên phòng"
            value={newRoom.roomName}
            onChange={(e) => setNewRoom({ ...newRoom, roomName: e.target.value })}
          />
          <input
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            placeholder="Tiền phòng"
            type="number"
            value={newRoom.price}
            onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
          />
        </div>
        <button
          onClick={addRoom}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow-md transition-all"
        >
          Thêm phòng
        </button>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white shadow-lg rounded-2xl overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-blue-100 text-left text-blue-800">
              <th className="border p-3">STT</th>
              <th className="border p-3">Tên phòng</th>
              <th className="border p-3">Tiền phòng</th>
              <th className="border p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length > 0 ? (
              rooms.map((room, idx) => (
                <tr
                  key={room.id}
                  className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition-colors`}
                >
                  <td className="border p-2 font-medium">{idx + 1}</td>
                  <td className="border p-2">
                    {editingId === room.id ? (
                      <input
                        className="border p-1 rounded w-full"
                        value={editData.roomName}
                        onChange={(e) => setEditData({ ...editData, roomName: e.target.value })}
                      />
                    ) : (
                      room.roomName
                    )}
                  </td>
                  <td className="border p-2">
                    {editingId === room.id ? (
                      <input
                        type="number"
                        className="border p-1 rounded w-full"
                        value={editData.price}
                        onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                      />
                    ) : (
                      room.price?.toLocaleString("vi-VN") + " đ"
                    )}
                  </td>
                  <td className="border p-2 text-center space-x-2">
                    {editingId === room.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(room.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow-sm transition-all"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded shadow-sm transition-all"
                        >
                          Hủy
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(room)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded shadow-sm transition-all"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => deleteRoom(room.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm transition-all"
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
                <td colSpan={4} className="text-center py-4 text-gray-500 italic">
                  Chưa có phòng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
