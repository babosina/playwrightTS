import {readFileSync, writeFileSync} from "fs";

function filterAndSaveConduitApiEntries(inputFilename, outputFilename) {
    try {
        const fileContent = readFileSync(inputFilename, 'utf-8');
        const harObject = JSON.parse(fileContent);

        harObject.log.entries = harObject.log.entries
            .filter(entry => {
                const url = entry.request.url;
                return url.includes('conduit-api') && !url.toLowerCase().endsWith('.jpeg');
            })
            .map(entry => {
                // Cleanup request object
                if (entry.request) {
                    entry.request.heeader = [];
                    delete entry.request.cookies;
                    delete entry.request.httpVersion;
                    delete entry.request.headersSize;
                    delete entry.request.bodySize;
                }

                // Cleanup response object
                if (entry.response) {
                    entry.request.headers = [];
                    delete entry.response.cookies;
                    delete entry.response.httpVersion;
                    delete entry.response.statusText;
                    delete entry.response.headersSize;
                    delete entry.response.bodySize;
                    delete entry.response.redirectURL;
                }

                // Remove top-level properties
                delete entry.cache;
                delete entry.timings;

                return entry;
            });

        const jsonString = JSON.stringify(harObject, null, 2);
        writeFileSync(outputFilename, jsonString, 'utf-8');

        console.log(`HAR file saved to ${outputFilename}`);
    } catch (e) {
        console.log("Error processing the file");
        throw e;
    }
}

filterAndSaveConduitApiEntries('networking.har', 'filtered-har.json');