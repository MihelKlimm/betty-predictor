# Contributing to Betty

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Follow the development setup in [SETUP.md](SETUP.md)

## Development Workflow

### Making Changes

1. Create a new branch for your feature or fix
2. Make your changes
3. Write tests for new functionality
4. Ensure tests pass: 
   - Backend: `pytest backend/`
   - Frontend: `npm test`
5. Commit with clear messages
6. Push to your fork
7. Create a Pull Request

### Code Style

**Python Backend:**
- Follow PEP 8
- Use type hints
- Maximum line length: 100 characters
- Use pre-commit hooks: `pip install pre-commit`

**React Frontend:**
- Use ESLint configuration
- Follow React best practices
- Use TypeScript
- Component naming: PascalCase
- Variable naming: camelCase

### Commit Messages

Format your commits as:
```
type: brief description

Longer explanation of changes if needed
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat: add score prediction feature

- Allows users to predict exact match scores
- Scores are highlighted in the UI
- Correct predictions award 3 points
```

## Pull Request Process

1. Update documentation as needed
2. Add tests for new functionality (aim for 80%+ coverage)
3. Ensure all tests pass
4. Request review from maintainers
5. Address review comments
6. Merge when approved

## Testing

### Backend Testing

```bash
cd backend
source venv/bin/activate

# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_predictions.py
```

### Frontend Testing

```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## Reporting Issues

Include:
- Clear description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment info (OS, Python/Node version, browser)

## Feature Requests

Include:
- Clear description of the feature
- Use case/benefit
- Possible implementation approach
- Any wireframes or mockups

## Questions?

- Check [SETUP.md](SETUP.md) for setup issues
- Check issue tracker for similar questions
- Create a discussion in GitHub Discussions

Thank you for contributing to Betty! 🎮⚽
