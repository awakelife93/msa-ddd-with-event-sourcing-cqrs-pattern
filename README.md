# Welcome :wave:

## msa-ddd-with-event-sourcing-cqrs-pattern

### Example Microservice + DDD + Event Sourcing + CQRS pattern :smiley:

This project is based on the MSA + DDD architecture + Event Sourcing + CQRS pattern.\
`The RDBMS used in the example is MySQL, and NoSQL is MongoDB. And Redis is used as the message queue (MQ). Depending on the situation, you can choose various RDBMS and attach a search-optimized DB (e.g., ELK, Neo4j...) to the query server.`

### Getting Started

-   npm install
-   npm start

### Environment

```
----------------------------------------------
| RDBMS                 | Prisma + Mysql     |
| Nosql                 | Mongoose + Mongodb |
| EventBus / EventQueue | Redis + Bulljs     |
| API Server Framework  | Express            |
----------------------------------------------
```

### `Architecture`

![Architecture](https://github.com/awakelife93/msa-ddd-with-cqrs-pattern/assets/20429356/95f86e2d-3c1c-44a0-a25b-bc0e161c6a4c)

### Description

**Although they are not physically separated, command and query servers are considered separate**

`This project used Mysql, Mongoose, and Redis, so please check the server environments.`

1. **In the Event Sourcing pattern, all changes to an object are stored in the Command Server, and only the final data is stored in the Query Server.**
2. `Open Command (CUD) Server, Query (R) Server`\
   1-1. Server separation based on request objectives by micro-service architecture\
   1-2. Command Server only accepts requests for Create, Update, and Delete.\
   1-3. Query Server only accepts Read requests.
3. `If the operation of data at the service layer of the command server is finished, EventBus adds the entity to the Event Queue operation.`\
   2-1. If data manipulation fails or fails during the event bus process, the working entity on the command server is rolled back.\
   2-2. If the event operation fails, retry 3 times.\
   2-3. If the operation fails three times, it will remain in the queue as a failed operation, and if the cause is unknown or unresolved in the runtime environment, the data synchronization between the command server and the query server will not match.
4. `The event bus is in charge of collectively reflecting the loaded tasks of the event queue to the Mongodb of the Query server.`
5. `The event bus detects its own state and processes logic accordingly.`
6. `This mechanism enables thorough role separation by separating the database of the command server and the query server.`

### Project Guide

-   [Command](Command/README.md)
    -   Command (CUD) Server
-   [Query](Query/README.md)
    -   Query (R) Server
-   [EventBus](EventBus/README.md)
    -   Handles the Command -> EventQueue -> Query structure.
-   [EventQueue](EventQueue/README.md)
    -   Event queue configured based on MSA + DDD
-   [config](.env.example) / [.env](.env.example)
    -   Manage Database, Event Queue connection information.
-   [Domain](Domain.ts)
    -   This Project Application Common Domain Object

### `Process & Outputs`

1. **CREATE**

```typescript
// Sample Request Endpoint & Parameter
// POST http://localhost:3000/post
{
    "title": "Demo Post",
    "content": "hi~",
    "author_name": "awakelife93"
}

// Log Trace
============== BeginTransaction Start ==============
============== EventBus Publisher Work Start ==============
DOMAIN NAME: Post
ENTITY: {"id":77,"post_id":3,"version":1,"title":"Demo Post","content":"hi~","author_name":"awakelife93","created_at":"2023-06-07T02:57:47.312Z","deleted":false}
CUD_ACTION: CREATE
============== EventBus Publisher Work End ==============
============== BeginTransaction Commit ==============
============== EventBus SubScriber Work Start ==============
DOMAIN NAME: Post
ENTITY: {"id":77,"post_id":3,"version":1,"title":"Demo Post","content":"hi~","author_name":"awakelife93","created_at":"2023-06-07T02:57:47.312Z","deleted":false}
CUD_ACTION: CREATE
============== QueryEntityHandler Work Start ==============
DOMAIN NAME: Post
ENTITY: {"id":77,"post_id":3,"version":1,"title":"Demo Post","content":"hi~","author_name":"awakelife93","created_at":"2023-06-07T02:57:47.312Z","deleted":false}
CUD_ACTION: CREATE
============== QueryEntityHandler Work End ==============
============== EventBus SubScriber Work End ==============
========= Completed Job ID: 77 =========

// RDBMS Output
----------------------------------------------------------------------------------------------------------------
| id |   title     | content |          created_at        |  deleted  |  author_name  | post_id |    version   |
----------------------------------------------------------------------------------------------------------------
| 77 |  Demo Post  |   hi~   |  2023-06-07 02:57:47.312   |     0     |  awakelife93  |    3    |       1      |
----------------------------------------------------------------------------------------------------------------
// NoSQL Output
{
  "_id": {
    "$oid": "647ff22bfd8de16a991d886f"
  },
  "post_id": "3",
  "created_at": {
    "$date": "2023-06-07T02:57:47.312Z"
  },
  "updated_at": {
    "$date": "2023-06-07T02:57:47.312Z"
  },
  "title": "Demo Post",
  "content": "hi~",
  "author_name": "awakelife93",
  "deleted": false,
  "__v": 0
}
```

---

2. **UPDATE**

```typescript
// Sample Request Endpoint & Parameter
// PATCH http://localhost:3000/post/3
{
    "title": "Update Demo Post",
    "content": "HI~",
    "author_name": "awakelife93"
}

// Log Trace
============== BeginTransaction Start ==============
============== EventBus Publisher Work Start ==============
DOMAIN NAME: Post
ENTITY: {"id":79,"post_id":3,"version":2,"title":"Update Demo Post","content":"HI~","author_name":"awakelife93","created_at":"2023-06-07T03:03:23.988Z","deleted":false}
CUD_ACTION: UPDATE
============== EventBus Publisher Work End ==============
============== BeginTransaction Commit ==============
============== EventBus SubScriber Work Start ==============
DOMAIN NAME: Post
ENTITY: {"id":79,"post_id":3,"version":2,"title":"Update Demo Post","content":"HI~","author_name":"awakelife93","created_at":"2023-06-07T03:03:23.988Z","deleted":false}
CUD_ACTION: UPDATE
============== QueryEntityHandler Work Start ==============
DOMAIN NAME: Post
ENTITY: {"id":79,"post_id":3,"version":2,"title":"Update Demo Post","content":"HI~","author_name":"awakelife93","created_at":"2023-06-07T03:03:23.988Z","deleted":false}
CUD_ACTION: UPDATE
============== QueryEntityHandler Work End ==============
============== EventBus SubScriber Work End ==============
========= Completed Job ID: 26 =========

// RDBMS Output
--------------------------------------------------------------------------------------------------------------------
| id |        title       | content |          created_at        |  deleted  |  author_name  | post_id |  version  |
--------------------------------------------------------------------------------------------------------------------
| 77 |      Demo Post     |   hi~   |  2023-06-07 02:57:47.312   |     0     |  awakelife93  |    3    |     1     |
--------------------------------------------------------------------------------------------------------------------
| 78 |  Update Demo Post  |   HI~   |  2023-06-07 03:03:23.988   |     0     |  awakelife93  |    3    |     2     |
--------------------------------------------------------------------------------------------------------------------

// NoSQL Output
{
  "_id": {
    "$oid": "647ff22bfd8de16a991d886f"
  },
  "post_id": "3",
  "created_at": {
    "$date": "2023-06-07T02:57:47.312Z"
  },
  "updated_at": {
    "$date": "2023-06-07T03:03:24.007Z"
  },
  "title": "Update Demo Post",
  "content": "HI~",
  "author_name": "awakelife93",
  "deleted": false,
  "__v": 0
}
```

---

3. **DELETE**

```typescript
// Sample Request Endpoint & Parameter
// DELETE http://localhost:3000/post/3

// Log Trace
============== BeginTransaction Start ==============
============== EventBus Publisher Work Start ==============
DOMAIN NAME: Post
ENTITY: {"id":80,"post_id":3,"version":3,"title":"Update Demo Post","content":"HI~","author_name":"awakelife93","created_at":"2023-06-07T03:08:07.161Z","deleted":true}
CUD_ACTION: DELETE
============== EventBus Publisher Work End ==============
============== BeginTransaction Commit ==============
============== EventBus SubScriber Work Start ==============
DOMAIN NAME: Post
ENTITY: {"id":80,"post_id":3,"version":3,"title":"Update Demo Post","content":"HI~","author_name":"awakelife93","created_at":"2023-06-07T03:08:07.161Z","deleted":true}
CUD_ACTION: DELETE
============== QueryEntityHandler Work Start ==============
DOMAIN NAME: Post
ENTITY: {"id":80,"post_id":3,"version":3,"title":"Update Demo Post","content":"HI~","author_name":"awakelife93","created_at":"2023-06-07T03:08:07.161Z","deleted":true}
CUD_ACTION: DELETE
============== QueryEntityHandler Work End ==============
============== EventBus SubScriber Work End ==============
========= Completed Job ID: 9 =========

// RDBMS Output
--------------------------------------------------------------------------------------------------------------------
| id |        title       | content |          created_at        |  deleted  |  author_name  | post_id |  version  |
--------------------------------------------------------------------------------------------------------------------
| 77 |      Demo Post     |   hi~   |  2023-06-07 02:57:47.312   |     0     |  awakelife93  |    3    |     1     |
--------------------------------------------------------------------------------------------------------------------
| 78 |  Update Demo Post  |   HI~   |  2023-06-07 03:03:23.988   |     0     |  awakelife93  |    3    |     2     |
--------------------------------------------------------------------------------------------------------------------
| 79 |  Update Demo Post  |   HI~   |  2023-06-07 03:08:07.161   |     1     |  awakelife93  |    3    |     3     |
--------------------------------------------------------------------------------------------------------------------

// NoSQL Output
{
  "_id": {
    "$oid": "647ff22bfd8de16a991d886f"
  },
  "post_id": "3",
  "created_at": {
    "$date": "2023-06-07T02:57:47.312Z"
  },
  "updated_at": {
    "$date": "2023-06-07T03:08:07.178Z"
  },
  "title": "Update Demo Post",
  "content": "HI~",
  "author_name": "awakelife93",
  "deleted": true,
  "__v": 0
}
```

---

4. **READ**

```typescript
// Sample Request Endpoint & Parameter
// GET http://localhost:4000/post/3
{
    "data": {
        "_id": "647ff22bfd8de16a991d886f",
        "post_id": 3,
        "title": "Update Demo Post",
        "content": "HI~",
        "author_name": "awakelife93",
        "created_at": "2023-06-07T02:57:47.312Z",
        "updated_at": "2023-06-07T03:08:07.178Z",
        "deleted": false
    }
}
```

### Example Domain

```typescript
// Application Common Domain
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

// Prisma
model post {
  id          Int      @id @default(autoincrement())
  post_id     Int
  version     Int
  title       String
  content     String
  author_name String
  created_at  DateTime @default(now())
  deleted     Boolean  @default(false)
}

// Mongoose
const PostSchema = new mongoose.Schema<IPost>({
    post_id: {
        type: Number,
        required: true,
        unique: true
    },
    created_at: {
        type: Date,
        required: true
    },
    updated_at: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author_name: {
        type: String,
        required: true
    },
    deleted: {
        type: Boolean,
        required: true
    }
});
```

### Example Event Queue

```typescript
type SingleEventQueueOption = Bull.QueueOptions;
type MultiEventQueueOption = {
    CREATE: SingleEventQueueOption;
    UPDATE: SingleEventQueueOption;
    DELETE: SingleEventQueueOption;
};

/**
 * @description
 * singleEventQueueOption = When using a single Redis
 * multiEventQueueOption = If you are isolating Redis for each C, U, D operation
 */
const queueOptions: {
    singleEventQueueOption: SingleEventQueueOption;
    multiEventQueueOption: MultiEventQueueOption;
} = {
    singleEventQueueOption: {
        redis: {
            ...defaultRedisOptions,
            port: Number(config.POST_DOMAIN_QUEUE_PORT),
            host: config.POST_DOMAIN_QUEUE_HOST
        },
        defaultJobOptions: {
            ...defaultJobOptions
        }
    },
    multiEventQueueOption: {
        CREATE: {
            redis: {
                ...defaultRedisOptions,
                port: Number(config.POST_DOMAIN_QUEUE_PORT),
                host: config.POST_DOMAIN_QUEUE_HOST
            },
            defaultJobOptions: {
                ...defaultJobOptions
            }
        },
        UPDATE: {
            redis: {
                ...defaultRedisOptions,
                port: Number(config.POST_DOMAIN_QUEUE_PORT),
                host: config.POST_DOMAIN_QUEUE_HOST
            },
            defaultJobOptions: {
                ...defaultJobOptions
            }
        },
        DELETE: {
            redis: {
                ...defaultRedisOptions,
                port: Number(config.POST_DOMAIN_QUEUE_PORT),
                host: config.POST_DOMAIN_QUEUE_HOST
            },
            defaultJobOptions: {
                ...defaultJobOptions
            }
        }
    }
};

/**
 * @description
 * C, U, and D queues are placed in one Redis.
 */
const generateSingleQueue = () => {
    return {
        CREATE: new Bull(`${getDomain("POST")}_CREATE_EVENT_QUEUE`, {
            ...queueOptions.singleEventQueueOption
        }),
        UPDATE: new Bull(`${getDomain("POST")}_UPDATE_EVENT_QUEUE`, {
            ...queueOptions.singleEventQueueOption
        }),
        DELETE: new Bull(`${getDomain("POST")}_DELETE_EVENT_QUEUE`, {
            ...queueOptions.singleEventQueueOption
        })
    };
};

/**
 * @description
 * C, U, and D queues are placed on each Redis.
 */
const generateMultiQueue = () => {
    return {
        CREATE: new Bull(`${getDomain("POST")}_CREATE_EVENT_QUEUE`, {
            ...queueOptions.multiEventQueueOption.CREATE
        }),
        UPDATE: new Bull(`${getDomain("POST")}_UPDATE_EVENT_QUEUE`, {
            ...queueOptions.multiEventQueueOption.UPDATE
        }),
        DELETE: new Bull(`${getDomain("POST")}_DELETE_EVENT_QUEUE`, {
            ...queueOptions.multiEventQueueOption.DELETE
        })
    };
};

const PostEventQueues = config.IS_SINGLE_QUEUE
    ? generateSingleQueue()
    : generateMultiQueue();

export default PostEventQueues;
```

### Issue & Warning

1. Redis connection port issue

```typescript
/**
 * @description
 * The Redis client successfully performs connection processing if the connection port value is an open port, even if it is not an actual port on the Redis server.
 * Therefore, you have to check the port well because there is a phenomenon that the work cannot be performed and it keeps stuck.
 * The function basically checks whether the host and port are connectable, and if there is a problem, the port should be checked well.
 */
export const validateRedisConnection = async (): Promise<void> => {
    const redisClient: redis.RedisClientType = redis.createClient({
        url: `redis://${config.POST_DOMAIN_QUEUE_HOST}:${config.POST_DOMAIN_QUEUE_PORT}`
    });

    await redisClient.connect();

    const isReady = redisClient.isReady;
    const isOpen = redisClient.isOpen;

    console.log(`Redis Status: isReady=${isReady}, isOpen=${isOpen}`);
    await redisClient.disconnect();
};
```

##### Example

-   `try connect url "redis://localhost:27017"`
-   Output
    -   `Connect Redis redis://localhost:27017`
    -   `Redis Status: isReady=true, isOpen=true`
-   **No error occurs...**

### Author

Hyunwoo Park
