import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-800 text-white px-6 py-3 flex items-center justify-between">
      {/* Logo / Tiêu đề */}
      <h1 className="text-lg font-bold">Quản lý trọ</h1>

      {/* Menu */}
      <ul className="flex space-x-6">
        <li>
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
        </li>
        <li>
          <Link href="/rooms" className="hover:text-gray-300">
            Quản lý Phòng
          </Link>
        </li>
        <li>
          <Link href="/tenants" className="hover:text-gray-300">
            Quản lý Người thuê
          </Link>
        </li>
        <li>
          <Link href="/room-tenants" className="hover:text-gray-300">
            Quản lý Phòng - Người thuê
          </Link>
        </li>
      </ul>
    </nav>
  );
}
