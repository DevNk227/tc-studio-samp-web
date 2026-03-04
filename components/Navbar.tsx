// src/components/Navbar.tsx
import Link from 'next/link'
import { LayoutDashboard, ShoppingBag, LogOut, User } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
          <span className="bg-blue-600 p-1.5 rounded-lg">TC</span>
          STUDIO <span className="text-blue-500">SAMP</span>
        </Link>
        
        <div className="hidden md:flex gap-6 text-slate-300">
          <Link href="/dashboard" className="hover:text-white flex items-center gap-1 transition-colors">
            <LayoutDashboard size={18} /> แดชบอร์ด
          </Link>
          <Link href="/store" className="hover:text-white flex items-center gap-1 transition-colors">
            <ShoppingBag size={18} /> ร้านค้า
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
            <User size={16} />
            <span className="text-sm">Teccom_Studio</span>
          </div>
          <button className="text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  )
}