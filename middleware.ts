import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

import prisma from '@/lib/prisma';

export default async function middleware(req: NextRequest, res: NextResponse) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = req.nextUrl.pathname;

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const protectedRoutes = ["/dashboard", "/students", "/add-student", "/add-batch", "/batch-email", "/file-upload"];

  if (protectedRoutes.includes(path) && !session) {
    return NextResponse.redirect(new URL("/", req.url));
  } else if (session && (path === "/" || path === "/register")) {
    return NextResponse.redirect(new URL("/dashboard",req.url));
  }

  // if (!session && path === "/protected") {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // } else if (session && (path === "/login" || path === "/register")) {
  //   return NextResponse.redirect(new URL(req.url));
  // }
  return NextResponse.next();
}