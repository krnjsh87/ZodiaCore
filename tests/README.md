# ZodiaCore Testing Framework

This directory contains the comprehensive testing framework for ZodiaCore, utilizing Vitest as the primary testing framework.

## Directory Structure

```
tests/
├── unit/                 # Unit tests for individual functions/modules
├── integration/          # Integration tests for service interactions
├── e2e/                  # End-to-end tests for complete workflows
├── fixtures/             # Test data and mock objects
├── utils/                # Test utilities and helpers
├── coverage/             # Test coverage reports (generated)
├── vitest.config.js      # Vitest configuration
├── setup.js              # Global test setup
└── README.md             # This file
```

## Test Categories

### Unit Tests (`tests/unit/`)
- Test individual functions, classes, and modules in isolation
- Focus on business logic and algorithms
- Use mocks/stubs for external dependencies
- Fast execution, high coverage target

### Integration Tests (`tests/integration/`)
- Test interactions between multiple components
- Verify API endpoints and database operations
- Test microservice communication
- Include contract testing between services

### End-to-End Tests (`tests/e2e/`)
- Test complete user workflows
- Simulate real user interactions
- Test frontend-backend integration
- Run against staging/production-like environments

### Fixtures (`tests/fixtures/`)
- Sample data for testing
- Mock objects and responses
- Test database seeds
- Reusable test data structures

### Utils (`tests/utils/`)
- Test helper functions
- Custom matchers and assertions
- Test data generators
- Common test utilities

## Running Tests

```bash
# Run all tests
npm test

# Run tests once (CI mode)
npm run test:run

# Run tests with UI
npm run test:ui

# Run specific test categories
npm test -- tests/unit
npm test -- tests/integration
npm test -- tests/e2e
```

## Coverage

Coverage reports are generated in `tests/coverage/` with the following thresholds:
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

## Configuration

The testing framework is configured via `vitest.config.js` with:
- Node.js environment
- Global test functions enabled
- Coverage collection with V8 provider
- Multiple reporters (text, JSON, HTML, LCOV)

## Best Practices

1. **Test Organization**: Group related tests in describe blocks
2. **Naming**: Use descriptive test names that explain the behavior
3. **Isolation**: Each test should be independent and not rely on others
4. **Mocking**: Use appropriate mocks for external dependencies
5. **Assertions**: Use clear, descriptive assertion messages
6. **Coverage**: Aim for comprehensive coverage of happy paths and edge cases
7. **Performance**: Keep unit tests fast, integration tests reasonable

## Test Data Management

- Use fixtures for consistent test data
- Avoid hardcoding test data in test files
- Create factories for generating test data
- Clean up test data after each test

## CI/CD Integration

Tests are integrated into the CI/CD pipeline with:
- Automatic test execution on commits
- Coverage reporting and thresholds
- Test result archiving
- Failure notifications

## Contributing

When adding new tests:
1. Follow the directory structure
2. Add appropriate comments and documentation
3. Ensure tests pass locally before committing
4. Update this README if adding new patterns or utilities