// src/app/history/page.tsx
import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { History, ArrowDownToLine, CheckCircle2, Receipt } from "lucide-react";

export default async function HistoryPage() {
  // 1. เช็คการล็อกอิน
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  // 2. ดึงข้อมูลประวัติการเติมเงินจาก Database เรียงจากใหม่ไปเก่า
  const user = await prisma.user.findUnique({
    where: { username: session.user.name as string },
    include: { 
      topups: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) redirect("/login");

  // ฟังก์ชันแปลงรูปแบบวันที่และเวลา
  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleDateString('th-TH', { 
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-28">
      <Navbar />

      {/* Background Effect */}
      <div className="absolute top-0 w-full h-[400px] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>

      <main className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg shadow-blue-500/20">
            <History className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">ประวัติการทำรายการ</h1>
            <p className="text-slate-400 mt-1">รายการเติมเงินและเครดิตที่ได้รับทั้งหมดของคุณ</p>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-10 shadow-2xl">
          
          <div className="flex justify-between items-end mb-6 border-b border-slate-800 pb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Receipt className="text-blue-500" size={24} /> รายการเติมเงินล่าสุด
            </h3>
            <div className="text-slate-400 text-sm">
              เครดิตคงเหลือ: <span className="text-green-400 font-bold text-lg">{user.balance} ฿</span>
            </div>
          </div>

          {/* ตารางแสดงประวัติ */}
          {user.topups && user.topups.length > 0 ? (
            <div className="space-y-4">
              {user.topups.map((topup) => (
                <div key={topup.id} className="bg-slate-950/50 border border-slate-800 p-4 md:p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700 transition-colors">
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-green-500/10 text-green-400 p-3 rounded-xl">
                      <ArrowDownToLine size={24} />
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg flex items-center gap-2">
                        เติมเงินผ่านระบบอัตโนมัติ (EasySlip)
                        <span className="hidden md:inline-flex items-center gap-1 bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30">
                          <CheckCircle2 size={12} /> สำเร็จ
                        </span>
                      </div>
                      <div className="text-slate-500 text-sm mt-1">
                        รหัสอ้างอิง: <span className="font-mono">{topup.slipRef}</span>
                      </div>
                      <div className="text-slate-400 text-xs mt-1">
                        {formatDateTime(topup.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-auto text-right">
                    <div className="text-2xl font-black text-green-400">
                      + {topup.amount} ฿
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <History size={64} className="mx-auto text-slate-700 mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-slate-500">ยังไม่มีประวัติการทำรายการ</h3>
              <p className="text-slate-600 mt-2">คุณยังไม่เคยเติมเงินเข้าระบบ</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}