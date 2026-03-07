// src/app/admin/page.tsx
import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { 
  ShieldAlert, Users, CreditCard, MonitorPlay, 
  Search, Edit, RefreshCw, Trash2, ArrowUpRight 
} from "lucide-react";

// 👇 นำเข้า Component ฟอร์มประกาศที่เราเพิ่งสร้าง
import AdminAnnounceForm from "@/components/AdminAnnounceForm";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/login");

  const currentUser = await prisma.user.findUnique({
    where: { username: session.user.name as string }
  });

  if (!currentUser || currentUser.role !== "admin") {
    redirect("/profile");
  }

  const totalUsers = await prisma.user.count();
  const activeSubs = await prisma.subscription.count({
    where: { expireDate: { gt: new Date() } }
  });
  
  const topupData = await prisma.topupHistory.aggregate({
    _sum: { amount: true }
  });
  const totalIncome = topupData._sum.amount || 0;

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { subscription: { include: { package: true } } }
  });

  const recentTopups = await prisma.topupHistory.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { user: true }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-28">
      <Navbar />

      <div className="bg-red-900/20 border-b border-red-500/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-red-400">
            <ShieldAlert size={24} />
            <h1 className="text-xl font-bold tracking-widest uppercase">Admin Control Panel</h1>
          </div>
          <div className="text-slate-400 text-sm font-medium">
            ยินดีต้อนรับท่านประธาน, <span className="text-white">{currentUser.username}</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        
        {/* สถิติรวม */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-6 shadow-xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 text-blue-500 group-hover:scale-110 transition-transform"><Users size={120} /></div>
            <div className="bg-blue-500/10 text-blue-500 p-4 rounded-xl relative z-10"><Users size={32} /></div>
            <div className="relative z-10">
              <p className="text-slate-400 text-sm font-medium mb-1">ผู้เล่นทั้งหมด</p>
              <h3 className="text-3xl font-black text-white">{totalUsers} <span className="text-sm font-normal text-slate-500">คน</span></h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-6 shadow-xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 text-green-500 group-hover:scale-110 transition-transform"><CreditCard size={120} /></div>
            <div className="bg-green-500/10 text-green-500 p-4 rounded-xl relative z-10"><CreditCard size={32} /></div>
            <div className="relative z-10">
              <p className="text-slate-400 text-sm font-medium mb-1">รายได้รวมทั้งหมด</p>
              <h3 className="text-3xl font-black text-green-400">{totalIncome.toLocaleString()} <span className="text-sm font-normal text-slate-500">บาท</span></h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-6 shadow-xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 text-purple-500 group-hover:scale-110 transition-transform"><MonitorPlay size={120} /></div>
            <div className="bg-purple-500/10 text-purple-500 p-4 rounded-xl relative z-10"><MonitorPlay size={32} /></div>
            <div className="relative z-10">
              <p className="text-slate-400 text-sm font-medium mb-1">ผู้เช่าที่ใช้งานอยู่ (Active)</p>
              <h3 className="text-3xl font-black text-purple-400">{activeSubs} <span className="text-sm font-normal text-slate-500">ไอดี</span></h3>
            </div>
          </div>
        </div>

        {/* ตารางผู้เล่น และ ขวา (ประวัติเติมเงิน + ประกาศ) */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* ซ้าย: ตารางจัดการผู้เล่น */}
          <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="text-blue-500" size={24} /> ผู้เล่นล่าสุด
              </h2>
              <div className="relative hidden sm:block">
                <input type="text" placeholder="ค้นหาชื่อผู้เล่น..." className="bg-slate-950 border border-slate-700 text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:border-blue-500 outline-none" />
                <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-sm">
                    <th className="pb-3 font-medium">ชื่อผู้ใช้ (Username)</th>
                    <th className="pb-3 font-medium">เครดิต</th>
                    <th className="pb-3 font-medium">สถานะแพ็กเกจ</th>
                    <th className="pb-3 font-medium text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentUsers.map((u) => {
                    const isExpired = u.subscription ? u.subscription.expireDate < new Date() : true;
                    return (
                      <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                        <td className="py-4 font-bold text-white flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${u.role === 'admin' ? 'bg-red-500' : 'bg-slate-500'}`}></div>
                          {u.username}
                        </td>
                        <td className="py-4 text-green-400 font-bold">{u.balance} ฿</td>
                        <td className="py-4">
                          {u.subscription ? (
                            isExpired ? (
                              <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded-md text-xs border border-red-500/20">หมดอายุ</span>
                            ) : (
                              <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded-md text-xs border border-purple-500/20 flex w-fit items-center gap-1">
                                {u.subscription.package.name}
                              </span>
                            )
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="py-4">
                          <div className="flex justify-center gap-2">
                            <button title="รีเซ็ต HWID" className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg transition-colors">
                              <RefreshCw size={16} />
                            </button>
                            <button title="แก้ไขข้อมูล" className="p-2 bg-slate-800 hover:bg-yellow-600 text-slate-300 hover:text-white rounded-lg transition-colors">
                              <Edit size={16} />
                            </button>
                            <button title="ลบผู้ใช้" className="p-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <button className="w-full mt-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-bold flex items-center justify-center gap-2">
              ดูผู้เล่นทั้งหมด <ArrowUpRight size={16} />
            </button>
          </div>

          {/* ขวา: ประวัติการเติมเงิน & ฟอร์มประกาศ */}
          <div className="flex flex-col gap-8">
            
            {/* ประวัติเติมเงินล่าสุด */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex-1">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <CreditCard className="text-green-500" size={24} /> รายการโอนล่าสุด
              </h2>
              
              <div className="flex flex-col gap-4">
                {recentTopups.map((topup) => (
                  <div key={topup.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white text-sm">{topup.user.username}</div>
                      <div className="text-slate-500 text-xs mt-1 font-mono">{topup.slipRef.substring(0, 15)}...</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-green-400">+ {topup.amount} ฿</div>
                      <div className="text-slate-600 text-[10px] mt-1">
                        {new Date(topup.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                      </div>
                    </div>
                  </div>
                ))}
                {recentTopups.length === 0 && (
                  <div className="text-center py-6 text-slate-500 text-sm">ยังไม่มีรายการเติมเงิน</div>
                )}
              </div>
            </div>

            {/* 👇 ระบบส่งประกาศ (ที่ดึง Component มาใช้) 👇 */}
            <AdminAnnounceForm />

          </div>

        </div>
      </main>
    </div>
  );
}