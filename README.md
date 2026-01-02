# Playwright API Testing Framework

A TypeScript-based API testing framework built with Playwright, featuring custom fixtures, schema validation, and comprehensive test utilities.

## Project Overview

This project provides a robust framework for API testing with features including:
- Custom request handler with fluent API
- JSON schema validation
- Custom expect matchers
- Faker.js integration for test data generation
- Fixture-based test organization
- Multiple test projects (smoke, negative, example tests)
- Authentication token management

## Prerequisites

- Node.js (v22 or higher)
- npm or yarn
- Docker (for running the backend API locally)

## Project Structure

```
.
├── helpers/              # Helper utilities
│   └── createToken.ts   # Authentication token creation
├── requestObjects/       # Request payload templates
│   └── POST-article.json
├── responseSchemas/      # JSON schemas for response validation
│   ├── articles/
│   └── tags/
├── tests/               # Test files
│   ├── example.spec.ts
│   ├── negative.spec.ts
│   └── smoke.spec.ts
├── utils/               # Core utilities
│   ├── customExpect.ts      # Custom assertion methods
│   ├── dataGenerator.ts     # Test data generation
│   ├── fixtures.ts          # Playwright fixtures
│   ├── logger.ts            # API request/response logger
│   ├── requestHandler.ts    # HTTP request wrapper
│   └── schemaValidator.ts   # JSON schema validation
├── .env                 # Environment variables
├── api-test.config.ts   # API configuration
└── playwright.config.ts # Playwright configuration
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd PlaywrightAPI_udemy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create or update the `.env` file in the project root with your credentials:

```env
EMAIL=your-email
PASSWORD=your-password
```

### 4. Start the Backend API

The tests are configured to run against `http://localhost:8000/api`. Ensure your backend API is running on this port before executing tests.

If using Docker:
```bash
# Example Docker command (adjust based on your setup)
docker run -p 8000:8000 <your-api-image>
```

### 5. Verify Configuration

The base URL is configured in `api-test.config.ts`:
```typescript
apiUrl: "http://localhost:8000/api"
```

## Running Tests

### Run All Tests

```bash
npx playwright test
```

### Run Specific Test Projects

```bash
# Run smoke tests
npx playwright test --project=smokeTests

# Run negative tests
npx playwright test --project=negativeTests

# Run example tests
npx playwright test --project=apiTesting
```

### Run Specific Test File

```bash
npx playwright test tests/smoke.spec.ts
```

### Run Tests in Debug Mode

```bash
npx playwright test --debug
```

### Run Tests with UI Mode

```bash
npx playwright test --ui
```

## Test Reports

After test execution, view the HTML report:

```bash
npx playwright show-report
```

The report is automatically generated in the `playwright-report/` directory.

## Key Features

### Custom Request Handler

The framework provides a fluent API for making HTTP requests:

```typescript
const response = await api
    .path("/articles")
    .params({ limit: "10", offset: 0 })
    .getRequest(200);
```

### Schema Validation

Automatic JSON schema validation for API responses:

```typescript
await expect(response).shouldMatchSchema('articles', 'GET_articles');
```

### Custom Expect Matchers

Extended assertion methods:

```typescript
expect(response.articles.length).shouldBeLessThanOrEqual(10);
expect(response.tags[0]).shouldEqual("django");
```

### Authentication

Automatic token management through fixtures:

```typescript
// Token is automatically created and injected
test("Create Article", async ({api}) => {
    const response = await api
        .path("/articles")
        .body(articlePayload)
        .postRequest(201);
});
```

### Test Data Generation

Dynamic test data using Faker.js:

```typescript
import { getNewRandomArticle } from "../utils/dataGenerator";

const articlePayload = getNewRandomArticle();
```

## Test Projects Configuration

The framework includes three test projects:

1. **smokeTests**: Basic smoke tests for critical functionality
2. **negativeTests**: Tests for error handling and edge cases
3. **apiTesting**: Comprehensive API tests (depends on smokeTests)

## Configuration Options

### Playwright Configuration

- **Test Directory**: `./tests`
- **Parallel Execution**: Disabled (`fullyParallel: false`)
- **Retries**: 2 on CI, 0 locally
- **Workers**: 1 on CI, default locally
- **Reporters**: HTML and list
- **Trace**: Retained on failure

### API Configuration

Edit `api-test.config.ts` to modify:
- Base URL
- User credentials
- Environment-specific settings

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `EMAIL` | User email for authentication | - |
| `PASSWORD` | User password for authentication | - |
| `TEST_ENV` | Test environment (dev/qa) | dev |

## Troubleshooting

### Tests Fail to Connect

- Verify the backend API is running on `http://localhost:8000`
- Check network connectivity
- Ensure `.env` file contains valid credentials

### Schema Validation Errors

- Ensure response schemas in `responseSchemas/` match the API responses
- Check schema file paths and naming conventions

### Authentication Issues

- Verify credentials in `.env` file
- Check if the `/users/login` endpoint is accessible
- Ensure the backend API is configured correctly

## Contributing

When adding new tests:
1. Place test files in the `tests/` directory
2. Use the custom fixtures from `utils/fixtures.ts`
3. Add response schemas to `responseSchemas/` as needed
4. Follow the existing naming conventions

## License

ISC
