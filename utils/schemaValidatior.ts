// @ts-ignore
import fs from 'fs/promises';
// @ts-ignore
import path from 'path';
import Ajv from 'ajv';
import {createSchema} from "genson-js";

const SCHEMA_BASE_PATH = "./responseSchemas";
const ajv = new Ajv({allErrors: true});

async function loadSchema(schemaPath: string) {
    try {
        const schemaContent = await fs.readFile(schemaPath, 'utf-8');
        return JSON.parse(schemaContent);
    } catch (e) {
        throw new Error(`Failed to read schema file: ${schemaPath}.\n
        ${e.message}`);
    }
}

export async function validateSchema(directoryName: string,
                                     filename: string,
                                     responseBody: object,
                                     createSchemaFlag: boolean = false) {
    const schemaPath = path.join(SCHEMA_BASE_PATH, directoryName, `${filename}_schema.json`);

    if (createSchemaFlag) {
        await generateNewSchema(responseBody, schemaPath);
    }

    const schema = await loadSchema(schemaPath);

    const validate = ajv.compile(schema);
    const valid = validate(responseBody);
    if (!valid) {
        throw new Error(`Schema validation failed for ${filename}\n` +
            `${JSON.stringify(validate.errors, null, 2)}\n\n` +
            `Actual response body:\n ${JSON.stringify(responseBody, null, 2)}`);
    }
}

async function generateNewSchema(responseBody: object, schemaPath: string) {
    try {
        const generatedSchema = createSchema(responseBody);
        await fs.mkdir(path.dirname(schemaPath), {recursive: true});
        await fs.writeFile(schemaPath, JSON.stringify(generatedSchema, null, 2));
    } catch (e) {
        throw new Error(`Failed to create schema file\n${e.message}`);
    }
}

