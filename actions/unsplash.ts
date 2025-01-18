"use server";

const cache = new Map();

// ฟังก์ชันสำหรับดึงข้อมูลจาก Unsplash API
export async function getUnsplashImages(query?: string) {
  const cacheKey = query ? `unsplash_${query}` : "unsplash_random";
  const now = Date.now();

  // ตรวจสอบแคชใน Memory Cache
  if (cache.has(cacheKey)) {
    const cachedItem = cache.get(cacheKey);
    if (cachedItem.cacheExpiry > now) {
      console.log("Using cached data for:", cacheKey);
      return cachedItem;
    }
    // ลบแคชที่หมดอายุ
    cache.delete(cacheKey);
  }

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
        console.error("เกินจำนวนคำขอที่อนุญาต กรุณาลองใหม่ในภายหลัง.");
        return {
          status: 429,
          data: null,
        };
      }
      throw new Error(`การดึงข้อมูลล้มเหลว: ${response.statusText}`);
    }

    const data = await response.json();

    // บันทึกข้อมูลลง Memory Cache พร้อมระบุเวลาหมดอายุ
    const cacheData = {
      status: 200,
      data: query ? data.results : data,
      cacheExpiry: now + 3600 * 1000, // แคชไว้ 1 ชั่วโมง
    };
    cache.set(cacheKey, cacheData);

    return cacheData;
  } catch (error) {
    console.error("Error fetching Unsplash images:", error);
    return { status: 500, data: null };
  }
}

// ฟังก์ชันสำหรับล้างแคชที่หมดอายุ
export async function cleanUpExpiredCache() {
  const now = Date.now();

  for (const [key, cachedItem] of cache.entries()) {
    if (cachedItem.cacheExpiry < now) {
      console.log(`Removing expired cache for key: ${key}`);
      cache.delete(key);
    }
  }
}
