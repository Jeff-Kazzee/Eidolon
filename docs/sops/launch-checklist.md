# Launch Checklist SOP

## Overview

Comprehensive checklist for launching Eidolon (desktop app and marketing website).

## When to Use

- Initial product launch
- Major version launches
- Post-beta launch

## Desktop App Checklist

### Build & Distribution

- [ ] All platforms build successfully
  - [ ] macOS (Intel + Apple Silicon)
  - [ ] Windows (x64)
  - [ ] Linux (AppImage, deb)

- [ ] Code signing configured
  - [ ] macOS notarization
  - [ ] Windows Authenticode (if available)

- [ ] Auto-update configured and tested

### Functionality

- [ ] Core features working
  - [ ] Chat with AI models
  - [ ] Model selection
  - [ ] Conversation persistence
  - [ ] Writer's Studio editor
  - [ ] Version history
  - [ ] Settings panel

- [ ] API integration
  - [ ] OpenRouter connection works
  - [ ] Streaming responses work
  - [ ] Error handling graceful

- [ ] Data persistence
  - [ ] Conversations persist across restarts
  - [ ] Documents save correctly
  - [ ] Settings persist

### Performance

- [ ] App launches in < 3 seconds
- [ ] UI responsive during streaming
- [ ] Memory usage < 500MB typical
- [ ] No obvious memory leaks

### Security

- [ ] Security audit completed
- [ ] API keys stored securely
- [ ] No sensitive data in logs
- [ ] CSP configured

## Marketing Website Checklist

### Technical

- [ ] Site deployed to production
- [ ] SSL certificate valid
- [ ] All pages load correctly
- [ ] No console errors
- [ ] Mobile responsive

### SEO

- [ ] All pages have unique titles
- [ ] Meta descriptions set
- [ ] OpenGraph images configured
- [ ] Schema markup validated
- [ ] Sitemap submitted to Google
- [ ] robots.txt configured

### Content

- [ ] All Tier 1 pages complete
  - [ ] Home page
  - [ ] Features page
  - [ ] Download page
  - [ ] About page
  - [ ] Getting Started docs

- [ ] Download links working
- [ ] Platform detection correct
- [ ] No placeholder content

### Analytics

- [ ] Plausible configured
- [ ] Custom events tracking
- [ ] Download tracking working
- [ ] Google Search Console set up

### Performance

- [ ] Lighthouse score 95+
- [ ] LCP < 2.5s
- [ ] No layout shift (CLS < 0.1)
- [ ] Images optimized

## Pre-Launch (T-7 days)

- [ ] All development complete
- [ ] All tests passing
- [ ] Beta testing feedback addressed
- [ ] Documentation complete
- [ ] Legal pages ready (Privacy, Terms)

## Pre-Launch (T-1 day)

- [ ] Final build created
- [ ] Release notes written
- [ ] Social media posts drafted
- [ ] Email announcement drafted
- [ ] Press kit ready (if applicable)

## Launch Day

### Morning

- [ ] Create GitHub release
- [ ] Publish release (not draft)
- [ ] Verify downloads working
- [ ] Deploy website updates
- [ ] Verify download links

### Announcements

- [ ] Post to Twitter/X
- [ ] Post to Reddit (appropriate subreddits)
- [ ] Post to Hacker News (if applicable)
- [ ] Send newsletter (if applicable)
- [ ] Personal network outreach

### Monitoring

- [ ] Watch GitHub issues
- [ ] Monitor crash reports
- [ ] Check website analytics
- [ ] Respond to early feedback

## Post-Launch (T+1 week)

- [ ] Review analytics
- [ ] Address critical issues
- [ ] Collect testimonials
- [ ] Plan next iteration
- [ ] Post retrospective

## Rollback Plan

If critical issues discovered:

1. **Yank Desktop Release**
   - Make GitHub release draft
   - Remove download links from website
   - Post incident notice

2. **Rollback Website**
   - Revert to previous deployment
   - Update download links

3. **Communication**
   - Acknowledge issue publicly
   - Provide timeline for fix
   - Keep users updated

## Success Metrics

| Metric | Target | Tracking |
|--------|--------|----------|
| Downloads (day 1) | 100+ | GitHub |
| Website visitors (day 1) | 1000+ | Plausible |
| Critical bugs | 0 | GitHub Issues |
| GitHub stars (week 1) | 50+ | GitHub |

## Related

- [Release Process](./release-process.md)
- [Security Audit](./security-audit.md)
