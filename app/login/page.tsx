// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, LogIn, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("ไอดีหรือรหัสผ่านไม่ถูกต้อง");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* ภาพพื้นหลังและเลเยอร์ความมืด */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=2000')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]"></div>

      {/* ปุ่มกลับหน้าหลัก */}
      <Link href="/" className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 transition-colors z-20 bg-slate-900/50 px-4 py-2 rounded-full backdrop-blur-md border border-slate-800">
        <ArrowLeft size={18} /> กลับหน้าหลัก
      </Link>

      {/* กล่อง Login แบบ Glassmorphism */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/60 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] border border-slate-700/50 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg shadow-blue-500/30">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">เข้าสู่ระบบ</h1>
          <p className="text-slate-400 mt-2 text-sm">ยินดีต้อนรับกลับสู่ TC STUDIO</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm text-center flex items-center justify-center gap-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
              <User size={20} />
            </div>
            <input 
              type="text" 
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-950/50 text-white border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
              value={username} onChange={e => setUsername(e.target.value)} required 
              placeholder="ชื่อผู้ใช้งาน"
            />
          </div>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-500 transition-colors">
              <Lock size={20} />
            </div>
            <input 
              type="password" 
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-950/50 text-white border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-600"
              value={password} onChange={e => setPassword(e.target.value)} required 
              placeholder="รหัสผ่าน"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? "กำลังตรวจสอบ..." : <><LogIn size={20} /> เข้าสู่ระบบ</>}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-8">
          ยังไม่มีบัญชีผู้ใช้? <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">สมัครสมาชิกที่นี่</Link>
        </p>
      </div>
    </div>
  );
}