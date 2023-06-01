import { post } from "@prisma/client";
import Domain from "../../../../../Domain";
import { CudActionEnum } from "../../../../../common/enum";
import BeginTransaction from "../../../database/BeginTransaction";
import CreatePostRequestDTO from "../dtos/CreatePostRequestDTO";
import UpdatePostRequestDTO from "../dtos/UpdatePostRequestDTO";

export const CreatePostService = async (
    createPostRequestDto: CreatePostRequestDTO
): Promise<post> => {
    return await BeginTransaction<Promise<post>>(
        async (tx) =>
            await tx.post.create({
                data: createPostRequestDto
            }),
        {
            domainName: Domain.POST,
            cudAction: CudActionEnum.CREATE
        }
    );
};

export const UpdatePostService = async (
    id: number,
    updatePostRequestDto: UpdatePostRequestDTO
): Promise<post> => {
    return await BeginTransaction<Promise<post>>(
        async (tx) =>
            await tx.post.update({
                where: {
                    id
                },
                data: {
                    ...updatePostRequestDto
                }
            }),
        {
            domainName: Domain.POST,
            cudAction: CudActionEnum.UPDATE
        }
    );
};

export const DeletePostService = async (id: number): Promise<post> => {
    return await BeginTransaction<Promise<post>>(
        async (tx) =>
            await tx.post.update({
                where: {
                    id
                },
                data: {
                    deleted: true
                }
            }),
        {
            domainName: Domain.POST,
            cudAction: CudActionEnum.DELETE
        }
    );
};
