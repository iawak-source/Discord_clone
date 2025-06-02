import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/api/uploadthing",
  "/sign-in",      
  "/sign-up",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return NextResponse.next(); //  Cho phép đi qua nếu là route công khai
  }

  const { userId } = await auth();

  if (!userId) {
    //  Redirect đến /sign-in nếu không có user
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next(); //  Cho phép đi tiếp nếu có user
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};
