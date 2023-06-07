export type CudAction = "CREATE" | "UPDATE" | "DELETE";

export type EventHandleParams = {
    domainName: string;
    cudAction: CudAction;
    entity: any;
};
