import { getDomain } from "../../../../Domain";
import { printWorkJob } from "../../../../EventBus/helpers";
import { ErrorStatusMessage } from "../../../../common/status";
import { CUDAction, EventHandleParams } from "../../../../common/type";
import PostModel from "../../../mongoose/models/post";
import { excludeFieldsHelper } from "../../utils/generate-query";

type SelectCollectionModel = typeof PostModel;

const selectCollection = (
  domainName: string,
): SelectCollectionModel | undefined => {
  return {
    [getDomain("POST")]: PostModel,
  }[domainName];
};

const selectCudAction = (cudAction: CUDAction) => {
  const cudActions = {
    CREATE: async (Collection: SelectCollectionModel, entity: any) => {
      const document = new Collection({
        ...entity,
        updated_at: entity.created_at,
      });
      await document.save();
    },
    UPDATE: async (Collection: SelectCollectionModel, entity: any) => {
      await Collection.updateOne(
        { post_id: entity.post_id },
        {
          ...excludeFieldsHelper(entity, ["created_at"]),
          updated_at: new Date(),
        },
      );
    },
    DELETE: async (Collection: SelectCollectionModel, entity: any) => {
      await Collection.updateOne(
        { post_id: entity.post_id },
        {
          ...excludeFieldsHelper(entity, ["created_at"]),
          updated_at: new Date(),
        },
      );
    },
  };

  return cudActions[cudAction];
};

const QueryEntityHandler = async ({
  domainName,
  cudAction,
  entity,
}: EventHandleParams): Promise<void> => {
  const collection = selectCollection(domainName);

  if (!collection) throw new Error(ErrorStatusMessage.IS_EMPTY_COLLECTION);

  console.log("============== QueryEntityHandler Work Start ==============");
  const action = selectCudAction(cudAction);
  await action(collection, entity);

  printWorkJob({ domainName, cudAction, entity });
  console.log("============== QueryEntityHandler Work End ==============");
};

export default QueryEntityHandler;
