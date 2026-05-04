export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/posts/new", "/posts/:id/edit"],
};
