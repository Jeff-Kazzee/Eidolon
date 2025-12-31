# Release Process SOP

## Overview

Standard procedure for releasing new versions of Eidolon.

## When to Use

- Major version releases (X.0.0)
- Minor version releases (0.X.0)
- Patch releases (0.0.X)

## Prerequisites

- [ ] All stories for release are complete
- [ ] All tests passing
- [ ] CI green on main branch
- [ ] Codex review passed for all PRs
- [ ] Changelog prepared

## Steps

### 1. Prepare Release

1. **Update version numbers**:
   ```bash
   # Update root package.json
   # Update apps/desktop/package.json
   # Update apps/web/package.json
   ```

2. **Update changelog**:
   ```markdown
   # Changelog

   ## [X.Y.Z] - YYYY-MM-DD

   ### Added
   - New features

   ### Changed
   - Changes to existing features

   ### Fixed
   - Bug fixes
   ```

3. **Create release branch** (for major/minor):
   ```bash
   git checkout -b release/vX.Y.Z
   ```

### 2. Test Release

1. **Build all platforms**:
   ```bash
   bun run build
   ```

2. **Test installers**:
   - [ ] macOS DMG
   - [ ] Windows EXE
   - [ ] Linux AppImage

3. **Smoke test**:
   - [ ] App launches
   - [ ] Can configure API key
   - [ ] Can send chat message
   - [ ] Can create/edit document
   - [ ] Settings persist

### 3. Create Release

1. **Merge to main** (if on release branch):
   ```bash
   git checkout main
   git merge release/vX.Y.Z
   ```

2. **Create tag**:
   ```bash
   git tag -a vX.Y.Z -m "Release vX.Y.Z"
   git push origin vX.Y.Z
   ```

3. **Wait for CI**:
   - Release workflow builds all platforms
   - Artifacts uploaded to GitHub Release
   - Draft release created

### 4. Publish Release

1. **Review GitHub Release**:
   - Verify all artifacts present
   - Update release notes if needed

2. **Publish**:
   - Uncheck "This is a pre-release" (unless it is)
   - Click "Publish release"

3. **Deploy website**:
   - Verify Vercel deployment succeeded
   - Update download links if needed

### 5. Post-Release

1. **Announce**:
   - [ ] Twitter/X
   - [ ] Discord (if applicable)
   - [ ] Newsletter (if applicable)

2. **Monitor**:
   - [ ] Check for crash reports
   - [ ] Monitor GitHub issues
   - [ ] Watch for feedback

## Checklist

### Pre-Release
- [ ] All stories complete
- [ ] All tests passing
- [ ] Version numbers updated
- [ ] Changelog updated
- [ ] Release branch created (if major/minor)

### Testing
- [ ] macOS build tested
- [ ] Windows build tested
- [ ] Linux build tested
- [ ] Smoke tests passed

### Release
- [ ] Tag created and pushed
- [ ] CI completed successfully
- [ ] All artifacts uploaded
- [ ] Release notes complete
- [ ] Release published

### Post-Release
- [ ] Website updated
- [ ] Announcements posted
- [ ] Monitoring in place

## Rollback Procedure

If critical issue found after release:

1. **Yank release** (make draft):
   - Edit release on GitHub
   - Check "This is a pre-release" or delete

2. **Fix issue**:
   ```bash
   git checkout -b hotfix/vX.Y.Z+1
   # Fix issue
   ```

3. **Release hotfix**:
   - Follow steps above with new version

## Related

- [Code Review](./code-review.md)
- [Launch Checklist](./launch-checklist.md)
