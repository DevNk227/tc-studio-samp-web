// src/app/api/launcher/[username]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    // 1. ค้นหาผู้ใช้จากชื่อ Username ที่ส่งมาใน URL
    const user = await prisma.user.findUnique({
      where: { username: username },
      include: { 
        launcherConfig: true,
        subscription: true 
      }
    });

    if (!user) {
      return NextResponse.json({ error: "ไม่พบข้อมูลผู้ใช้งาน" }, { status: 404 });
    }

    // (ตัวเลือกเสริม) เช็คว่าแพ็กเกจหมดอายุหรือยัง ถ้าหมดอายุอาจจะส่ง error กลับไปให้ Launcher แจ้งเตือน
    const now = new Date();
    const isExpired = user.subscription ? user.subscription.expireDate < now : true;
    if (isExpired) {
      return NextResponse.json({ error: "แพ็กเกจการใช้งานหมดอายุ กรุณาต่ออายุบนเว็บไซต์" }, { status: 403 });
    }

    const config = user.launcherConfig;

    // 2. ถ้าลูกค้ายังไม่เคยตั้งค่าอะไรเลย ให้ส่งค่าเริ่มต้น (Default) กลับไป
    if (!config) {
      return NextResponse.json({
        clientVersionCode: 1,
        clientSampVersionCode: 1,
        gameFilesVersionCode: 1,
        URL_GAME_FILES: "",
        URL_GAME_FILES_UPD: "",
        URL_VK: "",
        URL_DISCORD: "",
        URL_YOUTUBE: "",
        URL_FORUM: "",
        URL_DONATE: "",
        URL_CLIENT: "",
        URL_CLIENTSAMPAPK: ""
      });
    }

    // 3. จัดรูปแบบ JSON ให้ตรงกับที่แอปมือถือต้องการเป๊ะๆ
    const apiJson = {
      clientVersionCode: config.clientVersionCode,
      clientSampVersionCode: config.clientSampVersionCode,
      gameFilesVersionCode: config.gameFilesVersionCode,
      URL_GAME_FILES: config.urlGameFiles,
      URL_GAME_FILES_UPD: config.urlGameFilesUpd,
      URL_VK: config.urlVk,
      URL_DISCORD: config.urlDiscord,
      URL_YOUTUBE: config.urlYoutube,
      URL_FORUM: config.urlForum,
      URL_DONATE: config.urlDonate,
      URL_CLIENT: config.urlClient,
      URL_CLIENTSAMPAPK: config.urlClientSampApk
    };

    return NextResponse.json(apiJson);

  } catch (error) {
    console.error("Launcher API Error:", error);
    return NextResponse.json({ error: "เซิร์ฟเวอร์ขัดข้อง" }, { status: 500 });
  }
}