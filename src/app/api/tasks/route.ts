import { NextApiResponse, NextApiRequest } from "next";
import authenticate from "@/app/task/authenticate";
export async function GET (request: NextApiRequest, response: NextApiResponse) {
    const user = await authenticate(request, response)
    

    return response.status(200).json({ name: 'hello'})
}

export async function POST (request: NextApiRequest, response: NextApiResponse) {
    return response.json({ name: 'hello'})
}

export async function PUT (request: NextApiRequest, response: NextApiResponse) {
    return response.json({ name: 'hello'})
}


export async function DELETE (request: NextApiRequest, response: NextApiResponse) {
    return response.json({ name: 'hello'})
}
