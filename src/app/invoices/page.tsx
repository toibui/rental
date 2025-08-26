"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function InvoicePage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [newInvoice, setNewInvoice] = useState({
    roomId: "",
    month: "",
    status: "UNPAID",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    roomId: "",
    month: "",
    status: "",
  });

  // Load rooms và invoices
  const loadRooms = async () => {
    const res = await axios.get("/api/rooms");
    setRooms(res.data);
  };

  const loadInvoices = async () => {
    let query: string[] = [];
    if (filter.roomId) query.push(`roomId=${filter.roomId}`);
    if (filter.month) query.push(`month=${filter.month}`);
    if (filter.status) query.push(`status=${filter.status}`);
    const queryString = query.length ? `?${query.join("&")}` : "";

    const res = await axios.get(`/api/invoices${queryString}`);
    setInvoices(res.data);
  };

  useEffect(() => {
    loadRooms();
    loadInvoices();
  }, []);

  // Tạo hóa đơn tự động
  const createInvoice = async () => {
    if (!newInvoice.roomId || !newInvoice.month) {
      alert("Vui lòng chọn phòng và tháng");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("/api/invoices/auto", {
        roomId: Number(newInvoice.roomId),
        month: newInvoice.month,
        status: newInvoice.status,
      });
      alert(`Tạo hóa đơn thành công!\nTổng: ${res.data.total.toLocaleString("vi-VN")} VNĐ`);
      setNewInvoice({ roomId: "", month: "", status: "UNPAID" });
      loadInvoices();
    } catch (error) {
      console.error(error);
      alert("Có lỗi khi tạo hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (invoice: any) => {
    setEditingId(invoice.id);
    setEditData({
      roomId: invoice.roomId,
      month: invoice.month.slice(0, 7),
      status: invoice.status,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async (id: number) => {
    try {
      await axios.put(`/api/invoices/${id}`, {
        roomId: Number(editData.roomId),
        month: editData.month,
        status: editData.status,
      });
      setEditingId(null);
      setEditData({});
      loadInvoices();
    } catch (error) {
      console.error(error);
      alert("Có lỗi khi lưu hóa đơn");
    }
  };

  const deleteInvoice = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa hóa đơn này?")) return;
    try {
      await axios.delete(`/api/invoices/${id}`);
      loadInvoices();
    } catch (error) {
      console.error(error);
      alert("Có lỗi khi xóa hóa đơn");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Quản lý hóa đơn</h1>

      {/* Form thêm hóa đơn */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Thêm hóa đơn tự động</h2>
        <div className="flex gap-3 flex-wrap mb-4">
          <select
            className="border p-2 rounded hover:border-blue-400"
            value={newInvoice.roomId}
            onChange={(e) => setNewInvoice({ ...newInvoice, roomId: e.target.value })}
          >
            <option value="">Chọn phòng</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>{r.roomName}</option>
            ))}
          </select>

          <input
            type="month"
            className="border p-2 rounded"
            value={newInvoice.month}
            onChange={(e) => setNewInvoice({ ...newInvoice, month: e.target.value })}
          />

          <select
            className="border p-2 rounded"
            value={newInvoice.status}
            onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value })}
          >
            <option value="UNPAID">Chưa thanh toán</option>
            <option value="PAID">Đã thanh toán</option>
          </select>

          <button
            className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-200 ${loading ? "opacity-50" : ""}`}
            onClick={createInvoice}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Tạo hóa đơn"}
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-3 flex-wrap mb-4">
        <select
          className="border p-2 rounded"
          value={filter.roomId}
          onChange={(e) => setFilter({ ...filter, roomId: e.target.value })}
        >
          <option value="">Tất cả phòng</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>{r.roomName}</option>
          ))}
        </select>

        <input
          type="month"
          className="border p-2 rounded"
          value={filter.month}
          onChange={(e) => setFilter({ ...filter, month: e.target.value })}
        />

        <select
          className="border p-2 rounded"
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="UNPAID">Chưa thanh toán</option>
          <option value="PAID">Đã thanh toán</option>
        </select>

        <button
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl"
          onClick={loadInvoices}
        >
          Lọc
        </button>
      </div>

      {/* Bảng hóa đơn */}
      <div className="bg-white shadow-lg rounded-2xl overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-blue-100 text-left text-blue-800">
              <th className="border p-3">STT</th>
              <th className="border p-3">Phòng</th>
              <th className="border p-3">Tháng</th>
              <th className="border p-3">Tiền phòng</th>
              <th className="border p-3">Tiền điện</th>
              <th className="border p-3">Tiền nước</th>
              <th className="border p-3">Tổng</th>
              <th className="border p-3">Trạng thái</th>
              <th className="border p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 ? (
              invoices.map((invoice, idx) => (
                <tr key={invoice.id} className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition-colors`}>
                  <td className="border p-2 font-medium">{idx + 1}</td>

                  <td className="border p-2">
                    {editingId === invoice.id ? (
                      <select
                        className="border p-1 rounded"
                        value={editData.roomId}
                        onChange={(e) => setEditData({ ...editData, roomId: e.target.value })}
                      >
                        {rooms.map((r) => (
                          <option key={r.id} value={r.id}>{r.roomName}</option>
                        ))}
                      </select>
                    ) : (
                      invoice.room?.roomName
                    )}
                  </td>

                  <td className="border p-2">
                    {editingId === invoice.id ? (
                      <input
                        type="month"
                        className="border p-1 rounded"
                        value={editData.month}
                        onChange={(e) => setEditData({ ...editData, month: e.target.value })}
                      />
                    ) : (
                      new Date(invoice.month).toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" })
                    )}
                  </td>

                  <td className="border p-2">{invoice.roomPrice.toLocaleString("vi-VN")}</td>
                  <td className="border p-2">{invoice.electricCost.toLocaleString("vi-VN")}</td>
                  <td className="border p-2">{invoice.waterCost.toLocaleString("vi-VN")}</td>
                  <td className="border p-2 font-semibold">{invoice.total.toLocaleString("vi-VN")}</td>

                  <td className="border p-2">
                    {editingId === invoice.id ? (
                      <select
                        className="border p-1 rounded"
                        value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      >
                        <option value="UNPAID">Chưa thanh toán</option>
                        <option value="PAID">Đã thanh toán</option>
                      </select>
                    ) : (
                      invoice.status
                    )}
                  </td>

                  <td className="border p-2 text-center space-x-2">
                    {editingId === invoice.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(invoice.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow-sm transition-all"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded shadow-sm transition-all"
                        >
                          Hủy
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(invoice)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded shadow-sm transition-all"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => deleteInvoice(invoice.id)}
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
                <td colSpan={9} className="text-center py-4 text-gray-500 italic">
                  Chưa có hóa đơn
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
