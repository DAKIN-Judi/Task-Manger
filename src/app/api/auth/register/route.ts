import { NextApiResponse, NextApiRequest } from "next";
import { NextResponse, NextRequest } from "next/server";
import User from "@/app/models/User"
import { z } from 'zod';
import { connectDB } from "@/app/db/config";

connectDB();

const userSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(5),
    confirmPassword: z.string().min(5),
});

export async function POST(request: any) {
    
    const user = userSchema.safeParse(await request.json())

    if (!user.success) {
        return NextResponse.json({ errors: user.error.format() }, {status: 400})
    }

    const countedUser = await User.countDocuments({ email: user.data.email })

    if (countedUser > 0) {
        return NextResponse.json({ errors: { email: 'This email has been already enrolled.' } }, {status: 400})
    }else if ( user.data.password != user.data.confirmPassword) {
        return NextResponse.json({ errors: { confirmPassword: 'Passwords do not match.' } }, {status: 400})
    }

    const newUser = new User(user.data)

    const createdUser = await newUser.save()
    if (createdUser) {
        return NextResponse.json({ message: 'User saved successfully', user: createdUser })
    }else {
        return NextResponse.json({ message: 'User creation error' }, { status: 400 })
    }
  
}
