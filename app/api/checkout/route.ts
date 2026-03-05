// src/app/api/checkout/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "กรุณาล็อกอินก่อนทำรายการ" }, { status: 401 });
    }

    const { packageId } = await request.json();

    const selectedPackage = await prisma.package.findUnique({ where: { id: packageId } });
    if (!selectedPackage) return NextResponse.json({ message: "ไม่พบแพ็กเกจนี้" }, { status: 404 });

    const user = await prisma.user.findUnique({
      where: { username: session.user.name as string },
      include: { subscription: true }
    });

    if (!user) return NextResponse.json({ message: "ไม่พบข้อมูลผู้ใช้" }, { status: 404 });

    // 🛑 ตรวจสอบยอดเงิน (เพิ่มส่วนนี้เข้ามาใหม่)
    if (user.balance < selectedPackage.price) {
      return NextResponse.json({ 
        message: `ยอดเงินไม่เพียงพอ (ขาดอีก ${selectedPackage.price - user.balance} บาท)` 
      }, { status: 400 });
    }

    const now = new Date();
    let newExpireDate = new Date();

    if (user.subscription && user.subscription.expireDate > now) {
      newExpireDate = new Date(user.subscription.expireDate);
      newExpireDate.setDate(newExpireDate.getDate() + selectedPackage.durationDays);
    } else {
      newExpireDate.setDate(now.getDate() + selectedPackage.durationDays);
    }

    // 💰 ทำงานแบบ Transaction (หักเงิน และ อัปเดตแพ็กเกจ พร้อมกัน)
    await prisma.$transaction(async (tx) => {
      // 1. หักเงินผู้เล่น
      await tx.user.update({
        where: { id: user.id },
        data: { balance: user.balance - selectedPackage.price }
      });

      // 2. อัปเดตแพ็กเกจ
      if (user.subscription) {
        await tx.subscription.update({
          where: { id: user.subscription.id },
          data: { packageId: selectedPackage.id, expireDate: newExpireDate }
        });
      } else {
        await tx.subscription.create({
          data: {
            userId: user.id,
            packageId: selectedPackage.id,
            expireDate: newExpireDate,
          }
        });
      }
    });

    return NextResponse.json({ message: "สั่งซื้อแพ็กเกจสำเร็จ!" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดของเซิร์ฟเวอร์" }, { status: 500 });
  }
}