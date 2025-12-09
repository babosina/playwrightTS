import {test as base} from "@playwright/test";
import {RequestHandler} from "./requestHandler";
import {APILogger} from "./logger";
import {setCustomExpectLogger} from "./customExpect";
import {config} from "../api-test.config";
import {createToken} from "../helpers/createToken";

export type TestOptions = {
    api: RequestHandler,
    config: typeof config
}

export type WorkerFixture = {
    authToken: string
}

export const test = base.extend<TestOptions, WorkerFixture>({

    config: async ({}, use) => {
        await use(config)
    },

    authToken: [async ({}, use) => {
        const authToken = await createToken(config.userEmail, config.userPassword);
        await use(authToken);
    }, {scope: 'worker'}],

    api: async ({request, authToken}, use) => {
        const logger = new APILogger();
        setCustomExpectLogger(logger);
        const requestHandler = new RequestHandler(request, config?.apiUrl, logger, authToken);
        await use(requestHandler);
    }
});