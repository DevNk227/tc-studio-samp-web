// src/components/Navbar.tsx
import Link from 'next/link'
import { LayoutDashboard, ShoppingBag, User, LogIn, Home } from 'lucide-react'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import LogoutButton from './LogoutButton'

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <>
      {/* แถบเมนูด้านบน (สำหรับทุกขนาดจอ) */}
      <nav className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <Link href="/" className="text-xl font-black text-white flex items-center gap-2 transition-transform hover:scale-105">
            <span className="bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/30">TC</span>
            <span className="hidden sm:block">STUDIO</span> {/* ซ่อนคำว่า STUDIO ในมือถือจอเล็กมาก */}
          </Link>
          
          {/* เมนูกลาง (โชว์เฉพาะจอคอม md ขึ้นไป) */}
          <div className="hidden md:flex gap-8 text-slate-400 font-medium">
            <Link href="/" className="hover:text-white flex items-center gap-2 transition-colors">
              <Home size={18} /> หน้าหลัก
            </Link>
            <Link href="/dashboard" className="hover:text-blue-400 flex items-center gap-2 transition-colors">
              <LayoutDashboard size={18} /> แดชบอร์ด
            </Link>
            <Link href="/store" className="hover:text-purple-400 flex items-center gap-2 transition-colors">
              <ShoppingBag size={18} /> ร้านค้า
            </Link>
          </div>

          {/* เมนูขวา */}
          <div className="flex items-center gap-2 sm:gap-3">
            {session ? (
              <>
                <Link href="/profile" className="hidden sm:flex items-center gap-2 text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 transition-all shadow-lg group">
                  <User size={18} className="text-blue-400 group-hover:text-blue-300" />
                  <span className="text-sm font-bold truncate max-w-[100px]">{session.user?.name}</span>
                </Link>
                <LogoutButton />
              </>
            ) : (
              <Link href="/login" className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-bold text-sm sm:text-base">
                <LogIn size={18} /> เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* แถบเมนูด้านล่าง (Bottom Navigation) - โชว์เฉพาะมือถือ (md:hidden) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 flex justify-around items-center p-3 z-50 pb-safe">
        <Link href="/" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors">
          <Home size={20} />
          <span className="text-[10px] font-medium">หน้าหลัก</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors">
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-medium">แดชบอร์ด</span>
        </Link>
        <Link href="/store" className="flex flex-col items-center gap-1 text-slate-400 hover:text-purple-400 transition-colors">
          <ShoppingBag size={20} />
          <span className="text-[10px] font-medium">ร้านค้า</span>
        </Link>
        {session ? (
          <Link href="/profile" className="flex flex-col items-center gap-1 text-slate-400 hover:text-green-400 transition-colors">
            <User size={20} />
            <span className="text-[10px] font-medium">โปรไฟล์</span>
          </Link>
        ) : (
          <Link href="/login" className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-500 transition-colors">
            <LogIn size={20} />
            <span className="text-[10px] font-medium">ล็อกอิน</span>
          </Link>
        )}
      </div>
    </>
  )
}