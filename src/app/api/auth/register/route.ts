import { NextApiResponse, NextApiRequest } from "next";
const UserModel = require('../../../models/UserModel');
import { z } from 'zod';


const userSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(5),
    confirmPassword: z.string().min(5),
});

export default async function POST(request: NextApiRequest, response: NextApiResponse) {

    const user = userSchema.safeParse(request.body)

    if (!user.success) {
        return response.status(400).json({ errors: user.error.format() })
    }

    const countedUser = await UserModel.countDocuments({ email: user.data.email })

    if (countedUser > 0) {
        return response.status(400).json({ errors: { email: 'This email has been already enrolled.' } })
    }else if ( user.data.password != user.data.confirmPassword) {
        return response.status(400).json({ errors: { confirmPassword: 'Passwords do not match.' } })
    }

    const data = user.data

    const newUser = new UserModel({ data })

    newUser.save()
  
    return response.status(200).json({ message: 'User saved successfully' })
}
