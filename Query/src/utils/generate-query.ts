import { FilterQuery } from "mongoose";

export const generateFilterQuery = <T>(
    object: Record<string, unknown>
): FilterQuery<T>[] | Object[] => {
    const paramsMap = Object.entries(object)
        .map(
            ([key, value]: [key: string, value: unknown | undefined]):
                | Record<string, unknown>
                | undefined => {
                if (value) return { [key]: value };
                return undefined;
            }
        )
        .filter((element) => element);

    if (paramsMap.length > 0) {
        return paramsMap as FilterQuery<T>[];
    }

    return [{}];
};
