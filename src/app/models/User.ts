const mongoose = require('mongoose');
import { Schema, Document } from 'mongoose';
import Task from './Task';
const bcrypt = require('bcrypt');

interface User extends Document {
    firstName: String;
    lastName: String;
    password: String;
    email: String;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    tasks(): Promise<Task[]>;
}

const userSchema = new Schema<User>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password;
            return ret;
        }
    },
    toObject: {
        transform: function(doc, ret) {
            delete ret.password;
            return ret;
        }
    }
});

userSchema.pre('save', async function (next: any) {
    this.updatedAt = new Date(Date.now());

    if (!this.isModified('password')) {
        return next();
    }

    try {
        this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword: String) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.tasks = async function() {
    await this.populate('tasks');
    return this.tasks;
}

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User