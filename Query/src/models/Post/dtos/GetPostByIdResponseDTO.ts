import { ObjectId } from "mongoose";

class GetPostByIdResponseDTO {
    _id: ObjectId;
    post_id: number;
    title: string;
    content: string;
    author_name: string;
    created_at: Date;
    updated_at: Date;
    deleted: boolean;

    constructor({
        _id,
        post_id,
        title,
        content,
        author_name,
        created_at,
        updated_at,
        deleted
    }: {
        _id: ObjectId;
        post_id: number;
        title: string;
        content: string;
        author_name: string;
        created_at: Date;
        updated_at: Date;
        deleted: boolean;
    }) {
        this._id = _id;
        this.post_id = post_id;
        this.title = title;
        this.content = content;
        this.author_name = author_name;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.deleted = deleted;
    }
}

export default GetPostByIdResponseDTO;
