import express from "express";
import {
  CommonStatusCode,
  CommonStatusMessage,
} from "../../../../../common/status";
import { generateGetMethodParam } from "../../../utils/request-handler";
import GetAllPostRequestDTO from "../dtos/GetAllPostRequestDTO";
import GetPostRequestDTO from "../dtos/GetPostRequestDTO";
import GetPostResponseDTO from "../dtos/GetPostResponseDTO";
import {
  GetAllPostService,
  GetPostByIdService,
  GetPostService,
} from "../services/post";

export const GetPostByIdController = async (
  request: express.Request,
): Promise<GetPostResponseDTO> => {
  const postId = request.params["postId"];

  if (!postId) {
    throw {
      status: CommonStatusCode.BAD_REQUEST,
      message: CommonStatusMessage.BAD_REQUEST,
    };
  }

  return await GetPostByIdService(Number(postId));
};

export const GetPostController = async (
  request: express.Request,
): Promise<GetPostResponseDTO> => {
  return await GetPostService(
    new GetPostRequestDTO(generateGetMethodParam(request)),
  );
};

export const GetAllPostController = async (
  request: express.Request,
): Promise<GetPostResponseDTO[]> => {
  return await GetAllPostService(
    new GetAllPostRequestDTO(generateGetMethodParam(request)),
  );
};
