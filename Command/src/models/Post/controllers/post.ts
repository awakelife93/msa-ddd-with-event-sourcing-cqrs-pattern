import express from "express";
import {
  CommonStatusCode,
  CommonStatusMessage,
} from "../../../../../common/status";
import { validateDTO } from "../../../utils/validator";
import CreatePostRequestDTO from "../dtos/CreatePostRequestDTO";
import CreatePostResponseDTO from "../dtos/CreatePostResponseDTO";
import DeletePostResponseDTO from "../dtos/DeletePostResponseDTO";
import UpdatePostRequestDTO from "../dtos/UpdatePostRequestDTO";
import UpdatePostResponseDTO from "../dtos/UpdatePostResponseDTO";
import {
  CreatePostService,
  DeletePostService,
  UpdatePostService,
} from "../services/post";

export const CreatePostController = async (
  request: express.Request,
): Promise<CreatePostResponseDTO> => {
  return new CreatePostResponseDTO(
    await CreatePostService(
      validateDTO(new CreatePostRequestDTO(request.body), {
        message: "The CreatePostController Dto is abnormal.",
      }),
    ),
  );
};

export const UpdatePostController = async (
  request: express.Request,
): Promise<UpdatePostResponseDTO> => {
  const postId = request.params["postId"];

  if (!postId) {
    throw {
      status: CommonStatusCode.BAD_REQUEST,
      message: CommonStatusMessage.BAD_REQUEST,
    };
  }

  return new UpdatePostResponseDTO(
    await UpdatePostService(
      Number(postId),
      validateDTO(
        new UpdatePostRequestDTO(request.body),
        {
          message: "The UpdatePostController Dto is abnormal.",
        },
        {
          skipFields: ["author_name", "content", "title"],
        },
      ),
    ),
  );
};

export const DeletePostController = async (
  request: express.Request,
): Promise<DeletePostResponseDTO> => {
  const postId = request.params["postId"];

  if (!postId) {
    throw {
      status: CommonStatusCode.BAD_REQUEST,
      message: CommonStatusMessage.BAD_REQUEST,
    };
  }

  return new DeletePostResponseDTO(await DeletePostService(Number(postId)));
};
