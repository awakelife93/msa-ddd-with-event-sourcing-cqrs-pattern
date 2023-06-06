import { CommonStatusCode, CommonStatusMessage } from "../../../common/status";

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
    const status = errorItem?.status ?? CommonStatusCode.BAD_REQUEST;
    const message = errorItem?.message ?? CommonStatusMessage.BAD_REQUEST;

    const dtoToObject = JSON.parse(JSON.stringify(dto));
    const dtoFieldKeys = Object.keys(dtoToObject);

    dtoFieldKeys
        .filter((key: string) => !validateOptions?.skipFields.includes(key))
        .forEach((dtoFieldKey: string) => {
            const dtoFieldValue = dtoToObject[dtoFieldKey];

            if (!dtoFieldValue) {
                throw {
                    status,
                    message
                };
            }
        });

    return dto;
};
