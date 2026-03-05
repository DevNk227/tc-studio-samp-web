// src/app/dashboard/CheckoutButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutButton({ packageId, packageName }: { packageId: number, packageName: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleBuy = async () => {
    // เด้งหน้าต่างถามเพื่อความแน่ใจ
    if (!confirm(`ยืนยันการทำรายการ: ${packageName} ใช่หรือไม่?`)) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("ทำรายการสำเร็จ! วันหมดอายุถูกอัปเดตแล้ว");
        router.refresh(); // รีเฟรชหน้าเว็บเพื่อดึงข้อมูลสถานะล่าสุดมาโชว์
      } else {
        alert("เกิดข้อผิดพลาด: " + data.message);
      }
    } catch (error) {
      alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleBuy}
      disabled={isLoading}
      className="w-full bg-slate-800 hover:bg-blue-600 disabled:bg-slate-700 py-3 rounded-xl font-bold transition-all text-white"
    >
      {isLoading ? "กำลังประมวลผล..." : "เลือกแพ็กเกจนี้"}
    </button>
  );
}