import { NextApiResponse, NextApiRequest } from "next";
const UserModel = require('../../../models/UserModel');
const jwt = require('jsonwebtoken');
import { z } from 'zod';

export async function POST(request: NextApiRequest, response: NextApiResponse) {
    const userSchema = z.object({ email: z.string().email(), password: z.string() });

    const user = userSchema.safeParse(request.body)
    const expiresIn = '24h';
    const secretKey = process.env.JWT_SECRET_KEY;

    if (!user.success) {
        return response.status(400).json({ errors: user.error.format() })
    }

    const foundUser = await UserModel.findOne({ email: user.data.email })

    if (!foundUser) {
        return response.status(401).json({ errors: 'Unauthorized' })
    }

    if (! await UserModel.comparePassword(user.data.password)){
        return response.status(401).json({ errors: 'Invalid credentials. Please check your username and password and try again.' })
    }

    const connectionData = jwt.sign({ userId: foundUser._id, email: foundUser.email }, secretKey, { expiresIn: expiresIn });

    return response.status(200).json({ data: connectionData })
}
