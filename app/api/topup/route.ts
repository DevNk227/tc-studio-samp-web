// src/app/api/topup/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    // 1. เช็คว่าล็อกอินหรือยัง
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "กรุณาล็อกอินก่อนเติมเงิน" }, { status: 401 });
    }

    // 2. รับไฟล์รูปภาพที่ผู้เล่นอัปโหลดมา
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "กรุณาอัปโหลดสลิปโอนเงิน" }, { status: 400 });
    }

    // 3. ส่งรูปไปให้ EasySlip ตรวจสอบ (ยิง API)
    const easyslipFormData = new FormData();
    easyslipFormData.append("file", file);

    const easyslipRes = await fetch("https://developer.easyslip.com/api/v1/verify", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.EASYSLIP_API_KEY}`,
      },
      body: easyslipFormData,
    });

    const easyslipData = await easyslipRes.json();

    // 4. เช็คผลลัพธ์จาก EasySlip (ถ้า status ไม่ใช่ 200 แปลว่าสลิปปลอม/อ่านไม่ออก)
    if (easyslipData.status !== 200) {
      return NextResponse.json({ message: "สลิปไม่ถูกต้อง หรือไม่พบ QR Code บนสลิป" }, { status: 400 });
    }

    // ดึงข้อมูลยอดเงินและรหัสอ้างอิง (อ้างอิงตามโครงสร้างข้อมูลของ EasySlip)
    const amount = easyslipData.data.amount.amount; 
    const slipRef = easyslipData.data.transRef; 

    // 5. ป้องกันการโกง: เช็คว่าสลิปนี้เคยถูกเติมไปแล้วหรือยังในระบบเรา!
    const existingSlip = await prisma.topupHistory.findUnique({
      where: { slipRef: slipRef }
    });

    if (existingSlip) {
      return NextResponse.json({ message: "สลิปนี้ถูกใช้งานไปแล้ว! (ห้ามเติมซ้ำ)" }, { status: 400 });
    }

    // 6. บันทึกข้อมูล (เพิ่มเงินให้ผู้เล่น + บันทึกประวัติสลิป) 
    // ใช้ $transaction เพื่อให้ระบบทำพร้อมกัน ป้องกันข้อผิดพลาด
    const user = await prisma.user.findUnique({ where: { username: session.user.name as string } });

    if (!user) return NextResponse.json({ message: "ไม่พบข้อมูลผู้ใช้" }, { status: 404 });

    await prisma.$transaction([
      // บวกเงิน
      prisma.user.update({
        where: { id: user.id },
        data: { balance: user.balance + amount }
      }),
      // บันทึกประวัติ
      prisma.topupHistory.create({
        data: {
          userId: user.id,
          amount: amount,
          slipRef: slipRef
        }
      })
    ]);

    return NextResponse.json({ 
      message: `เติมเงินสำเร็จ! ได้รับเครดิต ${amount} บาท`, 
      amount: amount 
    });

  } catch (error) {
    console.error("Topup Error:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์" }, { status: 500 });
  }
}