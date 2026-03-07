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

    // 4. ส่งแจ้งเตือนไปยัง Discord (ทำงานอยู่เบื้องหลัง)
    try {
      const botToken = process.env.DISCORD_BOT_TOKEN;
      const channelId = process.env.DISCORD_CHANNEL_ID;

      if (botToken && channelId) {
        await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bot ${botToken}`,
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            embeds: [
              {
                title: "🎉 มีลูกค้าสมัครสมาชิกใหม่!",
                description: `ยินดีต้อนรับผู้ใช้งานใหม่เข้าสู่ระบบ TC STUDIO`,
                color: 3066993, // สีเขียว
                fields: [
                  { name: "ชื่อผู้ใช้ (Username)", value: `\`${newUser.username}\``, inline: true },
                  { name: "ระดับไอดี (Role)", value: `\`${newUser.role}\``, inline: true }
                ],
                timestamp: new Date().toISOString(),
                footer: { text: "TC STUDIO Auto-Notification" }
              }
            ]
          })
        });
      }
    } catch (discordError) {
      // ถ้าส่งแจ้งเตือนพลาด ให้แค่แจ้งเตือนใน Console แต่ไม่ต้องให้เว็บพัง
      console.error("Discord Notification Failed:", discordError);
    }

    return NextResponse.json({ message: "สมัครสมาชิกสำเร็จ!" }, { status: 201 });

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดของเซิร์ฟเวอร์" }, { status: 500 });
  }
}