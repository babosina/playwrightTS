// Class to collect the data from the request

import {APIRequestContext} from "@playwright/test";
import {APILogger} from "./logger";
import {test} from "@playwright/test";

export class RequestHandler {

    private baseUrl: string | undefined
    private apiPath: string = ""
    private queryParams: object = {}
    private apiHeaders: Record<string, string> = {}
    private apiBody: object = {}
    private defaultBaseUrl: string;
    private request: APIRequestContext;
    private logger: APILogger;
    private defaultAuthToken: string = '';
    private clearAuthFlag: boolean;

    constructor(request: APIRequestContext,
                apiBaseUrl: string,
                logger: APILogger,
                authToken: string = '') {
        this.request = request;
        this.defaultBaseUrl = apiBaseUrl;
        this.logger = logger;
        this.defaultAuthToken = authToken;
    }

    // URL setter
    url(url: string) {
        this.baseUrl = url;
        return this;
    }

    // Endpoint setter
    path(path: string) {
        this.apiPath = path;
        return this;
    }

    // Query params setter
    params(params: object) {
        this.queryParams = params;
        return this;
    }

    // Headers setter
    headers(headers: Record<string, string>) {
        this.apiHeaders = headers;
        return this;
    }

    // Query body setter
    body(body: object) {
        this.apiBody = body;
        return this;
    }

    clearAuth() {
        this.clearAuthFlag = true;
        return this;
    }

    private getHeaders() {
        if (!this.clearAuthFlag) {
            this.apiHeaders['Authorization'] = this.apiHeaders['Authorization'] || `Token ${this.defaultAuthToken}`;
        }
        return this.apiHeaders;
    }

    // Get the complete URL with a base and an endpoint
    private getUrl() {
        const url = new URL(`${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`);
        for (let [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, value);
        }
        return url.toString();
    }

    async getRequest(statusCode: number) {
        let responseJson: any;
        const url = this.getUrl();
        await test.step(`GET request to ${url}`, async () => {
            this.logger.logRequest("GET", url, this.getHeaders());
            const response = await this.request.get(url, {
                headers: this.getHeaders()
            });
            responseJson = await response.json();
            const actualStatusCode = response.status();

            this.logger.logResponse(actualStatusCode, responseJson);
            this.statusCodeValidator(actualStatusCode, statusCode, this.getRequest);
            this.cleanUpFields();
        });
        return responseJson;
    }

    async postRequest(statusCode: number) {
        let responseJson: any;
        const url: string = this.getUrl();
        await test.step(`POST request to ${url}`, async () => {
            this.logger.logRequest("POST", url, this.getHeaders(), this.apiBody);
            const response = await this.request.post(url, {
                headers: this.getHeaders(),
                data: this.apiBody
            });
            const actualStatusCode = response.status();
            responseJson = await response.json();
            this.logger.logResponse(actualStatusCode, responseJson);
            this.statusCodeValidator(actualStatusCode, statusCode, this.postRequest);
            this.cleanUpFields();
        });
        return responseJson;
    }

    async putRequest(statusCode: number) {
        let responseJson: any;
        const url: string = this.getUrl();
        await test.step(`PUT request to ${url}`, async () => {
            this.logger.logRequest("PUT", url, this.getHeaders(), this.apiBody);
            const response = await this.request.put(url, {
                headers: this.getHeaders(),
                data: this.apiBody
            });
            const actualStatusCode = response.status();
            responseJson = await response.json();
            this.logger.logResponse(actualStatusCode, responseJson);
            this.statusCodeValidator(actualStatusCode, statusCode, this.putRequest);
            this.cleanUpFields();
        })
        return responseJson;
    }

    async deleteRequest(statusCode: number) {
        const url: string = this.getUrl();
        await test.step(`DELETE request to ${url}`, async () => {
            this.logger.logRequest("DELETE", url, this.getHeaders());
            const response = await this.request.delete(url,
                {
                    headers: this.getHeaders(),
                });
            const actualStatusCode = response.status();
            this.logger.logResponse(actualStatusCode);
            this.statusCodeValidator(actualStatusCode, statusCode, this.deleteRequest);
            this.cleanUpFields();
        });
    }

    private statusCodeValidator(actualStatusCode: number, expectedStatusCode: number, callingMethod: Function) {
        if (actualStatusCode !== expectedStatusCode) {
            const logs = this.logger.getRecentLogs();
            const error = new Error(`Expected status code ${expectedStatusCode}, but got ${actualStatusCode}.\n\n
            Recent API activity: \n\n${logs}`);
            Error.captureStackTrace(error, callingMethod)
            throw error;
        }
    }

    private cleanUpFields() {
        this.queryParams = {};
        this.apiHeaders = {};
        this.apiBody = {};
        this.baseUrl = undefined;
        this.apiPath = "";
        this.clearAuthFlag = false;
    }
}