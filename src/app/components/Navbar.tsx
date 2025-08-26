"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-gray-800 text-white px-6 py-3 flex items-center justify-between relative">
      {/* Logo / Tiêu đề */}
      <h1 className="text-lg">Quản lý trọ</h1>

      {/* Menu chính */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition text-base"
        >
          Menu
        </button>

        {open && (
          <ul className="absolute right-0 mt-2 w-56 bg-white text-black rounded-xl shadow-lg py-1">


            <li>
              <Link
                href="/room-tenants"
                className="block px-6 py-2 hover:bg-gray-200 text-sm"
                onClick={() => setOpen(false)}
              >
                Quản lý phòng trọ & khách thuê
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className="block px-6 py-2 hover:bg-gray-200 text-sm"
                onClick={() => setOpen(false)}
              >
                Cấu hình giá điện nước
              </Link>
            </li>
            <li>
              <Link
                href="/usages"
                className="block px-6 py-2 hover:bg-gray-200 text-sm"
                onClick={() => setOpen(false)}
              >
                Quản lý chỉ số điện nước
              </Link>
            </li>
            <li>
              <Link
                href="/invoices"
                className="block px-6 py-2 hover:bg-gray-200 text-sm"
                onClick={() => setOpen(false)}
              >
                Quản lý hóa đơn hàng tháng
              </Link>
            </li>
            <li>
              <Link
                href="/tenants"
                className="block px-6 py-2 hover:bg-gray-200 text-sm"
                onClick={() => setOpen(false)}
              >
                Quản lý thông tin khách thuê
              </Link>
            </li>
            <li>
              <Link
                href="/rooms"
                className="block px-6 py-2 hover:bg-gray-200 text-sm"
                onClick={() => setOpen(false)}
              >
                Cấu hình phòng trọ
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
