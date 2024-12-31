"use server";

export async function getUnspalshImages(query?: string) {
  try {
    const baseUrl = query
      ? `https://api.unsplash.com/search/photos?query=${query}&per_page=8`
      : `https://api.unsplash.com/photos/random?count=8`;

    const response = await fetch(baseUrl, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    // ตรวจสอบสถานะของการตอบกลับ
    if (!response.ok) {
      if (response.status === 429) {
        // Rate Limit Exceeded
        console.error("เกินจำนวนคำขอที่อนุญาต กรุณาลองใหม่ในภายหลัง.");
        return {
          status: response.status,
          data: "api unsplash เกินจำนวนคำขอที่อนุญาต กรุณาลองใหม่ในภายหลัง.",
        };
      }
      // ถ้าไม่ใช่ 429 ก็โยน error ทั่วไป
      throw new Error(`การดึงข้อมูลล้มเหลว: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      status: response.status,
      // ถ้ามีการค้นหา จะได้ data.results แทน data
      data: query ? data.results : data,
    };
  } catch (error) {
    console.log("Error fetching data:", error);
    return { status: 500, data: null };
  }
}
