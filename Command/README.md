## Command Server

### Description

`Only access to CUD is available unconditionally.`

```typescript
export type RouteItem = {
    method: "post" | "delete" | "put" | "patch";
    path: string;
    action: Function;
};
```

**BeginTransaction**\
Commit, rollback is determined by successful processing of data by API, so write as a common function

```typescript
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
    eventBusParams?: TransactionEventBusParams
): Promise<T> => {
    return await client.$transaction(async (tx): Promise<T> => {
        try {
            console.log("============== BeginTransaction Start ==============");
            const response = await businessLogic(tx);

            if (eventBusParams) {
                await EventBus.publisher({
                    domainName: eventBusParams.domainName,
                    cudAction: eventBusParams.cudAction,
                    entity: response
                });
            } else {
                console.warn(
                    "Warning! The transaction is not synchronized with the Query server."
                );
            }

            console.log(
                "============== BeginTransaction Commit =============="
            );
            return response;
        } catch (error: unknown) {
            console.error(
                `============== BeginTransaction ${businessLogic.toString()} is RollBack ==============`
            );
            throw getErrorItem(error);
        }
    });
};

// Example
export const CreatePostService = async (
    createPostRequestDto: CreatePostRequestDTO
): Promise<post> => {
    return await BeginTransaction<Promise<post>>(
        async (tx) => {
            const lastPost = await tx.post.findFirst({
                orderBy: {
                    post_id: "desc"
                }
            });

            return await tx.post.create({
                data: {
                    ...createPostRequestDto,
                    post_id: lastPost ? lastPost.post_id + 1 : 1,
                    version: 1
                }
            });
        },

        {
            domainName: Domain.POST,
            cudAction: CudActionEnum.CREATE
        }
    );
};
```

**connection**\
By default, Prisma automatically establishes a connection when called, but there is a function created during the compilation phase to proactively check if the connection has failed.

```typescript
export const connection = async (): Promise<void> => {
    await client.$connect();
};
```
