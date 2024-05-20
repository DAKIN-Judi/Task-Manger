import { Schema, Document } from 'mongoose';
import mongoose from 'mongoose'

interface Task extends Document {
  _id: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  title: string;
  description: string;
  status: 'pending' | 'done';
  priority?: Number;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  update(taskData: Partial<Task>): Promise<Task>;
}

const taskSchema = new Schema<Task>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true,  enum: ['pending', 'done'], default: 'pending' },
  priority: { type: Number, required: false },
  dueDate: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

taskSchema.pre('save', function (this: Task, next) {
  this.updatedAt = new Date(Date.now());
  next();
});

taskSchema.methods.update = async function (taskData: Partial<Task>) {
  Object.assign(this, taskData);
  await this.save();
  return this;
}

const Task = mongoose.models.Task || mongoose.model<Task>('Task', taskSchema);
export default Task;
