// src/app/dashboard/page.tsx
import Navbar from '@/components/Navbar'
import { Calendar, Monitor, CheckCircle, AlertCircle, ShoppingBag } from 'lucide-react'

export default function DashboardPage() {
  // สมมติข้อมูล (ในขั้นถัดไปเราจะดึงจาก Database จริง)
  const subscription = {
    status: 'Active', // หรือ 'Expired', 'None'
    packageName: 'VIP Extreme 30 Days',
    expireDate: '25 เมษายน 2567',
    hwid: '3f8e-2a1c-9b0d-4455'
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      
      <main className="max-w-6xl mx-auto p-6 mt-8">
        <h1 className="text-3xl font-bold mb-8">ยินดีต้อนรับกลับมา!</h1>

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
                  subscription.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {subscription.status === 'Active' ? 'กำลังใช้งาน' : 'หมดอายุ'}
                </span>
                <h3 className="text-2xl font-bold">{subscription.packageName}</h3>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600/20 p-2 rounded-lg text-blue-500"><Calendar /></div>
                  <div>
                    <p className="text-slate-500 text-sm">วันหมดอายุ</p>
                    <p className="font-semibold text-lg">{subscription.expireDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-purple-600/20 p-2 rounded-lg text-purple-500"><Monitor /></div>
                  <div>
                    <p className="text-slate-500 text-sm">อุปกรณ์ที่ผูกไว้ (HWID)</p>
                    <p className="font-mono text-slate-300">{subscription.hwid || 'ยังไม่ระบุ'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* การ์ดแจ้งเตือน/โปรโมชั่น */}
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

        {/* ส่วนหน้าร้านค้าเบื้องต้น */}
        <div className="mt-12">
           <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
             <ShoppingBag className="text-blue-500" /> แพ็กเกจที่พร้อมใช้งาน
           </h2>
           <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'VIP Basic', days: 7, price: 50 },
                { name: 'VIP Pro', days: 15, price: 90 },
                { name: 'VIP Extreme', days: 30, price: 150 },
              ].map((pkg, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/50 transition-all">
                  <h4 className="text-xl font-bold mb-2">{pkg.name}</h4>
                  <p className="text-slate-400 mb-6 font-semibold">{pkg.days} วัน</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-bold text-blue-500">฿{pkg.price}</span>
                    <span className="text-slate-500 text-sm">/ครั้ง</span>
                  </div>
                  <button className="w-full bg-slate-800 hover:bg-blue-600 py-3 rounded-xl font-bold transition-all">
                    เลือกแพ็กเกจนี้
                  </button>
                </div>
              ))}
           </div>
        </div>
      </main>
    </div>
  )
}