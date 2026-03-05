// src/app/launcher-config/page.tsx
"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Save, Settings, AlertCircle, Link as LinkIcon, Smartphone, Archive, CheckCircle2, Monitor } from "lucide-react";

export default function LauncherConfigPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const [config, setConfig] = useState({
    clientVersionCode: 1,
    clientSampVersionCode: 1,
    gameFilesVersionCode: 1,
    urlGameFiles: "",
    urlGameFilesUpd: "",
    urlVk: "",
    urlDiscord: "",
    urlYoutube: "",
    urlForum: "",
    urlDonate: "",
    urlClient: "",
    urlClientSampApk: "",
    serverIp: "127.0.0.1",
    serverPort: 7777
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/launcher-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      if (res.ok) setMessage({ type: "success", text: data.message });
      else setMessage({ type: "error", text: data.message });
    } catch (err) {
      setMessage({ type: "error", text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-28">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg shadow-blue-500/20">
            <Settings className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">ตั้งค่า API Launcher</h1>
            <p className="text-slate-400 mt-1">ตั้งค่าลิงก์ดาวน์โหลดและเวอร์ชันสำหรับแอปพลิเคชันมือถือของคุณ</p>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 border shadow-lg ${
            message.type === "success" ? "bg-green-500/10 border-green-500/50 text-green-400" : "bg-red-500/10 border-red-500/50 text-red-400"
          }`}>
            {message.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            <span className="font-bold">{message.text}</span>
          </div>
        )}

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-10 shadow-2xl">
          
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6 border-b border-slate-800 pb-2">
            <Smartphone className="text-blue-500" /> อัปเดตเวอร์ชันแอป
          </h3>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div>
              <label className="text-slate-400 text-sm font-medium mb-1 block">Client Version</label>
              <input type="number" name="clientVersionCode" value={config.clientVersionCode} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="text-slate-400 text-sm font-medium mb-1 block">SAMP Version</label>
              <input type="number" name="clientSampVersionCode" value={config.clientSampVersionCode} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="text-slate-400 text-sm font-medium mb-1 block">Game Files Version</label>
              <input type="number" name="gameFilesVersionCode" value={config.gameFilesVersionCode} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-blue-500 outline-none" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6 border-b border-slate-800 pb-2">
            <Archive className="text-green-500" /> ลิงก์ดาวน์โหลดไฟล์
          </h3>
          <div className="space-y-4 mb-10">
            <div>
              <label className="text-slate-400 text-sm font-medium mb-1 block">ลิงก์โหลดตัวเต็ม (URL_GAME_FILES)</label>
              <input type="text" name="urlGameFiles" value={config.urlGameFiles} onChange={handleChange} placeholder="http://.../WHOCITY.zip" className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-green-500 outline-none" />
            </div>
            <div>
              <label className="text-slate-400 text-sm font-medium mb-1 block">ลิงก์แพทช์อัปเดต (URL_GAME_FILES_UPD)</label>
              <input type="text" name="urlGameFilesUpd" value={config.urlGameFilesUpd} onChange={handleChange} placeholder="http://.../files_upd.zip" className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-green-500 outline-none" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm font-medium mb-1 block">ลิงก์แอป Launcher (URL_CLIENT)</label>
                <input type="text" name="urlClient" value={config.urlClient} onChange={handleChange} placeholder="http://.../launcher.apk" className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="text-slate-400 text-sm font-medium mb-1 block">ลิงก์ตัวเกม SAMP (URL_CLIENTSAMPAPK)</label>
                <input type="text" name="urlClientSampApk" value={config.urlClientSampApk} onChange={handleChange} placeholder="http://.../client.apk" className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-green-500 outline-none" />
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6 border-b border-slate-800 pb-2">
            <LinkIcon className="text-purple-500" /> ช่องทางการติดต่อ (Socials)
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            <div><label className="text-slate-400 text-sm font-medium mb-1 block">Discord</label><input type="text" name="urlDiscord" value={config.urlDiscord} onChange={handleChange} placeholder="https://discord.gg/..." className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-purple-500 outline-none" /></div>
            <div><label className="text-slate-400 text-sm font-medium mb-1 block">VK</label><input type="text" name="urlVk" value={config.urlVk} onChange={handleChange} placeholder="https://vk.com/..." className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-purple-500 outline-none" /></div>
            <div><label className="text-slate-400 text-sm font-medium mb-1 block">YouTube</label><input type="text" name="urlYoutube" value={config.urlYoutube} onChange={handleChange} placeholder="https://youtube.com/..." className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-purple-500 outline-none" /></div>
            <div><label className="text-slate-400 text-sm font-medium mb-1 block">Donate / Forum</label><input type="text" name="urlDonate" value={config.urlDonate} onChange={handleChange} placeholder="https://..." className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-purple-500 outline-none" /></div>
          </div>

          {/* หมวดหมู่: ตั้งค่าเซิร์ฟเวอร์ (VPS) */}
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6 border-b border-slate-800 pb-2">
            <Monitor className="text-red-500" /> ตั้งค่าการเชื่อมต่อเซิร์ฟเวอร์ (SAMP Server)
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            <div>
              <label className="text-slate-400 text-sm font-medium mb-1 block">IP เซิร์ฟเวอร์ (VPS)</label>
              <input type="text" name="serverIp" value={config.serverIp} onChange={handleChange} placeholder="เช่น 140.99.98.122" className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-red-500 outline-none font-mono" />
            </div>
            <div>
              <label className="text-slate-400 text-sm font-medium mb-1 block">Port (พอร์ต)</label>
              <input type="number" name="serverPort" value={config.serverPort} onChange={handleChange} placeholder="เช่น 7777" className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-red-500 outline-none font-mono" />
            </div>
          </div>

          <button 
            onClick={handleSave} 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center gap-2 text-lg"
          >
            {isLoading ? "กำลังบันทึก..." : <><Save size={24} /> บันทึกการตั้งค่าแอป</>}
          </button>
        </div>
      </main>
    </div>
  );
}