import {RequestHandler} from "../utils/requestHandler";
import {config} from "../api-test.config";
import {APILogger} from "../utils/logger";
import {request} from "@playwright/test";

export async function createToken(email: string, password: string) {
    const context = await request.newContext();
    const logger = new APILogger();
    const api = new RequestHandler(context, config?.apiUrl, logger);

    try {
        const tokenResponse = await api
            .path("/users/login")
            .body({
                "user": {
                    "email": email,
                    "password": password
                }
            })
            .postRequest(200);
        return tokenResponse.user.token;
    } catch (e) {
        Error.captureStackTrace(e, createToken);
        throw e;
    } finally {
        await context.dispose();
    }
}