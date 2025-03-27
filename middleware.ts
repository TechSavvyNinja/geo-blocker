import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function getCountryFromIP(ip: string): Promise<string | null> {
  try {
    // Using ipapi.co - a free GeoIP API service
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    return data.country_code;
  } catch (error) {
    console.error("Error fetching GeoIP data:", error);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "0.0.0.0";

  const country = await getCountryFromIP(ip);

  if (country === "US") {
    return new Response("Access denied: Not available in the USA", {
      status: 403,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/", // Apply to homepage (or change as needed)
};
