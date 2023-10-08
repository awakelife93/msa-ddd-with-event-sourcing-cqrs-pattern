import { Post } from "@prisma/client";
import { getDomain } from "../../../../../Domain";
import { CudActionEnum } from "../../../../../common/enum";
import {
  CommonStatusCode,
  CommonStatusMessage,
} from "../../../../../common/status";
import BeginTransaction from "../../../database/BeginTransaction";
import CreatePostRequestDTO from "../dtos/CreatePostRequestDTO";
import UpdatePostRequestDTO from "../dtos/UpdatePostRequestDTO";

export const CreatePostService = async (
  createPostRequestDto: CreatePostRequestDTO,
): Promise<Post> => {
  return await BeginTransaction<Promise<Post>>(
    async (tx) => {
      const lastPost = await tx.post.findFirst({
        orderBy: {
          post_id: "desc",
        },
      });

      return await tx.post.create({
        data: {
          ...createPostRequestDto,
          post_id: lastPost ? lastPost.post_id + 1 : 1,
        },
      });
    },
    {
      domainName: getDomain("POST"),
      cudAction: CudActionEnum.CREATE,
    },
  );
};

export const UpdatePostService = async (
  post_id: number,
  updatePostRequestDto: UpdatePostRequestDTO,
): Promise<Post> => {
  return await BeginTransaction<Promise<Post>>(
    async (tx) => {
      const post = await tx.post.findFirst({
        orderBy: {
          version: "desc",
        },
        where: { post_id },
      });

      if (!post) {
        throw {
          status: CommonStatusCode.INTERNAL_SERVER_ERROR,
          message: CommonStatusMessage.INTERNAL_SERVER_ERROR,
        };
      }

      return await tx.post.create({
        data: {
          author_name: updatePostRequestDto.author_name,
          content: updatePostRequestDto.content,
          title: updatePostRequestDto.title,
          post_id,
          version: post.version + 1,
        },
      });
    },
    {
      domainName: getDomain("POST"),
      cudAction: CudActionEnum.UPDATE,
    },
  );
};

export const DeletePostService = async (post_id: number): Promise<Post> => {
  return await BeginTransaction<Promise<Post>>(
    async (tx) => {
      const post = await tx.post.findFirst({
        orderBy: {
          version: "desc",
        },
        where: { post_id },
      });

      if (!post) {
        throw {
          status: CommonStatusCode.INTERNAL_SERVER_ERROR,
          message: CommonStatusMessage.INTERNAL_SERVER_ERROR,
        };
      }

      return await tx.post.create({
        data: {
          author_name: post.author_name,
          content: post.content,
          title: post.title,
          post_id,
          deleted: true,
          version: post.version + 1,
        },
      });
    },
    {
      domainName: getDomain("POST"),
      cudAction: CudActionEnum.DELETE,
    },
  );
};
