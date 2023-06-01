import express from "express";
import {
    CommonStatusCode,
    CommonStatusMessage
} from "../../../../../common/status";
import CreatePostRequestDTO from "../dtos/CreatePostRequestDTO";
import CreatePostResponseDTO from "../dtos/CreatePostResponseDTO";
import DeletePostResponseDTO from "../dtos/DeletePostResponseDTO";
import UpdatePostRequestDTO from "../dtos/UpdatePostRequestDTO";
import UpdatePostResponseDTO from "../dtos/UpdatePostResponseDTO";
import {
    CreatePostService,
    DeletePostService,
    UpdatePostService
} from "../services/post";

export const CreatePostController = async (
    request: express.Request
): Promise<CreatePostResponseDTO> => {
    return new CreatePostResponseDTO(
        await CreatePostService(new CreatePostRequestDTO(request.body))
    );
};

export const UpdatePostController = async (
    request: express.Request
): Promise<UpdatePostResponseDTO> => {
    const postId = request.params["postId"];

    if (!postId) {
        throw {
            status: CommonStatusCode.BAD_REQUEST,
            message: CommonStatusMessage.BAD_REQUEST
        };
    }

    return new UpdatePostResponseDTO(
        await UpdatePostService(
            Number(postId),
            new UpdatePostRequestDTO(request.body)
        )
    );
};

export const DeletePostController = async (
    request: express.Request
): Promise<DeletePostResponseDTO> => {
    const postId = request.params["postId"];

    if (!postId) {
        throw {
            status: CommonStatusCode.BAD_REQUEST,
            message: CommonStatusMessage.BAD_REQUEST
        };
    }

    return new DeletePostResponseDTO(await DeletePostService(Number(postId)));
};
