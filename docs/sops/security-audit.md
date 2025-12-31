# Security Audit SOP

## Overview

Standard procedure for security audits of Eidolon code and configuration.

## When to Use

- Before major releases
- After adding authentication/authorization features
- When handling sensitive data
- Quarterly routine audits

## Prerequisites

- [ ] Access to full codebase
- [ ] Understanding of Electron security model
- [ ] Familiarity with OWASP guidelines

## Audit Checklist

### Electron Security

- [ ] **Context Isolation Enabled**
  ```typescript
  webPreferences: {
    contextIsolation: true,  // ✓ Required
    nodeIntegration: false,  // ✓ Required
  }
  ```

- [ ] **Preload Script Security**
  - Only exposes necessary APIs
  - No direct Node.js access in renderer

- [ ] **No Remote Content**
  - No loading of remote URLs in main window
  - No remote module usage

- [ ] **CSP Headers**
  ```typescript
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["default-src 'self'"]
      }
    });
  });
  ```

### API Security

- [ ] **API Key Storage**
  - Keys stored with Electron safeStorage
  - Keys never logged or displayed

- [ ] **Network Security**
  - HTTPS only for all requests
  - Certificate validation enabled

- [ ] **Input Validation**
  - All user input validated
  - SQL parameters properly escaped

### Data Security

- [ ] **Sensitive Data Handling**
  - No secrets in code or logs
  - Environment variables for configuration

- [ ] **Database Security**
  - Parameterized queries only
  - No SQL string concatenation

- [ ] **File System Security**
  - User data in app-specific directories
  - Proper file permissions

### IPC Security

- [ ] **Channel Validation**
  - All IPC channels whitelisted
  - Unknown channels rejected

- [ ] **Message Validation**
  - All IPC messages validated
  - Type checking on arguments

## Audit Steps

### 1. Automated Scanning

```bash
# Run security audit on dependencies
bun audit

# Check for known vulnerabilities
npm audit --audit-level=high
```

### 2. Code Review

Search for security anti-patterns:

```bash
# Check for eval usage
grep -r "eval(" src/

# Check for innerHTML
grep -r "innerHTML" src/

# Check for hardcoded secrets
grep -ri "password\|secret\|api.key\|token" src/
```

### 3. Electron-Specific Checks

```bash
# Verify webPreferences
grep -r "nodeIntegration" src/
grep -r "contextIsolation" src/
grep -r "enableRemoteModule" src/
```

### 4. Review Dependencies

- Check for outdated packages
- Review new dependencies added
- Verify package integrity

### 5. Manual Testing

- [ ] Try XSS in input fields
- [ ] Verify CSP blocks inline scripts
- [ ] Test for command injection
- [ ] Verify file access is restricted

## Security Issues Classification

| Severity | Response Time | Examples |
|----------|---------------|----------|
| Critical | Immediate | RCE, data breach |
| High | 24 hours | XSS, SQL injection |
| Medium | 1 week | Information disclosure |
| Low | Next release | Best practice violations |

## Reporting

Document findings in security report:

```markdown
# Security Audit Report

Date: YYYY-MM-DD
Auditor: Name
Version: X.Y.Z

## Summary
Brief overview of findings.

## Findings

### [SEVERITY] Finding Title
**Description:** What was found
**Impact:** Potential impact
**Recommendation:** How to fix
**Status:** Fixed/Open/Accepted Risk
```

## Checklist Summary

- [ ] Electron security settings verified
- [ ] API security reviewed
- [ ] Data handling audited
- [ ] IPC security checked
- [ ] Dependencies audited
- [ ] Manual testing completed
- [ ] Report generated
- [ ] Issues tracked

## Related

- [Code Review](./code-review.md)
- [Release Process](./release-process.md)
