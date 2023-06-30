import { getErrorItem } from "../../../common/error";
import {
    CommonStatusCode,
    CommonStatusMessage,
    ErrorStatusMessage
} from "../../../common/status";

export const validateDTO = <T>(
    dto: T,
    errorItem?: {
        status?: number;
        message?: string;
    },
    validateOptions?: {
        skipFields: string[];
    }
): T => {
    try {
        const dtoToObject = JSON.parse(JSON.stringify(dto));
        const dtoFieldKeys = Object.keys(dtoToObject);

        dtoFieldKeys
            .filter((key: string) => !validateOptions?.skipFields.includes(key))
            .forEach((dtoFieldKey: string) => {
                const dtoFieldValue = dtoToObject[dtoFieldKey];

                if (!dtoFieldValue) {
                    const status =
                        errorItem?.status ?? CommonStatusCode.BAD_REQUEST;
                    const message =
                        errorItem?.message ?? CommonStatusMessage.BAD_REQUEST;

                    throw {
                        status,
                        message
                    };
                }
            });

        return dto;
    } catch (error: unknown) {
        const _error = getErrorItem(error);
        throw {
            status: CommonStatusCode.INTERNAL_SERVER_ERROR,
            message: `${ErrorStatusMessage.VALIDATE_DTO_ERROR}: ${_error.message}`
        };
    }
};
