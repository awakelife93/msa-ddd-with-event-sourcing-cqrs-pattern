import mongoose, { ObjectId } from "mongoose";

export interface IPost {
    _id: ObjectId;
    post_id: number;
    created_at: Date;
    updated_at: Date;
    title: string;
    content: string;
    author_name: string;
    deleted: boolean;
}

const PostSchema = new mongoose.Schema<IPost>({
    post_id: {
        type: Number,
        required: true,
        unique: true
    },
    created_at: {
        type: Date,
        required: true
    },
    updated_at: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author_name: {
        type: String,
        required: true
    },
    deleted: {
        type: Boolean,
        required: true
    }
});

PostSchema.pre("find", function () {
    this.where({ deleted: false });
});

PostSchema.pre("findOne", function () {
    this.where({ deleted: false });
});

export default PostSchema;
