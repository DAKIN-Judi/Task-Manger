
import { NextApiResponse, NextApiRequest } from "next";
import { NextResponse } from "next/server";
const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');

export default async function authenticate(request: NextApiRequest, response: NextApiResponse) {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authorizationHeader.replace('Bearer ', '')
    const secretKey = process.env.JWT_SECRET_KEY
    try {

        const decoded = jwt.verify(token, secretKey);

        const user = await UserModel.findOne({ _id: decoded.userId })

        if (!user) {
            return response.status(401).json({ error: 'Unauthorized' });
        } else {
            return user
        }

    } catch (error) {
        console.error('Authentication error:', error);
        return response.status(401).json({ error: 'Invalid token' });
    }
}

