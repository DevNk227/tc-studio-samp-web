// src/app/profile/page.tsx
import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Shield, Clock, Monitor, KeyRound, Star, UserCircle } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { username: session.user.name as string },
    include: { subscription: { include: { package: true } } }
  });

  if (!user) redirect("/login");

  const joinDate = new Date(user.createdAt).toLocaleDateString('th-TH', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  const avatarUrl = `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${user.username}&backgroundColor=1e293b`;

  return (
    // เพิ่ม pb-28 เพื่อเว้นที่ให้เมนูมือถือด้านล่าง
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-28">
      <Navbar />

      <div className="w-full h-48 sm:h-64 md:h-80 relative bg-slate-900 border-b border-slate-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=2000')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 -mt-16 sm:-mt-24">
        
        {/* กล่องโปรไฟล์หลัก */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 text-center md:text-left">
          
          {/* อวตาร */}
          <div className="relative -mt-20 md:-mt-24 shrink-0 mx-auto md:mx-0">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-slate-900 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden bg-slate-800">
              <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-full border-4 border-slate-900 shadow-lg">
              <Star className="text-slate-900" size={14} fill="currentColor" />
            </div>
          </div>

          <div className="flex-1 w-full">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3 break-all">{user.username}</h1>
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4 text-slate-400 text-xs sm:text-sm font-medium">
              <span className="flex items-center justify-center gap-1 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 w-full sm:w-auto">
                <Shield size={14} className={user.role === 'admin' ? "text-red-400" : "text-blue-400"} /> 
                {user.role === 'admin' ? "ผู้ดูแลระบบ" : "ผู้เล่นทั่วไป"}
              </span>
              <span className="flex items-center justify-center gap-1 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 w-full sm:w-auto">
                <Clock size={14} className="text-slate-400" /> เข้าเมื่อ: {joinDate}
              </span>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0">
            <button className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl transition-all border border-slate-700 font-bold shadow-lg text-sm sm:text-base">
              <KeyRound size={18} /> เปลี่ยนรหัสผ่าน
            </button>
          </div>
        </div>

        {/* ข้อมูลแพ็กเกจและ HWID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
          
          {/* กล่องแพ็กเกจ */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 hover:border-blue-500/30 transition-colors">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
              <Star className="text-blue-500" /> แพ็กเกจที่ใช้งาน
            </h3>
            {user.subscription ? (
              <div className="bg-gradient-to-br from-blue-900/40 to-slate-800/40 border border-blue-500/20 p-5 sm:p-6 rounded-2xl">
                <div className="text-blue-400 text-xs sm:text-sm font-bold mb-1">สถานะ: กำลังใช้งาน</div>
                <div className="text-xl sm:text-2xl font-black text-white mb-4">{user.subscription.package.name}</div>
                <div className="text-slate-400 text-xs sm:text-sm flex justify-between items-center border-t border-slate-700/50 pt-4">
                  <span>หมดอายุ:</span>
                  <span className="text-white font-semibold">
                    {new Date(user.subscription.expireDate).toLocaleDateString('th-TH')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/30 border border-slate-700 border-dashed p-6 sm:p-8 rounded-2xl text-center text-slate-500 text-sm">
                คุณยังไม่มีแพ็กเกจการเช่าใดๆ
                <a href="/store" className="block mt-3 text-blue-400 hover:text-blue-300 font-bold">ไปที่ร้านค้าเลย!</a>
              </div>
            )}
          </div>

          {/* กล่อง HWID */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 hover:border-purple-500/30 transition-colors">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
              <Monitor className="text-purple-500" /> อุปกรณ์ (HWID)
            </h3>
            <div className="bg-slate-950 p-5 sm:p-6 rounded-2xl border border-slate-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-purple-500 group-hover:opacity-10 transition-opacity">
                <Monitor className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px]" />
              </div>
              <div className="relative z-10">
                <p className="text-slate-400 text-xs sm:text-sm mb-2">รหัสอุปกรณ์ของคุณ:</p>
                <div className="font-mono text-sm sm:text-lg text-white font-bold tracking-wider break-all">
                  {user.subscription?.hwid || "รอเข้าเกมครั้งแรก"}
                </div>
                <button className="mt-4 sm:mt-6 w-full text-xs sm:text-sm bg-purple-600/20 text-purple-400 hover:bg-purple-600/40 px-4 py-3 sm:py-2 rounded-lg font-bold transition-colors border border-purple-500/30">
                  ร้องขอรีเซ็ตอุปกรณ์
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}