import { CommonStatusCode, CommonStatusMessage } from "./status";

export type HandlerParams = {
    status: number;
    message: string;
    data?: unknown;
};

const generateErrorItem = (
    error: unknown,
    item: HandlerParams
): HandlerParams => {
    if (typeof error === "string") {
        item.message = error;
    } else if (error instanceof Error) {
        item.message = error.message;
    } else {
        const _error = error as HandlerParams;

        item.status = _error.status ?? CommonStatusCode.INTERNAL_SERVER_ERROR;
        item.message =
            _error.message ?? CommonStatusMessage.INTERNAL_SERVER_ERROR;
        item.data = _error.data;
    }

    return item;
};

export const getErrorItem = (error: unknown): HandlerParams => {
    const item = {
        status: CommonStatusCode.INTERNAL_SERVER_ERROR
    } as HandlerParams;

    return generateErrorItem(error, item);
};
