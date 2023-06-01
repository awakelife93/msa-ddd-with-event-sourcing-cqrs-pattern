## Query Server

### Description

`Only read requests are allowed unconditionally.`

```typescript
export type RouteItem = {
    method: "get";
    path: string;
    action: Function;
};
```

**Soft Delete**\
When the Command server performs soft delete processing on the record, the Query server processes it in advance.

```typescript
PostSchema.pre("find", function () {
    this.where({ deleted: false });
});

PostSchema.pre("findOne", function () {
    this.where({ deleted: false });
});
```

**QueryEntityHandler**\
It is in charge of synchronizing to MongoDB according to the domain, entity, and CUD type delivered to the subscription section in Event Bus.

```typescript
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
```
