"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      {/* Tiêu đề */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Hệ thống quản lý phòng trọ
      </h1>

      {/* Mô tả */}
      <p className="text-gray-600 mb-8 text-center max-w-xl">
        Quản lý thông tin phòng, khách thuê, theo dõi điện nước hàng tháng và
        tạo hóa đơn dễ dàng.
      </p>

      {/* Grid các chức năng */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        <Link
          href="/rooms"
          className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold mb-2">Cấu hình phòng trọ</h2>
          <p className="text-sm text-gray-500">
            Thêm, sửa, xóa và cấu hình các phòng trong hệ thống.
          </p>
        </Link>

        <Link
          href="/room-tenants"
          className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold mb-2">
            Quản lý phòng & khách thuê
          </h2>
          <p className="text-sm text-gray-500">
            Theo dõi tình trạng phòng và khách thuê hiện tại.
          </p>
        </Link>

        <Link
          href="/tenants"
          className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold mb-2">Thông tin khách thuê</h2>
          <p className="text-sm text-gray-500">
            Quản lý hồ sơ chi tiết của từng khách thuê.
          </p>
        </Link>

        <Link
          href="/usages"
          className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold mb-2">Điện nước hàng tháng</h2>
          <p className="text-sm text-gray-500">
            Nhập và theo dõi chỉ số điện nước từng phòng.
          </p>
        </Link>

        <Link
          href="/invoices"
          className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold mb-2">Hóa đơn</h2>
          <p className="text-sm text-gray-500">
            Tạo và quản lý hóa đơn hàng tháng cho khách thuê.
          </p>
        </Link>

        <Link
          href="/settings"
          className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold mb-2">Điều chỉnh giá</h2>
          <p className="text-sm text-gray-500">
            Cài đặt giá điện, nước và chi phí dịch vụ.
          </p>
        </Link>
      </div>
    </div>
  );
}
