"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex items-center justify-between">
        {/* Logo / Trang chủ */}
        <Link href="/" className="text-white text-xl font-bold">
          Quản lý trọ
        </Link>

        {/* Menu */}
        <div className="relative group">
          {/* Icon menu */}
          <button className="text-white p-2">
            <Menu size={28} />
          </button>

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
            <Link
              href="/invoices"
              className="block px-4 py-2 hover:bg-gray-100 rounded-b-lg"
            >
              Quản lý hoá đơn
            </Link>
            <Link
              href="/usages"
              className="block px-4 py-2 hover:bg-gray-100 rounded-b-lg"
            >
              Quản lý chỉ số
            </Link>
            <Link
              href="/settings"
              className="block px-4 py-2 hover:bg-gray-100 rounded-b-lg"
            >
              Giá điện nước
            </Link>
            <Link
              href="/room-tenants"
              className="block px-4 py-2 hover:bg-gray-100 rounded-t-lg"
            >
              Quản lý phòng
            </Link>
            <Link
              href="/tenants"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Quản lý người thuê
            </Link>
            <Link
              href="/rooms"
              className="block px-4 py-2 hover:bg-gray-100 rounded-b-lg"
            >
              Thông tin phòng
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
}
