import express from "express";

export const generateGetMethodParam = (
    request: express.Request
): Record<string, unknown> => {
    return {
        ...request.query,
        ...request.params
    };
};
