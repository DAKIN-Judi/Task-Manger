import Task from "@/app/models/Task";
import { NextResponse } from "next/server";
import authenticate from "@/app/task/authenticate";
import { z } from 'zod';

type RouteParams = {
    params: {
        id: string
    }
}

const updatedTaskValidator = z.object({
    title: z.string().min(2).optional(),
    description: z.string().optional(),
    status: z.string().optional(),
    priority: z.number().optional(),
    dueDate: z.string().optional()
});

export async function GET(request: Request, { params }: RouteParams) {

    const user = await authenticate(request)

    if (user instanceof NextResponse) {
        return user;
    }

    const task = await Task.findById(params.id)

    if (!task) {
        return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ task }, { status: 200 })
}

export async function PUT(request: Request, { params }: RouteParams) {
    const user = await authenticate(request)
    const task = updatedTaskValidator.safeParse(await request.json())

    if (user instanceof NextResponse) {
        return user;
    } else if (!task.success) {
        return NextResponse.json({ errors: task.error.format() }, { status: 400 })
    }

    const retrieveTask = await Task.findById(params.id)
    if (!retrieveTask) {
        return NextResponse.json({ message: 'Task not found' }, { status: 404 })
    } else {
        const updatedTask = await retrieveTask.update(task.data)
        return NextResponse.json({ task: updatedTask });
    }

}


export async function DELETE(request: Request, { params }: RouteParams) {
    const user = await authenticate(request)

    if (user instanceof NextResponse) {
        return user;
    }

    const task = await Task.findById(params.id)

    if (!task) {
        return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    const response = await task.deleteOne()

    if (!response) {
        return NextResponse.json({ message: 'Task deletion error' }, { status: 400 })
    } else {
        return NextResponse.json({ message: 'Task deleted successfully' })
    }
}
