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

/**
 * @description
 * In the Event Sourcing pattern, any unnecessary entities held by the Command Server are excluded.
 */
export const excludeFieldsHelper = (entity: any, excludeFields: string[]) => {
    const _entity = { ...entity };

    excludeFields.forEach((excludeField) => {
        delete _entity[excludeField];
    });

    return _entity;
};
