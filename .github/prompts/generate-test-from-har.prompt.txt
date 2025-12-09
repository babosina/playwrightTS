# Custom Prompt: Generate API Test from HAR File

Process the provided HAR file and create a single comprehensive API test.
Apply the [har-processing.instructions.md](../instructions/har-processing.instructions.md) to the context

## Task
1. **Convert** each request to framework format with schema validation
2. **Identify** response values needed for subsequent requests  
3. **Create** one test covering the complete API flow sequence

## Output
- Single test file with descriptive name
- All requests converted to framework patterns
- Schema validation for every response
- Proper variable extraction and reuse