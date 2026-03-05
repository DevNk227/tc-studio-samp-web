// src/app/page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { 
  ShieldCheck, Zap, Smartphone, Globe, 
  ChevronRight, Users, Server, Trophy, 
  Gamepad2, Download, ArrowRight, Lock
} from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30 font-sans overflow-x-hidden">
      <Navbar />

      {/* 1. HERO SECTION - ปรับเป็นรูปภาพเต็มจอ & ข้อความชิดซ้ายขยับได้ */}
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-20 overflow-hidden">
        {/* ใส่สไตล์แอนิเมชันขยับขึ้นลงตรงนี้ */}
        <style>{`
          @keyframes float-soft {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          .animate-float-soft {
            animation: float-soft 5s ease-in-out infinite;
          }
        `}</style>

        {/* รูปภาพพื้นหลัง (เปลี่ยนลิงก์รูปตรง URL ได้เลย) */}
        <div className="absolute inset-0 bg-[url('https://img2.pic.in.th/logof05a6fe808d60bf2.png')] bg-cover bg-center bg-no-repeat"></div>
        
        {/* เลเยอร์ไล่สีดำ (มืดฝั่งซ้าย สว่างฝั่งขวา) เพื่อให้ตัวหนังสือเด่น */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay"></div>

        {/* กล่องข้อความฝั่งซ้าย */}
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          {/* ใส่คลาส animate-float-soft เพื่อให้กล่องนี้ขยับขึ้นลง */}
          <div className="max-w-2xl animate-float-soft">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-700 text-sm font-medium text-blue-400 mb-6 shadow-xl backdrop-blur-md">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              TC Studio Launcher 2.0
            </div>

            {/* ลดขนาดลงจาก text-7xl เป็น text-5xl md:text-6xl */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg">
              ยกระดับการเล่น SAMP <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-none">
                บนมือถือที่ดีที่สุด
              </span>
            </h1>
            
            <p className="text-lg text-slate-300 mb-10 leading-relaxed drop-shadow-md">
              ระบบ Launcher ที่เสถียรที่สุด ป้องกันโปรแกรมช่วยเล่น 100% ด้วยระบบล็อค HWID 
              พร้อมเชื่อมต่อระบบเช่าแพ็กเกจอัตโนมัติ โหลดปุ๊บ เล่นได้ปั๊บ ไม่มีสะดุด!
            </p>

            {/* ปุ่มกดจัดชิดซ้าย */}
            <div className="flex flex-wrap items-center gap-4">
              {isLoggedIn ? (
                <Link href="/dashboard" className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 backdrop-blur-sm">
                  ไปที่แดชบอร์ดของคุณ <ArrowRight size={20} />
                </Link>
              ) : (
                <>
                  <Link href="/register" className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2">
                    สมัครสมาชิกฟรี <ChevronRight size={20} />
                  </Link>
                  <Link href="/login" className="px-8 py-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-white font-bold text-lg border border-slate-600 transition-all flex items-center justify-center gap-2 backdrop-blur-md">
                    เข้าสู่ระบบ
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="border-y border-slate-800/50 bg-slate-900 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800/80">
            <div>
              <div className="text-3xl font-black text-white mb-1 flex items-center justify-center gap-2">
                <Users size={28} className="text-blue-500" /> 5k+
              </div>
              <div className="text-slate-500 text-sm font-medium">ผู้เล่นที่ไว้วางใจ</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white mb-1 flex items-center justify-center gap-2">
                <Server size={28} className="text-purple-500" /> 99.9%
              </div>
              <div className="text-slate-500 text-sm font-medium">เซิร์ฟเวอร์อัปไทม์</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white mb-1 flex items-center justify-center gap-2">
                <ShieldCheck size={28} className="text-green-500" /> 0
              </div>
              <div className="text-slate-500 text-sm font-medium">โดนแบนมั่ว</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white mb-1 flex items-center justify-center gap-2">
                <Trophy size={28} className="text-yellow-500" /> #1
              </div>
              <div className="text-slate-500 text-sm font-medium">ระบบ Launcher</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">ทำไมต้องเลือก Launcher ของเรา?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">ฟังก์ชันจัดเต็ม ออกแบบมาเพื่อเซิร์ฟเวอร์แนว Roleplay โดยเฉพาะ</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <Lock className="text-blue-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">ระบบล็อค HWID ขั้นสูง</h3>
              <p className="text-slate-400 leading-relaxed">ป้องกันการนำไอดีแพ็กเกจไปหารกันเล่น ผูกติดกับอุปกรณ์ของมือถือเครื่องนั้นๆ มั่นใจได้ว่าไม่มีการโกง</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                <Zap className="text-purple-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">เชื่อมต่อ API ทันที</h3>
              <p className="text-slate-400 leading-relaxed">เมื่อเช่าแพ็กเกจบนเว็บ ระบบจะปลดล็อคใน Launcher มือถือให้เข้าเล่นได้ทันทีแบบ Real-time</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                <ShieldCheck className="text-green-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Anti-Cheat ฉบับมือถือ</h3>
              <p className="text-slate-400 leading-relaxed">ดักจับการดัดแปลงไฟล์เกมและแอปพลิเคชันเถื่อน สร้างสังคมเซิร์ฟเวอร์ที่ใสสะอาดและยุติธรรม</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA SECTION */}
      <section className="py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-900 to-slate-900 border border-blue-500/30 rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">พร้อมที่จะลุยหรือยัง?</h2>
              <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
                เข้าร่วมคอมมูนิตี้ของเรา สมัครไอดีวันนี้เพื่อรับประสบการณ์การเล่น SAMP ที่เหนือกว่าใคร
              </p>
              <Link href="/register" className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-blue-900 font-black text-xl hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all">
                เริ่มต้นใช้งานทันที <Zap size={24} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-xl font-black text-white">
            <span className="bg-blue-600 p-1.5 rounded-lg text-white">TC</span> STUDIO
          </div>
          <div className="text-slate-600 text-sm">
            © {new Date().getFullYear()} TC STUDIO SAMP. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}