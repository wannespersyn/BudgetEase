import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  admin: boolean;
  createdAt: Date;
}

const userSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
