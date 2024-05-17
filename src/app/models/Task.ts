import { Schema, Document } from 'mongoose';
const mongoose = require('mongoose');

interface Task extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  description: string;
  status: string;
  priority?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<Task>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  priority: { type: String, required: false },
  dueDate: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

taskSchema.pre('save', async function (this: Task) {
  this.updatedAt = new Date(Date.now());
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
export default Task;
