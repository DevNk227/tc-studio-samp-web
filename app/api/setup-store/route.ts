// src/app/api/setup-store/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // ลบข้อมูลเก่าทิ้งก่อน (ถ้ามี) เพื่อป้องกันการสร้างซ้ำ
    await prisma.package.deleteMany({});

    // เพิ่มแพ็กเกจ 3 รูปแบบ
    await prisma.package.createMany({
      data: [
        { name: "แพ็กเกจรายวัน (1 วัน)", durationDays: 1, price: 15 },
        { name: "แพ็กเกจรายสัปดาห์ (7 วัน)", durationDays: 7, price: 50 },
        { name: "แพ็กเกจรายเดือน (30 วัน)", durationDays: 30, price: 150 },
      ]
    });

    return NextResponse.json({ message: "เพิ่มสินค้าเข้าร้านค้าสำเร็จ!" });
  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}