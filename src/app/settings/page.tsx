"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SettingPage() {
  const [setting, setSetting] = useState<{ id: number; electricPrice: number; waterPrice: number } | null>(null);
  const [editData, setEditData] = useState({ electricPrice: "", waterPrice: "" });

  const loadSetting = async () => {
    const res = await axios.get("/api/settings");
    if (res.data.length > 0) {
      const s = res.data[0];
      setSetting(s);
      setEditData({
        electricPrice: s.electricPrice.toString(),
        waterPrice: s.waterPrice.toString(),
      });
    } else {
      setSetting(null);
      setEditData({ electricPrice: "", waterPrice: "" });
    }
  };

  useEffect(() => {
    loadSetting();
  }, []);

  const saveSetting = async () => {
    if (setting) {
      // Cập nhật
      await axios.put(`/api/settings/${setting.id}`, {
        electricPrice: parseFloat(editData.electricPrice) || 0,
        waterPrice: parseFloat(editData.waterPrice) || 0,
      });
    } else {
      // Tạo mới
      await axios.post("/api/settings", {
        electricPrice: parseFloat(editData.electricPrice) || 0,
        waterPrice: parseFloat(editData.waterPrice) || 0,
      });
    }
    loadSetting();
  };

  const deleteSetting = async () => {
    if (!setting) return;
    await axios.delete(`/api/settings/${setting.id}`);
    setSetting(null);
    setEditData({ electricPrice: "", waterPrice: "" });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Cài đặt giá điện – nước</h1>

      <div className="bg-white shadow-md rounded-2xl p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-semibold">Giá điện (VNĐ)</label>
            <input
              type="number"
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
              value={editData.electricPrice}
              onChange={(e) => setEditData({ ...editData, electricPrice: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Giá nước (VNĐ)</label>
            <input
              type="number"
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
              value={editData.waterPrice}
              onChange={(e) => setEditData({ ...editData, waterPrice: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={saveSetting}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            {setting ? "Cập nhật" : "Thêm"}
          </button>
          {setting && (
            <button
              onClick={deleteSetting}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
            >
              Xóa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
