// src/app/api/admin/announce/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // ปรับ path ให้ตรงกับไฟล์ prisma ของคุณ

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, message } = body;

    // 1. เช็คว่ากรอกข้อมูลมาครบไหม
    if (!title || !message) {
      return NextResponse.json({ error: "กรุณากรอกหัวข้อและเนื้อหาประกาศ" }, { status: 400 });
    }

    // 2. บันทึกประกาศลงฐานข้อมูล (เพื่อเอาไปโชว์หน้าเว็บ)
    await prisma.announcement.create({
      data: {
        title: title,
        message: message
      }
    });

    // 3. สั่งบอทให้ส่งข้อความเข้า Discord
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
          content: "@everyone 📢 **ประกาศใหม่จากผู้บริหาร TC STUDIO!**", // แท็กทุกคนในดิส
          embeds: [
            {
              title: `📌 ${title}`,
              description: message,
              color: 16766720, // สีเหลืองทอง
              timestamp: new Date().toISOString(),
              footer: { text: "TC STUDIO Official Announcement" }
            }
          ]
        })
      }).catch(err => console.error("Discord Bot Error:", err));
    }

    return NextResponse.json({ success: true, message: "ส่งประกาศสำเร็จ!" }, { status: 200 });

  } catch (error) {
    console.error("Announce Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดของเซิร์ฟเวอร์" }, { status: 500 });
  }
}