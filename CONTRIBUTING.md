# Contributing to Game Store

Game Store uses a lightweight workflow based on Issues, short-lived branches and Pull Requests.

## Workflow

1. Create or select an Issue with a clear goal and acceptance criteria.
2. Create a branch from `main`.
3. Make small commits that contribute to the same goal.
4. Run the local checks.
5. Open a Pull Request linked to the Issue.
6. Wait for CI to pass before merging.

## Branch names

- `feat/issue-number-summary`
- `fix/issue-number-summary`
- `docs/issue-number-summary`
- `refactor/issue-number-summary`
- `test/issue-number-summary`
- `chore/issue-number-summary`

Example: `feat/42-platform-filter`.

## Commit messages

Use `type: short description`, with an imperative verb and one subject per commit.

- `feat:` new functionality
- `fix:` bug fix
- `docs:` documentation
- `style:` formatting without behavior changes
- `refactor:` restructuring without new behavior
- `test:` tests
- `build:` dependencies or compilation
- `ci:` GitHub automation
- `chore:` general maintenance
- `security:` security improvements

Avoid vague messages such as `changes`, `fix`, `updates` or `work in progress`.

## Local checks

Backend:

```bash
cd backend
vendor/bin/pint --test
php artisan test
composer audit
```

Frontend:

```bash
cd frontend
npm audit --audit-level=high
npm run lint
npm run test
npm run build
npm run test:e2e
```

## Security

Never commit `.env` files, credentials, tokens, private keys or real customer data. Use placeholder values in examples and sanitize logs and screenshots.
