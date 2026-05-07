import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function proxyRequest(
  req: NextRequest,
  path: string[]
): Promise<NextResponse> {
  const session = await auth();

  const pathStr = path.join("/");
  const searchParams = req.nextUrl.searchParams.toString();
  const backendUrl = `${API_URL}/api/${pathStr}${searchParams ? `?${searchParams}` : ""}`;

  // console.log(`[PROXY] ${req.method} → ${backendUrl}`);
  // console.log(`[PROXY] Auth: ${session?.user?.token ? "Bearer token present" : "NO TOKEN (unauthenticated)"}`);

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (session?.user?.token) {
    headers["Authorization"] = `Bearer ${session.user.token}`;
  }

  const contentType = req.headers.get("Content-Type") ?? "";
  let body: BodyInit | null = null;

  if (req.method !== "GET" && req.method !== "HEAD") {
    if (contentType.includes("multipart/form-data")) {
      // Forward as FormData — let fetch set the Content-Type with boundary
      body = await req.formData();
    } else {
      body = await req.text();
      if (contentType) headers["Content-Type"] = contentType;
    }
  }

  try {
    const response = await fetch(backendUrl, {
      method: req.method,
      headers,
      body,
    });

    const responseText = await response.text();
    // console.log(`[PROXY] Response: ${response.status} ${response.statusText}`);
    // if (!response.ok) {
    // console.log(`[PROXY] Error body: ${responseText.slice(0, 500)}`);
    // }

    let responseData: unknown;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: responseText };
    }

    return NextResponse.json(responseData, { status: response.status });
  } catch (err) {
    console.error(`[PROXY] Failed to reach backend: ${backendUrl}`, err);
    return NextResponse.json(
      { message: "Gagal terhubung ke server." },
      { status: 502 }
    );
  }
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, { params }: RouteContext) {
  return proxyRequest(req, (await params).path);
}
export async function POST(req: NextRequest, { params }: RouteContext) {
  return proxyRequest(req, (await params).path);
}
export async function PUT(req: NextRequest, { params }: RouteContext) {
  return proxyRequest(req, (await params).path);
}
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  return proxyRequest(req, (await params).path);
}
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  return proxyRequest(req, (await params).path);
}
