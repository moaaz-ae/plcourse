# Contributing to Introduction to Propositional Logic

First off, thank you for considering contributing to this project! It's people like you that make it a great tool for everyone.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

- **Check if the bug has already been reported** by searching on GitHub under Issues.
- If you can't find an open issue addressing the problem, **open a new one**.
- Be as detailed as possible, including steps to reproduce, the behavior you're seeing, and what you expect to happen.

### Suggesting Enhancements

- **Open a GitHub Issue** to describe the enhancement.
- Explain why this enhancement would be useful to most users.

### Pull Requests

1.  **Fork the repository**.
2.  **Create a new branch** for your feature or fix.
3.  **Implement your changes**.
4.  **Ensure tests pass** (`pnpm test`).
5.  **Run linting and formatting** (`pnpm lint`, `pnpm format`).
6.  **Submit a pull request** with a clear description of your changes.

## Development Setup

### Prerequisites

- Node.js (v20+)
- pnpm
- Docker (for PostgreSQL)

### Setup

```bash
pnpm install
pnpm db:start:dev
pnpm db:migrate:dev
pnpm db:seed:dev
pnpm dev
```

## Curriculum Contributions

The curriculum is located in `src/lib/curriculum`. Each topic is a directory containing:

- `lesson.md`: The instructional content in Markdown with KaTeX support. Prerequisites for the topic are defined in the frontmatter of this file.
- `questions.yaml`: The problem set for the topic.

If you are adding a new topic, remember to sync the curriculum using `pnpm db:seed:dev`.

## Style Guide

- Use Svelte 5 runes (`$state`, `$derived`, `$effect`).
- Follow the existing project structure and naming conventions.
- Ensure all logic is covered by unit tests in `*.test.ts`.

Thank you for your contributions!
