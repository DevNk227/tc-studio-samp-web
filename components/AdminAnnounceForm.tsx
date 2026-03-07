// src/components/AdminAnnounceForm.tsx
"use client";

import { useState } from "react";
import { Megaphone, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminAnnounceForm() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ text: string; type: "success" | "error" | null }>({ text: "", type: null });

  const handleAnnounce = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    setIsLoading(true);
    setStatus({ text: "", type: null });

    try {
      const res = await fetch("/api/admin/announce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ text: data.message || "ส่งประกาศสำเร็จ!", type: "success" });
        setTitle("");
        setMessage("");
      } else {
        setStatus({ text: data.error || "เกิดข้อผิดพลาด", type: "error" });
      }
    } catch (err) {
      setStatus({ text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-500/10 rounded-lg">
          <Megaphone className="text-yellow-500" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">ระบบส่งประกาศ</h2>
          <p className="text-slate-400 text-sm">แจ้งเตือนเข้า Discord และหน้าเว็บ</p>
        </div>
      </div>

      <form onSubmit={handleAnnounce} className="space-y-4">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="หัวข้อประกาศ..."
            className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-slate-600"
            disabled={isLoading}
          />
        </div>

        <div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="พิมพ์รายละเอียดประกาศ..."
            rows={4}
            className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-slate-600 resize-none"
            disabled={isLoading}
          />
        </div>

        {status.type === "success" && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg p-3 text-sm flex items-center gap-2">
            <CheckCircle2 size={16} /> <span>{status.text}</span>
          </div>
        )}
        {status.type === "error" && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 text-sm flex items-center gap-2">
            <AlertCircle size={16} /> <span>{status.text}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !title || !message}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-all"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <> <Send size={16} /> ยืนยันการส่งประกาศ </>}
        </button>
      </form>
    </div>
  );
}