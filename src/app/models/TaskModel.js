import { Mongoose } from 'mongoose';

const taskShema = new Mongoose.Schema({
    userId: { type: Mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    priority: { type: String, required: false },
    dueDate: { type: Date, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

taskShema.pre('save', async function () {
    this.updatedAt = Date.now();
})

const TaskModel = Mongoose.model('Task', taskShema);

module.exports = TaskModel;