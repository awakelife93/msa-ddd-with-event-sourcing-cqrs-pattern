import http from "http";

const createServer = (
    application: Express.Application,
    applicationName: string,
    port: number
) => {
    http.createServer(application).listen(port, () =>
        console.log(`${applicationName} Application Listen Post ${port}`)
    );
};

export default createServer;
