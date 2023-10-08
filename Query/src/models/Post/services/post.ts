import {
  CommonStatusCode,
  CommonStatusMessage,
} from "../../../../../common/status";
import PostModel from "../../../../mongoose/models/post";
import { IPost } from "../../../../mongoose/schemas/post";
import { generateFilterQuery } from "../../../utils/generate-query";
import GetAllPostRequestDTO from "../dtos/GetAllPostRequestDTO";
import GetPostByIdResponseDTO from "../dtos/GetPostByIdResponseDTO";
import GetPostRequestDTO from "../dtos/GetPostRequestDTO";
import GetPostResponseDTO from "../dtos/GetPostResponseDTO";

export const GetPostByIdService = async (
  post_id: number,
): Promise<GetPostByIdResponseDTO> => {
  const post = await PostModel.findOne({ post_id }).lean().exec();

  if (!post) {
    throw {
      status: CommonStatusCode.NOT_FOUND,
      message: CommonStatusMessage.NOT_FOUND,
    };
  }

  console.log("==========>");
  return new GetPostByIdResponseDTO(post);
};

export const GetPostService = async (
  getPostRequestDTO: GetPostRequestDTO,
): Promise<GetPostResponseDTO> => {
  const { post_id, title, content, author_name } = getPostRequestDTO;

  const queries = generateFilterQuery<IPost>({
    post_id,
    title,
    content,
    author_name,
  });

  const post = await PostModel.findOne({
    $or: queries,
  })
    .lean()
    .exec();

  if (!post) {
    throw {
      status: CommonStatusCode.NOT_FOUND,
      message: CommonStatusMessage.NOT_FOUND,
    };
  }

  return new GetPostResponseDTO(post);
};

export const GetAllPostService = async (
  getAllPostRequestDTO: GetAllPostRequestDTO,
): Promise<GetPostResponseDTO[]> => {
  const { post_id, title, content, author_name } = getAllPostRequestDTO;

  const queries = generateFilterQuery<IPost>({
    post_id,
    title,
    content,
    author_name,
  });

  const posts = await PostModel.find({
    $or: queries,
  })
    .lean()
    .exec();

  return posts.map((post) => {
    return new GetPostResponseDTO(post);
  });
};
