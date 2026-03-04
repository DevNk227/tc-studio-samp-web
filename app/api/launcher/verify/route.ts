import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // เรียกใช้ Prisma ที่เราสร้างไว้

export async function POST(request: Request) {
  try {
    // 1. รับค่าที่ Launcher ส่งมา (เป็น JSON)
    const body = await request.json();
    const { username, password, device_id } = body;

    // เช็คว่าส่งข้อมูลมาครบไหม
    if (!username || !password || !device_id) {
      return NextResponse.json({ status: 'error', message: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    // 2. ค้นหาไอดีผู้เล่นในฐานข้อมูล พร้อมดึงข้อมูลแพ็กเกจ (Subscription) มาด้วย
    const user = await prisma.user.findUnique({
      where: { username: username },
      include: { subscription: true }
    });

    // 3. ตรวจสอบไอดีและรหัสผ่าน (ในระบบจริงควรเข้ารหัสผ่านด้วย bcrypt)
    if (!user || user.password !== password) {
      return NextResponse.json({ status: 'error', message: 'ไอดีหรือรหัสผ่านไม่ถูกต้อง' });
    }

    // 4. ตรวจสอบแพ็กเกจเช่า
    if (!user.subscription) {
      return NextResponse.json({ status: 'error', message: 'คุณยังไม่มีแพ็กเกจ กรุณาเช่าผ่านเว็บไซต์' });
    }

    const now = new Date();
    if (user.subscription.expireDate < now) {
      return NextResponse.json({ status: 'error', message: 'แพ็กเกจของคุณหมดอายุแล้ว' });
    }

    // 5. ระบบตรวจสอบและผูก Device ID (HWID)
    // กรณีเพิ่งซื้อแพ็กเกจใหม่ (hwid ในระบบยังเป็นค่าว่าง)
    if (!user.subscription.hwid) {
      await prisma.subscription.update({
        where: { id: user.subscription.id },
        data: { hwid: device_id } // บันทึก Device ID ของเครื่องนี้ล็อกไว้เลย
      });
      return NextResponse.json({ 
        status: 'success', 
        message: 'ผูกอุปกรณ์สำเร็จ เข้าเกมได้',
        expire_date: user.subscription.expireDate
      });
    }

    // กรณีมี hwid ผูกไว้แล้ว ให้เช็คว่าตรงกับเครื่องที่กำลังล็อกอินไหม
    if (user.subscription.hwid !== device_id) {
      return NextResponse.json({ status: 'error', message: 'ไม่อนุญาตให้ล็อกอินบนอุปกรณ์อื่น' });
    }

    // 6. ถ้าผ่านทุกด่าน ปล่อยผ่านให้เข้าเกมได้!
    return NextResponse.json({ 
      status: 'success', 
      message: 'ยินดีต้อนรับเข้าสู่เซิร์ฟเวอร์',
      expire_date: user.subscription.expireDate
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ status: 'error', message: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์' }, { status: 500 });
  }
}