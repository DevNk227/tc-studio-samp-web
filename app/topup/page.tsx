// src/app/topup/page.tsx
"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { UploadCloud, CheckCircle2, AlertCircle, Wallet, CreditCard, QrCode, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TopupPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setMessage(null);
    }
  };

  const handleTopup = async () => {
    if (!file) return setMessage({ type: "error", text: "กรุณาเลือกรูปสลิปก่อน" });
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/topup", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        setFile(null);
        setTimeout(() => { router.push("/profile"); router.refresh(); }, 2000);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "เซิร์ฟเวอร์ขัดข้อง" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-28">
      <Navbar />

      {/* Background Effect */}
      <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-green-900/20 to-transparent pointer-events-none"></div>

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 mb-6 shadow-xl shadow-green-500/20 border border-green-400/30">
            <Wallet className="text-white" size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
            เติมเครดิต <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">อัตโนมัติ 24 ชม.</span>
          </h1>
          <p className="text-slate-400 text-lg">โอนเงินด้วยแอปธนาคารใดก็ได้ แล้วอัปโหลดสลิป ระบบจะเพิ่มเครดิตให้ทันที!</p>
        </div>

        {message && (
          <div className={`max-w-3xl mx-auto p-4 rounded-2xl mb-8 flex items-center justify-center gap-3 border shadow-lg ${
            message.type === "success" ? "bg-green-500/10 border-green-500/50 text-green-400" : "bg-red-500/10 border-red-500/50 text-red-400"
          }`}>
            {message.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            <span className="font-bold text-lg">{message.text}</span>
          </div>
        )}

        {/* แบ่งหน้าจอเป็น 2 ฝั่ง (ซ้าย: ข้อมูลบัญชี / ขวา: อัปโหลดสลิป) */}
        <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          
          {/* ฝั่งซ้าย: ข้อมูลการโอน */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <CreditCard size={120} />
              </div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="bg-green-500 text-slate-900 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span> 
                ข้อมูลบัญชีรับโอน
              </h3>
              
              <div className="space-y-4 relative z-10">
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                  <p className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">ธนาคาร / พร้อมเพย์</p>
                  <p className="text-white font-bold text-lg flex items-center gap-2">
                    <QrCode className="text-blue-400" size={20} /> กสิกรไทย
                  </p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                  <p className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">เลขบัญชี</p>
                  <p className="text-green-400 font-mono font-bold text-2xl tracking-widest">140-879-8066</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                  <p className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">ชื่อบัญชี</p>
                  <p className="text-white font-bold text-lg">นาย ณัฐชกรณ์ ทองเต็ม</p>
                </div>
              </div>
            </div>
          </div>

          {/* ฝั่งขวา: อัปโหลดสลิป */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl h-full flex flex-col">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="bg-green-500 text-slate-900 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span> 
                อัปโหลดหลักฐานการโอนเงิน
              </h3>

              <div className="flex-1 flex flex-col">
                <label className={`flex-1 flex flex-col items-center justify-center w-full min-h-[250px] border-2 border-dashed rounded-2xl cursor-pointer transition-all group ${
                  previewUrl ? 'border-green-500 bg-slate-950/50' : 'border-slate-700 bg-slate-950/30 hover:border-green-500 hover:bg-slate-900'
                }`}>
                  {previewUrl ? (
                    <div className="relative w-full h-full p-2 flex items-center justify-center">
                      <img src={previewUrl} alt="Slip Preview" className="max-h-[300px] object-contain rounded-xl shadow-2xl" />
                      <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl backdrop-blur-sm">
                        <span className="text-white font-bold flex items-center gap-2 bg-slate-800 px-6 py-3 rounded-full shadow-xl">
                          <UploadCloud /> เปลี่ยนรูปใหม่
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400 group-hover:text-green-400 transition-colors">
                      <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-500/20 group-hover:scale-110 transition-all">
                        <UploadCloud size={40} className="text-slate-500 group-hover:text-green-400" />
                      </div>
                      <p className="mb-2 text-lg font-bold text-white">คลิกเพื่ออัปโหลดสลิป</p>
                      <p className="text-sm font-medium">หรือลากไฟล์รูปภาพมาวางที่นี่</p>
                      <p className="text-xs text-slate-500 mt-4">รองรับไฟล์ JPG และ PNG</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} />
                </label>

                <button 
                  onClick={handleTopup}
                  disabled={isLoading || !file}
                  className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none flex items-center justify-center gap-2 text-lg"
                >
                  {isLoading ? (
                    <span className="animate-pulse">กำลังตรวจสอบด้วย AI...</span>
                  ) : (
                    <>ยืนยันการทำรายการ <ArrowRight size={20} /></>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}