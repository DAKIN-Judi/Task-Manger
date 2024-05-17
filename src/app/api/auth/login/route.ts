import { NextResponse } from "next/server";
import User from "@/app/models/User"
const jwt = require('jsonwebtoken');
import { z } from 'zod';
import { connectDB } from "@/app/db/config";

connectDB();

const userSchema = z.object({ email: z.string().email(), password: z.string() });

export async function POST(request: any) {

    const user = userSchema.safeParse(await request.json())
    const expiresIn = '24h';
    const secretKey = process.env.JWT_SECRET_KEY;

    if (!user.success) {
        return NextResponse.json({ errors: user.error.format() })
    }

    const foundUser = await User.findOne({ email: user.data.email })

    if (!foundUser) {
        return NextResponse.json({ errors: 'Unauthorized 1' }, { status: 401 })
    }

    if (! await foundUser.comparePassword(user.data.password)){
        return NextResponse.json({ errors: 'Invalid credentials. Please check your username and password and try again.' }, { status: 401 })
    }

    const connectionData = jwt.sign({ userId: foundUser._id, email: foundUser.email }, secretKey, { expiresIn: expiresIn });

    return NextResponse.json({ token: connectionData, user: foundUser })
}
