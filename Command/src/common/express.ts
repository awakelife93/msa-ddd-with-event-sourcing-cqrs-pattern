import express from "express";
import helmet from "helmet";
import path from "path";
import { getErrorItem } from "../../../common/error";

export type RouteItem = {
    method: "post" | "delete" | "put" | "patch";
    path: string;
    action: Function;
};

export const createExpressApplication = (): express.Application => {
    const application = express();

    application.use(helmet());
    application.use(express.json());
    application.use(express.urlencoded({ extended: true }));
    application.use(express.static(path.join(__dirname, "public")));

    return application;
};

export const createRoute = (
    application: express.Application,
    routes: RouteItem[]
) => {
    routes.forEach((route: RouteItem) => {
        application[route.method](
            route.path,
            async (request: express.Request, response: express.Response) => {
                try {
                    const result = await route.action(request);
                    response.status(200);
                    response.send({
                        data: result
                    });
                } catch (error: unknown) {
                    const _error = getErrorItem(error);
                    console.log(
                        `Command Server Error Endpoint: /${request.method.toUpperCase()}${
                            request.path
                        } Error Message: ${_error.message}`
                    );
                    response.status(_error.status);
                    response.send({
                        status: _error.status,
                        message: _error.message
                    });
                }
            }
        );
    });
};
