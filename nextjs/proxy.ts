export { auth as proxy } from "@/auth";

export const config = {
  matcher: [
    "/:path*",
    "/dashboard/:path*",
    "/auth/register",
    "/auth/login",
    "/auth/logout",
  ],
};
