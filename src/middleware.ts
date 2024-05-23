import { NextRequest, NextResponse } from "next/server";
import { isValidPassword } from "./lib/isValidPassword";

export async function middleware(req: NextRequest){
    if(await isAuthenticated(req) === false){
        return new NextResponse("Unauthorized", {
            status: 401,
            headers: { "WWW-Authenticate": "Basic"}
        })
    }
}

async function isAuthenticated(req: NextRequest){
  const authHeader = req.headers.get("Authorization") || req.headers.get("authorization")

  if(authHeader == null) return false

//   console.log(authHeader); Basic YWRtaW46MTIz
//   console.log(authHeader.split(" ")[1]); YWRtaW46MTIz
//   console.log(Buffer.from(authHeader.split(" ")[1], "base64")); Buffer(9) [ 97, 100, 109, 105, 110, 58, 49, 50, 51 ]
//   console.log(Buffer.from(authHeader.split(" ")[1], "base64").toString()); admin:123
  
  const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":")

  isValidPassword(password, 'asd')
  return username === process.env.ADMIN_USERNAME && await isValidPassword(password, process.env.HASHED_ADMIN_PASSWORD as string)
}

export const config = {
    matcher: '/admin/:path*'
}