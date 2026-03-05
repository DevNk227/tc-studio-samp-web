// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Wallet, History, LayoutDashboard, User, LogOut, Menu, X, Gamepad2 } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* โลโก้เว็บ */}
          <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <Gamepad2 className="text-white" size={24} />
            </div>
            <span className="text-xl font-black text-white tracking-wider">TC STUDIO</span>
          </Link>

          {/* เมนูสำหรับหน้าจอคอมพิวเตอร์ (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {session ? (
              <>
                <Link href="/dashboard" className="text-slate-300 hover:text-white flex items-center gap-1.5 font-medium transition-colors">
                  <LayoutDashboard size={18} /> แดชบอร์ด
                </Link>
                
                {/* 👇 ปุ่มเติมเงินสีเขียวเด่นๆ 👇 */}
                <Link href="/topup" className="text-green-400 hover:text-green-300 flex items-center gap-1.5 font-bold transition-colors drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
                  <Wallet size={18} /> เติมเงิน
                </Link>
                
                {/* 👇 ปุ่มประวัติ 👇 */}
                <Link href="/history" className="text-slate-300 hover:text-white flex items-center gap-1.5 font-medium transition-colors">
                  <History size={18} /> ประวัติ
                </Link>
                
                <Link href="/profile" className="text-slate-300 hover:text-white flex items-center gap-1.5 font-medium transition-colors">
                  <User size={18} /> โปรไฟล์
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })} 
                  className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all border border-red-500/20 hover:border-red-500/50"
                >
                  <LogOut size={18} /> ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-slate-300 hover:text-white font-medium transition-colors">เข้าสู่ระบบ</Link>
                <Link href="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:scale-105">
                  สมัครสมาชิก
                </Link>
              </>
            )}
          </div>

          {/* ปุ่มเมนูสำหรับมือถือ (Hamburger Icon) */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* เมนูสำหรับมือถือ (Mobile Menu Dropdown) */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 absolute w-full shadow-2xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white font-medium flex items-center gap-3">
                  <LayoutDashboard size={20} /> แดชบอร์ด
                </Link>
                <Link href="/topup" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 font-bold flex items-center gap-3">
                  <Wallet size={20} /> เติมเงิน
                </Link>
                <Link href="/history" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white font-medium flex items-center gap-3">
                  <History size={20} /> ประวัติการทำรายการ
                </Link>
                <Link href="/profile" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white font-medium flex items-center gap-3">
                  <User size={20} /> โปรไฟล์
                </Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-slate-800 font-bold flex items-center gap-3 mt-4">
                  <LogOut size={20} /> ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 font-medium text-center">เข้าสู่ระบบ</Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="block px-4 py-3 mt-2 rounded-xl bg-blue-600 text-white font-bold text-center">สมัครสมาชิก</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}