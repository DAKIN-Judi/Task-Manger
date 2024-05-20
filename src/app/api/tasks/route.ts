import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import authenticate from "@/app/task/authenticate";
import { z } from 'zod';


const createTaskValidator = z.object({
    title: z.string().min(2),
    description: z.string(),
    status: z.string(),
    priority: z.number(),
    dueDate: z.string(),
});


export async function GET(request: Request) {

    const user = await authenticate(request)

    if (user instanceof NextResponse) {
        return user;
    }

    const userTasks = await user.getTasks()

    return NextResponse.json({ tasks: userTasks })
}

export async function POST(request: any) {

    const user = await authenticate(request)
    const task = createTaskValidator.safeParse(await request.json())

    if (user instanceof NextResponse) {
        return user;
    } else if (!task.success) {
        return NextResponse.json({ errors: task.error.format() }, { status: 400 })
    }

    const newTask = await user.createTask(task.data)

    if (newTask) {
        return NextResponse.json({ message: 'Task saved successfully', task: newTask })
    } else {
        return NextResponse.json({ message: 'Task creation error' }, { status: 400 })
    }
}