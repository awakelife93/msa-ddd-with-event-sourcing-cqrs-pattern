import mongoose from "mongoose";
import PostSchema, { IPost } from "../schemas/post";

const PostModel = mongoose.model<IPost>("post", PostSchema);
export default PostModel;
