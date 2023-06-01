import {
    CommonStatusCode,
    CommonStatusMessage
} from "../../../../../common/status";
import PostModel from "../../../../mongoose/models/post";
import { IPost } from "../../../../mongoose/schemas/post";
import { generateFilterQuery } from "../../../utils/generate-query";
import GetAllPostRequestDTO from "../dtos/GetAllPostRequestDTO";
import GetPostByIdResponseDTO from "../dtos/GetPostByIdResponseDTO";
import GetPostRequestDTO from "../dtos/GetPostRequestDTO";
import GetPostResponseDTO from "../dtos/GetPostResponseDTO";

export const GetPostByIdService = async (
    id: number
): Promise<GetPostByIdResponseDTO> => {
    const post = await PostModel.findOne({ id });

    if (!post) {
        throw {
            status: CommonStatusCode.NOT_FOUND,
            message: CommonStatusMessage.NOT_FOUND
        };
    }

    return new GetPostByIdResponseDTO(post.toObject());
};

export const GetPostService = async (
    getPostRequestDTO: GetPostRequestDTO
): Promise<GetPostResponseDTO> => {
    const { id, title, content, author_name } = getPostRequestDTO;
    const post = await PostModel.findOne({
        $or: [{ id }, { title }, { content }, { author_name }]
    });

    if (!post) {
        throw {
            status: CommonStatusCode.NOT_FOUND,
            message: CommonStatusMessage.NOT_FOUND
        };
    }

    return new GetPostResponseDTO(post.toObject());
};

export const GetAllPostService = async (
    getAllPostRequestDTO: GetAllPostRequestDTO
): Promise<GetPostResponseDTO[]> => {
    const { id, title, content, author_name } = getAllPostRequestDTO;

    const queries = generateFilterQuery<IPost>({
        id,
        title,
        content,
        author_name
    });

    const posts = await PostModel.find({
        $or: queries
    });

    return posts.map((post) => {
        return new GetPostResponseDTO(post.toObject());
    });
};
