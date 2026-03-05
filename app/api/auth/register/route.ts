// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 1. เช็คว่ากรอกข้อมูลมาครบไหม
    if (!username || !password) {
      return NextResponse.json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    // 2. เช็คว่าชื่อผู้ใช้งานนี้มีคนใช้ไปหรือยัง
    const existingUser = await prisma.user.findUnique({
      where: { username: username }
    });

    if (existingUser) {
      return NextResponse.json({ message: "ชื่อผู้ใช้งานนี้ถูกใช้ไปแล้ว กรุณาเปลี่ยนชื่อใหม่" }, { status: 400 });
    }

    // 3. บันทึกข้อมูลลงฐานข้อมูล
    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: password, // หมายเหตุ: สำหรับระบบเบื้องต้นเราใช้รหัสผ่านตรงๆ ไปก่อนเพื่อความง่ายครับ
        role: "user"
      }
    });

    return NextResponse.json({ message: "สมัครสมาชิกสำเร็จ!" }, { status: 201 });

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดของเซิร์ฟเวอร์" }, { status: 500 });
  }
}