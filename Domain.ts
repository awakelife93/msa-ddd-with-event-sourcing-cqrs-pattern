import { ErrorStatusMessage } from "./common/status";

type DomainNames = "POST";

const DomainMap = {
    [Symbol.for("POST")]: "Post"
};

export const getDomain = (name: DomainNames): string => {
    const domain = DomainMap[Symbol.for(name)];
    if (!domain) {
        throw new Error(ErrorStatusMessage.IS_NULL_DOMAIN);
    }

    return domain;
};
