# GitHub Workflow

This document describes the Git branching strategy and GitHub workflow for the Eidolon project.

## Branch Structure

```
main (production)
  └── dev (integration)
        ├── sprint-0/infrastructure
        ├── sprint-1/desktop-foundation
        ├── sprint-2/chat-core
        └── ...
```

### Branch Descriptions

| Branch | Purpose | Protected | Merge Target |
|--------|---------|-----------|--------------|
| `main` | Production-ready code | Yes | - |
| `dev` | Development integration | Yes | `main` |
| `sprint-X/epic-name` | Feature branches | No | `dev` |

## Workflow Overview

```
Feature Branch → Dev → Main
     ↓            ↓      ↓
  Codex Review   CI    Deploy
  CI/CD          Copilot Review
```

## Step-by-Step Workflow

### 1. Start New Epic

```bash
# Ensure dev is up to date
git checkout dev
git pull origin dev

# Create feature branch
git checkout -b sprint-X/epic-name

# Example:
git checkout -b sprint-1/desktop-foundation
```

### 2. Implement Stories

Work through each story in the epic:

```bash
# Make changes for each story
# Use conventional commit messages

git add .
git commit -m "feat(desktop): initialize electron-vite project"

# Continue with more stories...
git commit -m "feat(desktop): add tailwind and shadcn/ui setup"
git commit -m "feat(desktop): implement IPC architecture"
```

### 3. Run Local Checks

Before pushing, always run:

```bash
# Install dependencies
bun install

# Run all checks
bun run lint
bun run typecheck
bun run test
bun run build
```

### 4. Push Feature Branch

```bash
git push -u origin sprint-X/epic-name
```

### 5. Run Codex Code Review

```bash
# Review the entire codebase
codex review . --model gpt-codex-5.2 --output detailed

# Or review specific files
codex review apps/desktop/src --model gpt-codex-5.2
```

Fix any issues identified:

```bash
git add .
git commit -m "fix: address codex review feedback"
git push
```

### 6. Create Pull Request (Feature → Dev)

```bash
gh pr create \
  --base dev \
  --title "Sprint X, Epic X.X: Epic Description" \
  --body "## Summary
- Story X.X.1: Description
- Story X.X.2: Description
- Story X.X.3: Description

## Testing
- [ ] All tests pass
- [ ] Build succeeds on all platforms
- [ ] Codex review passed

## Screenshots
(if applicable)"
```

### 7. CI/CD Runs Automatically

The CI workflow runs:
- **Lint**: ESLint/TypeScript lint checks
- **Typecheck**: Full TypeScript compilation check
- **Test**: Unit and integration tests
- **Build**: Build verification on Ubuntu, Windows, macOS

### 8. GitHub Copilot Code Review

Copilot automatically reviews the PR and provides:
- Code quality suggestions
- Security vulnerability detection
- Best practice recommendations

Address any Copilot suggestions before merging.

### 9. Merge to Dev

After CI passes and reviews are approved:

```bash
# Via GitHub UI or:
gh pr merge --squash
```

### 10. Sync Dev to Main

After epic is complete and tested on dev:

```bash
# Create PR from dev to main
gh pr create \
  --base main \
  --head dev \
  --title "Release: Sprint X Complete" \
  --body "## Changes
- Epic X.1: Description
- Epic X.2: Description

## Verification
- [ ] All CI checks pass
- [ ] Integration testing complete"

# Merge to main
gh pr merge --merge
```

### 11. CRITICAL: Sync Main Back to Dev

**This step is required to prevent future merge conflicts.**

After merging to main, immediately sync main back into dev:

```bash
# Switch to dev and pull latest
git checkout dev
git pull origin dev

# Merge main into dev (brings in the merge commit)
git merge origin/main -m "chore: sync main into dev after release"

# If conflicts occur, resolve them keeping the dev versions
# (since dev has the latest code)

# Push the synced dev branch
git push origin dev
```

**Why this is necessary:**
When a PR is merged to `main`, GitHub creates a merge commit that only exists in `main`. If you continue working on `dev` without syncing, the branches diverge. The next time you try to merge `dev` → `main`, Git will see conflicting histories and mark the PR as having merge conflicts.

## Commit Message Convention

```
type(scope): description

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code restructuring |
| `test` | Adding/updating tests |
| `chore` | Maintenance tasks |

### Scopes

| Scope | Description |
|-------|-------------|
| `desktop` | Desktop Electron app |
| `web` | Marketing website |
| `shared` | Shared package |
| `ci` | CI/CD configuration |
| `docs` | Documentation |

### Examples

```bash
feat(desktop): add conversation list component
fix(shared): correct type export for Message interface
docs: update README with installation instructions
chore(ci): add caching to build workflow
test(desktop): add unit tests for chat store
```

## CI/CD Configuration

### CI Workflow (`.github/workflows/ci.yml`)

Runs on every push and PR:

```yaml
jobs:
  lint:       # ESLint checks
  typecheck:  # TypeScript compilation
  test:       # Unit/integration tests
  build:      # Multi-platform builds
```

### Release Workflow (`.github/workflows/release.yml`)

Runs on version tags (`v*`):

```yaml
jobs:
  release-desktop:  # Build desktop installers
  release-web:      # Deploy marketing site
  create-release:   # GitHub Release with changelog
```

## Branch Protection Rules

### Main Branch

- Require PR before merging
- Require status checks: `lint`, `typecheck`, `test`, `build`
- Require conversation resolution
- Do not allow force pushes

### Dev Branch

- Require PR before merging
- Require status checks: `lint`, `typecheck`, `test`, `build`
- Allow squash merging only

## Code Review Checklist

### Before Creating PR

- [ ] All local checks pass (`bun run lint && bun run typecheck && bun run test`)
- [ ] Build succeeds (`bun run build`)
- [ ] Codex review completed and issues addressed
- [ ] Commit messages follow convention
- [ ] No sensitive data in commits

### PR Review Criteria

- [ ] Code follows project conventions
- [ ] Tests added for new functionality
- [ ] Documentation updated if needed
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met (for UI changes)

## Troubleshooting

### CI Failures

1. Check the failed job logs in GitHub Actions
2. Reproduce locally: `bun run <failed-script>`
3. Fix and push

### Merge Conflicts

```bash
# Update your branch with latest dev
git checkout sprint-X/epic-name
git fetch origin
git rebase origin/dev

# Resolve conflicts, then:
git add .
git rebase --continue
git push --force-with-lease
```

### Reverting Changes

```bash
# Revert a specific commit
git revert <commit-hash>

# Revert a merge
git revert -m 1 <merge-commit-hash>
```

## Quick Reference

```bash
# Daily workflow
git checkout dev && git pull
git checkout -b sprint-X/epic-name
# ... work ...
bun run lint && bun run typecheck && bun run test && bun run build
git push -u origin sprint-X/epic-name
codex review . --model gpt-codex-5.2
gh pr create --base dev

# After PR approval
gh pr merge --squash

# Sync to production (after epic complete)
gh pr create --base main --head dev
gh pr merge --merge

# CRITICAL: After merging to main, sync back to dev
git checkout dev && git pull
git merge origin/main -m "chore: sync main into dev after release"
git push origin dev
```
