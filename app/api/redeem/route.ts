// src/app/api/redeem/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    // 1. เช็คว่าล็อกอินหรือยัง
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนกรอกโค้ด" }, { status: 401 });
    }

    const { code } = await req.json();
    if (!code) return NextResponse.json({ error: "กรุณากรอกโค้ดไอเทม" }, { status: 400 });

    const userEmail = session.user.email;

    // 2. ดึงข้อมูล User (เพื่อให้ได้ id มาใช้งาน)
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) return NextResponse.json({ error: "ไม่พบข้อมูลผู้ใช้งาน" }, { status: 404 });

    // 3. ค้นหาโค้ดในระบบ
    const redeemCode = await prisma.redeemCode.findUnique({ where: { code: code.toUpperCase() } });
    
    if (!redeemCode) return NextResponse.json({ error: "ไม่พบโค้ดนี้ในระบบ" }, { status: 404 });
    if (!redeemCode.isActive) return NextResponse.json({ error: "โค้ดนี้หมดอายุ หรือถูกปิดการใช้งานแล้ว" }, { status: 400 });
    if (redeemCode.usedCount >= redeemCode.maxUses) return NextResponse.json({ error: "โค้ดนี้ถูกใช้งานครบจำนวนแล้ว" }, { status: 400 });

    // 4. เช็คว่า User คนนี้เคยใช้โค้ดนี้ไปหรือยัง
    const alreadyUsed = await prisma.redemption.findUnique({
      where: { userId_codeId: { userId: user.id, codeId: redeemCode.id } }
    });
    if (alreadyUsed) return NextResponse.json({ error: "คุณเคยรับรางวัลจากโค้ดนี้ไปแล้ว!" }, { status: 400 });

    // 5. แจกพอยท์ + บันทึกประวัติ (ทำพร้อมกันเพื่อความปลอดภัย)
    await prisma.$transaction([
      // อัปเดตพอยท์ให้ลูกค้า (ถ้าฟิลด์เงินในตาราง User ของคุณชื่ออื่น เช่น balance ให้เปลี่ยนคำว่า points เป็นคำนั้นครับ)
      prisma.user.update({
        where: { id: user.id },
        data: { points: { increment: redeemCode.points } } 
      }),
      // เพิ่มยอดคนใช้โค้ด +1
      prisma.redeemCode.update({
        where: { id: redeemCode.id },
        data: { usedCount: { increment: 1 } }
      }),
      // บันทึกประวัติว่าคนนี้ใช้โค้ดนี้แล้ว
      prisma.redemption.create({
        data: { userId: user.id, codeId: redeemCode.id }
      })
    ]);

    return NextResponse.json({ 
      success: true, 
      message: `ยินดีด้วย! คุณได้รับ ${redeemCode.points} พอยท์`,
      points: redeemCode.points 
    });

  } catch (error) {
    console.error("Redeem Error:", error);
    return NextResponse.json({ error: "ระบบขัดข้อง กรุณาลองใหม่อีกครั้ง" }, { status: 500 });
  }
}