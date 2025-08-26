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
    await axios.post("/api/rooms", {
      roomName: newRoom.roomName,
      price: parseFloat(newRoom.price) || 0,
    });
    setNewRoom({
      roomName: "",
      price: "",
    });
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
      <h1 className="text-2xl font-bold mb-6 text-center">Quản lý phòng</h1>

      {/* Form thêm phòng */}
      <div className="bg-white shadow-md rounded-2xl p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Thêm phòng mới</h2>
        <div className="grid grid-cols-2 gap-3">
          <input
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            placeholder="Tên phòng"
            value={newRoom.roomName}
            onChange={(e) =>
              setNewRoom({ ...newRoom, roomName: e.target.value })
            }
          />
          <input
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            placeholder="Tiền phòng"
            type="number"
            value={newRoom.price}
            onChange={(e) =>
              setNewRoom({ ...newRoom, price: e.target.value })
            }
          />
        </div>
        <button
          onClick={addRoom}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          Thêm phòng
        </button>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white shadow-md rounded-2xl overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2">ID</th>
              <th className="border p-2">Tên phòng</th>
              <th className="border p-2">Tiền phòng</th>
              <th className="border p-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room, idx) => (
              <tr
                key={room.id}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="border p-2">{room.id}</td>
                <td className="border p-2">
                  {editingId === room.id ? (
                    <input
                      className="border p-1 rounded w-full"
                      value={editData.roomName}
                      onChange={(e) =>
                        setEditData({ ...editData, roomName: e.target.value })
                      }
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
                      onChange={(e) =>
                        setEditData({ ...editData, price: e.target.value })
                      }
                    />
                  ) : (
                    room.price?.toLocaleString("vi-VN") + " đ"
                  )}
                </td>
                <td className="border p-2 text-center">
                  {editingId === room.id ? (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => saveEdit(room.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => startEdit(room)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => deleteRoom(room.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Xóa
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
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
