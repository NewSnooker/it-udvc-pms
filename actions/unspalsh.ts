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

    const data = await response.json();

    return {
      status: response.status,
      // ถ้ามีการค้นหา จะได้ data.results แทน data
      data: query ? data.results : data,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}
