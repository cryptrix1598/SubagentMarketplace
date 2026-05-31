# Contributing to Claude Agent Hub

Thank you for your interest in contributing! This document provides guidelines and instructions.

## Code of Conduct

By participating, you agree to our [Code of Conduct](./CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Issues

1. Check if the issue already exists
2. Use the appropriate issue template
3. Include reproduction steps, expected behavior, and environment details

### Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`pnpm test`)
6. Ensure linting passes (`pnpm lint`)
7. Ensure types are correct (`pnpm typecheck`)
8. Commit with conventional commits
9. Push and create a Pull Request

### Development Setup

```bash
pnpm install
cp .env.example .env
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm dev
```

### Code Style

- TypeScript strict mode
- Prettier for formatting
- ESLint for linting
- Conventional commits

### Pull Request Process

1. Update documentation for new features
2. Add tests for new functionality
3. Ensure CI passes
4. Request review from maintainers
5. Address review feedback

## Development Guidelines

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Build or tooling changes

### Branch Naming

- `feature/description` for features
- `fix/description` for bug fixes
- `docs/description` for documentation
- `refactor/description` for refactoring

### Code Review Criteria

- Correctness: Does it work as intended?
- Testing: Are there adequate tests?
- Performance: Are there any regressions?
- Security: Are there any vulnerabilities?
- Style: Does it follow our conventions?
- Documentation: Is it documented?