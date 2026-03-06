// src/app/redeem/page.tsx
"use client";

import { useState } from "react";
import { Gift, Sparkles, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function RedeemPage() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | null }>({ text: "", type: null });

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setIsLoading(true);
    setMessage({ text: "", type: null });

    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: data.message, type: "success" });
        setCode(""); // เคลียร์ช่องกรอกเมื่อสำเร็จ
      } else {
        setMessage({ text: data.error, type: "error" });
      }
    } catch (err) {
      setMessage({ text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#050814] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)] text-center">
          
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl mb-6">
            <Gift className="text-blue-400 w-10 h-10" />
          </div>
          
          <h1 className="text-3xl font-black text-white mb-2 tracking-wide">กรอกโค้ดรับรางวัล</h1>
          <p className="text-slate-400 mb-8">ใส่โค้ดกิจกรรมหรือโปรโมชั่นเพื่อรับพอยท์เข้าสู่บัญชีของคุณทันที</p>

          <form onSubmit={handleRedeem} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="พิมพ์โค้ดของคุณที่นี่..."
                className="w-full bg-slate-950/50 border border-slate-700 text-white text-center text-xl font-bold rounded-2xl p-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all uppercase placeholder:text-slate-600 placeholder:font-normal placeholder:text-base"
                disabled={isLoading}
              />
            </div>

            {/* ส่วนแสดงข้อความแจ้งเตือน (Success / Error) */}
            {message.type === "success" && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl p-4 flex items-center justify-center gap-2 animate-fade-in">
                <CheckCircle2 size={20} />
                <span className="font-bold">{message.text}</span>
              </div>
            )}

            {message.type === "error" && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 flex items-center justify-center gap-2 animate-fade-in">
                <XCircle size={20} />
                <span className="font-medium">{message.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !code}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <Sparkles size={20} /> ยืนยันรับรางวัล
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}