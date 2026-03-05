// src/app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, UserPlus, ArrowLeft, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        alert("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบเพื่อใช้งาน");
        router.push("/login");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* ภาพพื้นหลัง */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=2000')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"></div>

      {/* ปุ่มกลับ */}
      <Link href="/" className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 transition-colors z-20 bg-slate-900/50 px-4 py-2 rounded-full backdrop-blur-md border border-slate-800">
        <ArrowLeft size={18} /> กลับหน้าหลัก
      </Link>

      <div className="relative z-10 w-full max-w-md bg-slate-900/60 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] border border-slate-700/50 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-4 shadow-lg shadow-green-500/30">
            <UserPlus className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">สร้างบัญชีใหม่</h1>
          <p className="text-slate-400 mt-2 text-sm">เข้าร่วมสมรภูมิ SAMP ไปด้วยกัน</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-green-500 transition-colors">
              <User size={20} />
            </div>
            <input 
              type="text" 
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-950/50 text-white border border-slate-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all placeholder:text-slate-600"
              value={username} onChange={e => setUsername(e.target.value)} required 
              placeholder="ตั้งชื่อผู้ใช้งาน (ภาษาอังกฤษ/ตัวเลข)"
            />
          </div>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-green-500 transition-colors">
              <Lock size={20} />
            </div>
            <input 
              type="password" 
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-950/50 text-white border border-slate-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all placeholder:text-slate-600"
              value={password} onChange={e => setPassword(e.target.value)} required 
              placeholder="ตั้งรหัสผ่าน"
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-green-500 transition-colors">
              <ShieldCheck size={20} />
            </div>
            <input 
              type="password" 
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-950/50 text-white border border-slate-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all placeholder:text-slate-600"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required 
              placeholder="ยืนยันรหัสผ่านอีกครั้ง"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? "กำลังสร้างบัญชี..." : "ยืนยันการสมัครสมาชิก"}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-8">
          มีบัญชีอยู่แล้วใช่ไหม? <Link href="/login" className="text-green-400 hover:text-green-300 font-semibold transition-colors">เข้าสู่ระบบที่นี่</Link>
        </p>
      </div>
    </div>
  );
}