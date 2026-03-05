// src/app/dashboard/page.tsx
import Navbar from '@/components/Navbar'
import { Calendar, Monitor, CheckCircle, ShoppingBag, Settings } from 'lucide-react'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import CheckoutButton from "./CheckoutButton"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/login');
  }

  const userData = await prisma.user.findUnique({
    where: { username: session.user.name as string },
    include: { subscription: { include: { package: true } } }
  });

  const sub = userData?.subscription;
  const now = new Date();
  const isExpired = sub ? sub.expireDate < now : true;
  const isStatusActive = sub && !isExpired;
  
  let statusText = "ยังไม่มีแพ็กเกจ";
  if (sub) {
    statusText = isExpired ? "หมดอายุ" : "กำลังใช้งาน";
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('th-TH', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-28">
      <Navbar />
      
      <main className="max-w-6xl mx-auto p-6 mt-8 relative z-10">
        <h1 className="text-3xl font-bold mb-8">ยินดีต้อนรับ, {session.user.name}!</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* การ์ดสถานะหลัก */}
          <div className="md:col-span-2 bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <CheckCircle size={150} />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-slate-400 text-lg mb-2">สถานะการเช่าปัจจุบัน</h2>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                  isStatusActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {statusText}
                </span>
                <h3 className="text-2xl font-bold">
                  {sub ? sub.package.name : "กรุณาเลือกซื้อแพ็กเกจด้านล่าง"}
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600/20 p-2 rounded-lg text-blue-500"><Calendar /></div>
                  <div>
                    <p className="text-slate-500 text-sm">วันหมดอายุ</p>
                    <p className="font-semibold text-lg">
                      {sub ? formatDate(sub.expireDate) : "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-purple-600/20 p-2 rounded-lg text-purple-500"><Monitor /></div>
                  <div>
                    <p className="text-slate-500 text-sm">อุปกรณ์ที่ผูกไว้ (HWID)</p>
                    <p className="font-mono text-slate-300 break-all text-sm sm:text-base">
                      {sub?.hwid ? sub.hwid : (sub ? "รอเข้าเกมเพื่อผูกอุปกรณ์" : "-")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* การ์ดจัดการ Launcher */}
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-8 flex flex-col justify-between text-white relative overflow-hidden group shadow-2xl border border-purple-500/30">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
              <Monitor size={100} />
            </div>
            <div className="relative z-10">
                <div className="bg-purple-500/20 w-fit p-3 rounded-xl mb-4 text-purple-300">
                  <Settings size={28} />
                </div>
                <h3 className="text-2xl font-black mb-2 tracking-tight">ตั้งค่าแอป Launcher</h3>
                <p className="text-indigo-200 text-sm leading-relaxed mb-6">
                  จัดการลิงก์ดาวน์โหลดไฟล์เกม, เวอร์ชันแอป, และช่องทางการติดต่อสำหรับผู้เล่น
                </p>
            </div>
            <a href="/launcher-config" className="relative z-10 block text-center bg-white text-indigo-900 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02]">
              จัดการตั้งค่า API
            </a>
          </div>
        </div>

        {/* หน้าร้านค้า */}
        <div className="mt-12 mb-20">
           <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
             <ShoppingBag className="text-blue-500" /> แพ็กเกจที่พร้อมใช้งาน
           </h2>
           
           <div className="grid md:grid-cols-3 gap-6">
              {await prisma.package.findMany({ orderBy: { durationDays: 'asc' } }).then(packages => 
                packages.map((pkg) => (
                  <div key={pkg.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/50 transition-all flex flex-col justify-between">
                    <div>
                      <h4 className="text-xl font-bold mb-2">{pkg.name}</h4>
                      <p className="text-slate-400 mb-6 font-semibold">{pkg.durationDays} วัน</p>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-bold text-blue-500">฿{pkg.price}</span>
                      </div>
                    </div>
                    <CheckoutButton packageId={pkg.id} packageName={pkg.name} />
                  </div>
                ))
              )}
           </div>
        </div>
      </main>
    </div>
  )
}