import Domain from "../../../../Domain";
import { printWorkJob } from "../../../../EventBus/helpers";
import { ErrorStatusMessage } from "../../../../common/status";
import { CudAction, EventHandleParams } from "../../../../common/type";
import PostModel from "../../../mongoose/models/post";

type SelectCollectionModel = typeof PostModel;

const selectCollection = (
    domainName: string
): SelectCollectionModel | undefined => {
    return {
        [Domain.POST]: PostModel
    }[domainName];
};

const selectCudAction = (cudAction: CudAction) => {
    const cudActions = {
        CREATE: async (Collection: SelectCollectionModel, entity: unknown) => {
            const document = new Collection(entity);
            await document.save();
        },
        UPDATE: async (Collection: SelectCollectionModel, entity: any) => {
            await Collection.updateOne({ id: entity.id }, { ...entity });
        },
        DELETE: async (Collection: SelectCollectionModel, entity: any) => {
            await Collection.updateOne({ id: entity.id }, { deleted: true });
        }
    };

    return cudActions[cudAction];
};

const QueryEntityHandler = async ({
    domainName,
    cudAction,
    entity
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
