// src/app/download/page.tsx
"use client";

import Link from "next/link";
import { Monitor, Smartphone, Download, Zap, Shield, Cpu, HardDrive, Gamepad2, ArrowDownCircle } from "lucide-react";

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[#050814] relative overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* เอฟเฟกต์แสงพื้นหลัง (Background Glow) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl mb-6 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
            <Gamepad2 className="text-blue-400 w-12 h-12" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            เข้าสู่จักรวาล <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 drop-shadow-lg">
              TC STUDIO
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            ดาวน์โหลด Launcher เพื่อเชื่อมต่อเข้าสู่เซิร์ฟเวอร์โดยตรง ระบบอัปเดตอัตโนมัติ 
            ป้องกันโปรแกรมโกง 100% และรีดประสิทธิภาพภาพให้ลื่นไหลที่สุด
          </p>
        </div>

        {/* Download Cards Section */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          
          {/* 💻 การ์ดดาวน์โหลด PC */}
          <div className="group relative bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 hover:border-blue-500/50 rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(59,130,246,0.1)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform duration-500">
                  <Monitor size={40} />
                </div>
                <span className="px-4 py-1.5 bg-blue-500/20 text-blue-300 text-sm font-bold rounded-full border border-blue-500/20">v2.1.0 Stable</span>
              </div>
              
              <h2 className="text-3xl font-black text-white mb-2">Windows PC</h2>
              <p className="text-slate-400 mb-8 h-12">สัมผัสประสบการณ์กราฟิกจัดเต็ม เฟรมเรตไร้ขีดจำกัด รองรับ Windows 10/11</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-300 gap-3 font-medium"><Zap size={18} className="text-yellow-400" /> โหลดไฟล์เกมล่วงหน้าอัตโนมัติ</li>
                <li className="flex items-center text-slate-300 gap-3 font-medium"><Shield size={18} className="text-green-400" /> ระบบ Anti-Cheat รุ่นใหม่ล่าสุด</li>
              </ul>

              <Link href="#" className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] group-hover:scale-[1.02]">
                <Download className="group-hover:animate-bounce" /> ดาวน์โหลด .EXE (45MB)
              </Link>
            </div>
          </div>

          {/* 📱 การ์ดดาวน์โหลด Mobile */}
          <div className="group relative bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 hover:border-green-500/50 rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(34,197,94,0.1)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-green-500/10 rounded-2xl text-green-400 group-hover:scale-110 transition-transform duration-500">
                  <Smartphone size={40} />
                </div>
                <span className="px-4 py-1.5 bg-green-500/20 text-green-300 text-sm font-bold rounded-full border border-green-500/20">v1.0.5 APK</span>
              </div>
              
              <h2 className="text-3xl font-black text-white mb-2">Android Mobile</h2>
              <p className="text-slate-400 mb-8 h-12">พกพาความมันส์ไปได้ทุกที่ คอนโทรลปรับแต่งได้ รองรับมือถือทุกสเปค</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-300 gap-3 font-medium"><Zap size={18} className="text-yellow-400" /> ปรับ UI ให้เข้ากับหน้าจอมือถือ</li>
                <li className="flex items-center text-slate-300 gap-3 font-medium"><Shield size={18} className="text-green-400" /> กินแบตเตอรี่น้อย เครื่องไม่ร้อน</li>
              </ul>

              <Link href="#" className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(22,163,74,0.4)] hover:shadow-[0_0_30px_rgba(22,163,74,0.6)] group-hover:scale-[1.02]">
                <Download className="group-hover:animate-bounce" /> ดาวน์โหลด .APK (28MB)
              </Link>
            </div>
          </div>

        </div>

        {/* System Requirements Section */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-8 text-slate-400">
            <ArrowDownCircle size={20} />
            <h3 className="text-xl font-bold text-white tracking-wide">สเปคขั้นต่ำที่แนะนำ (PC)</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center text-center">
              <Cpu className="text-slate-400 mb-3" size={32} />
              <span className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Processor</span>
              <span className="text-white font-medium">Intel Core i3 / AMD Ryzen 3 ขึ้นไป</span>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center text-center">
              <Gamepad2 className="text-slate-400 mb-3" size={32} />
              <span className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Memory (RAM)</span>
              <span className="text-white font-medium">4 GB RAM (แนะนำ 8 GB)</span>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center text-center">
              <HardDrive className="text-slate-400 mb-3" size={32} />
              <span className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Storage</span>
              <span className="text-white font-medium">พื้นที่ว่างอย่างน้อย 5 GB</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}