export type CUDAction = "CREATE" | "UPDATE" | "DELETE";

export type EventHandleParams = {
  domainName: string;
  cudAction: CUDAction;
  entity: any;
};
