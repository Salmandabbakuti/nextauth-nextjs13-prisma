import { prisma } from "@/lib/prisma";
import { hashSync } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password } = (await req.json()) as {
      name: string;
      email: string;
      password: string;
    };
    const user = await prisma.user.findUnique({
      where: { email }
    });
    if (user) throw new Error("Email already in use");

    const hashedPassword = hashSync(password, 12);
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword
      }
    });

    return NextResponse.json({
      user: {
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        code: "USER_EXISTS",
        message: error.message
      }),
      { status: 500 }
    );
  }
}
