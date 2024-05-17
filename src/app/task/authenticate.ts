
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/User"
const jwt = require('jsonwebtoken');
import { connectDB } from "@/app/db/config";

connectDB();

export default async function authenticate(request: any) {

    const authorizationHeader = request.headers.get('authorization');

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authorizationHeader.replace('Bearer ', '')
    const secretKey = process.env.JWT_SECRET_KEY
    try {

        const decoded = jwt.verify(token, secretKey);

        const user = await User.findOne({ _id: decoded.userId })

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        } else {
            return user
        }

    } catch (error) {
        console.error('Authentication error:', error);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}

