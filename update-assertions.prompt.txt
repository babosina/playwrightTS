I want to add a schema validation to all API requests that have responses.

To make a schema validation use the method shouldMatchSchema(). 
This method should be used for all API requests that have a response. 
Delete request does not have a response, so schema validation is not needed for it.

shouldMatchSchema() method has 3 arguments:
first argument: folder name of the schema location. It should match the name of endpoint. 
Example: "/tags" is the endpoint, so the folder name should be "tags"

second argument: file name of schema. It should be in the following format "[REQUEST TYPE]_[endpoint]. 
Example: "GET_tags" where "GET" is the request type and "tags" is the endpoint 

third argument: is boolean and it's optional. When "true" is provided, the new schema file will 
be generated.

Add the schema validation assertions to every api request according to the instructions 
and set the third argument to "true" to all new assertions. Ignore API requests that already 
have schema validation assertions added.