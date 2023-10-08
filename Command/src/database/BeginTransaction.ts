import { Prisma, PrismaClient } from "@prisma/client";
import client from ".";
import EventBus from "../../../EventBus";
import { CudActionEnum } from "../../../common/enum";
import { getErrorItem } from "../../../common/error";

type TX = Omit<
  PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
>;

export type TransactionEventBusParams = {
  domainName: string;
  cudAction: CudActionEnum;
};

const BeginTransaction = async <T>(
  businessLogic: (tx: TX) => T,
  eventBusParams?: TransactionEventBusParams,
): Promise<T> => {
  return await client.$transaction(async (tx): Promise<T> => {
    try {
      console.log("============== BeginTransaction Start ==============");
      const response = await businessLogic(tx);

      if (eventBusParams) {
        await EventBus.publisher({
          domainName: eventBusParams.domainName,
          cudAction: eventBusParams.cudAction,
          entity: response,
        });
      } else {
        console.warn(
          "Warning! The transaction is not synchronized with the Query server.",
        );
      }

      console.log("============== BeginTransaction Commit ==============");
      return response;
    } catch (error: unknown) {
      console.error(
        `============== BeginTransaction ${businessLogic.toString()} is RollBack ==============`,
      );
      throw getErrorItem(error);
    }
  });
};

export default BeginTransaction;
