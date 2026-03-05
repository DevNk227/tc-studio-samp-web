// src/app/api/launcher-config/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { username: session.user.name as string } });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const body = await request.json();

    // บันทึกหรืออัปเดตการตั้งค่า (Upsert)
    const config = await prisma.launcherConfig.upsert({
      where: { userId: user.id },
      update: body,
      create: { ...body, userId: user.id },
    });

    return NextResponse.json({ message: "บันทึกการตั้งค่าสำเร็จ!", config });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}