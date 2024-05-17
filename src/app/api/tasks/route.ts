import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

import authenticate from "@/app/task/authenticate";
import User from "@/app/models/User";

export async function GET (request: Request) {
    const user = new User(await authenticate(request))

    if (user instanceof NextResponse) {
        return user;
    }


    const userTasks = user.tasks()

    return NextResponse.json({ name: 'hello', userTasks })
}

// export async function POST (request: NextApiRequest, response: NextApiResponse) {
//     return response.json({ name: 'hello'})
// }

// export async function PUT (request: NextApiRequest, response: NextApiResponse) {
//     return response.json({ name: 'hello'})
// }


// export async function DELETE (request: NextApiRequest, response: NextApiResponse) {
//     return response.json({ name: 'hello'})
// }
