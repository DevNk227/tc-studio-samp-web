// src/app/dashboard/page.tsx
import Navbar from '@/components/Navbar'
import { Calendar, Monitor, CheckCircle, AlertCircle, ShoppingBag } from 'lucide-react'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import CheckoutButton from "./CheckoutButton"; // สร้างไฟล์แยกสำหรับปุ่ม

export default async function DashboardPage() {
  // 1. เช็คว่ามีคนล็อกอินอยู่ไหม ถ้าไม่มีให้เด้งไปหน้า Login
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/login');
  }

  // 2. ดึงข้อมูลผู้เล่น และข้อมูลแพ็กเกจที่เช่าอยู่จากฐานข้อมูล Neon
  const userData = await prisma.user.findUnique({
    where: { username: session.user.name as string },
    include: { 
      subscription: {
        include: { package: true } // ดึงชื่อของแพ็กเกจมาด้วย
      } 
    }
  });

  const sub = userData?.subscription;
  
  // 3. เช็คสถานะวันหมดอายุ
  const now = new Date();
  const isExpired = sub ? sub.expireDate < now : true;
  const isStatusActive = sub && !isExpired;
  
  let statusText = "ยังไม่มีแพ็กเกจ";
  if (sub) {
    statusText = isExpired ? "หมดอายุ" : "กำลังใช้งาน";
  }

  // ฟังก์ชันแปลงวันที่เป็นภาษาไทยให้ดูสวยงาม
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('th-TH', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      
      <main className="max-w-6xl mx-auto p-6 mt-8">
        <h1 className="text-3xl font-bold mb-8">ยินดีต้อนรับ, {session.user.name}!</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* การ์ดสถานะหลัก */}
          <div className="md:col-span-2 bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <CheckCircle size={150} />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-slate-400 text-lg mb-2">สถานะการเช่าปัจจุบัน</h2>
              <div className="flex items-center gap-3 mb-6">
                <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                  isStatusActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {statusText}
                </span>
                <h3 className="text-2xl font-bold">
                  {sub ? sub.package.name : "กรุณาเลือกซื้อแพ็กเกจด้านล่าง"}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-8">
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
                    <p className="font-mono text-slate-300">
                      {sub?.hwid ? sub.hwid : (sub ? "รอเข้าเกมเพื่อผูกอุปกรณ์" : "-")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* การ์ดแจ้งเตือน */}
          <div className="bg-blue-600 rounded-3xl p-8 flex flex-col justify-between text-white relative overflow-hidden group">
            <div className="relative z-10">
                <AlertCircle size={32} className="mb-4" />
                <h3 className="text-xl font-bold mb-2">ต้องการย้ายอุปกรณ์?</h3>
                <p className="text-blue-100 text-sm">หากต้องการเปลี่ยนมือถือเครื่องใหม่ สามารถติดต่อแอดมินเพื่อรีเซ็ต HWID ได้ฟรี!</p>
            </div>
            <button className="mt-6 bg-white text-blue-600 py-2 rounded-xl font-bold hover:bg-blue-50 transition-all z-10">
              ติดต่อแอดมิน
            </button>
          </div>
        </div>

        {/* หน้าร้านค้า */}
        <div className="mt-12 mb-20">
           <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
             <ShoppingBag className="text-blue-500" /> แพ็กเกจที่พร้อมใช้งาน
           </h2>
           
           <div className="grid md:grid-cols-3 gap-6">
              {/* ดึงแพ็กเกจทั้งหมดจากฐานข้อมูลมาโชว์ */}
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
                    {/* ปุ่มกดซื้อที่เราจะสร้างเป็น Client Component */}
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