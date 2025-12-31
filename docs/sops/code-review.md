# Code Review SOP

## Overview

Standard procedure for reviewing code changes in Eidolon, including automated Codex review.

## When to Use

- Every pull request
- Every story completion
- Before merging to main branch

## Prerequisites

- [ ] Access to GitHub repository
- [ ] Codex CLI installed and configured
- [ ] Understanding of the story/feature being reviewed

## Steps

### 1. Automated Codex Review

Run Codex review on the PR:

```bash
# For a specific PR
codex review --pr <pr-number> --model gpt-codex-5.2

# For specific files
codex review src/components/*.tsx --model gpt-codex-5.2

# With detailed output
codex review --pr <pr-number> --model gpt-codex-5.2 --output detailed
```

### 2. Review Codex Feedback

Codex analyzes:
- Code quality and best practices
- Security vulnerabilities
- Performance issues
- Type safety
- Test coverage gaps

### 3. Address Codex Feedback

For each issue identified:
1. **Critical**: Must fix before merge
2. **Warning**: Should fix, discuss if not
3. **Info**: Consider for future improvement

### 4. Manual Review Checklist

- [ ] **Functionality**: Does the code do what the story requires?
- [ ] **Architecture**: Does it follow project patterns?
- [ ] **Types**: Are types correct and comprehensive?
- [ ] **Tests**: Are there adequate tests?
- [ ] **Documentation**: Is complex logic documented?
- [ ] **Security**: No hardcoded secrets, proper input validation
- [ ] **Performance**: No obvious performance issues
- [ ] **Accessibility**: UI changes are accessible

### 5. Provide Feedback

Use GitHub review features:
- **Approve**: Ready to merge
- **Request Changes**: Must address issues
- **Comment**: Questions or suggestions

### 6. Re-review After Changes

If changes requested:
1. Author makes fixes
2. Re-run Codex review
3. Review changes
4. Approve when ready

## Checklist

- [ ] Codex review passed
- [ ] All critical issues addressed
- [ ] Manual review checklist complete
- [ ] Tests pass
- [ ] No merge conflicts

## Common Review Comments

```markdown
# Security
⚠️ Security: [description of issue]

# Performance
⏱️ Performance: Consider [suggestion]

# Type Safety
📝 Types: [type issue description]

# Best Practice
💡 Consider: [suggestion]
```

## Related

- [Release Process](./release-process.md)
- [Security Audit](./security-audit.md)
