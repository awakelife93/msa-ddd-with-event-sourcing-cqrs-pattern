## Event Queue

### Description

It is an event queue, and the structure is changed according to the method.

```
--------------------------------------------------------
|  EventQueue                                          |
|  ┣ domain                                            |
|  ┃ ┣ Post                                            |
|  ┃ ┃ ┗ queue                                         |
|  ┃ ┃ ┃ ┣ Post.ts - Managing queues per domain        |
|  ┃ ┃ ┃ ┗ config.ts - queue options                   |
|  ┃ ┗ index.ts                                        |
|  ┣ config.ts - default queue options                 |
|  ┗ index.ts                                          |
--------------------------------------------------------
```
