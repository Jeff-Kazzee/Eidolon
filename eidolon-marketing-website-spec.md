# Eidolon Marketing Website - Product Requirements Document

**Version:** 0.1.0  
**Last Updated:** December 31, 2024  
**Author:** Jeff Kazzee  
**Status:** Draft

---

## 1. Executive Summary

The Eidolon marketing website is a Next.js application designed to drive awareness, educate visitors, and convert them to try the free BYOK desktop app. The site implements both traditional SEO and Answer Engine Optimization (AEO) strategies to maximize visibility across Google, AI answer engines (ChatGPT, Perplexity, Claude), and voice search.

**Primary Goal:** Convert visitors to download and try Eidolon (free BYOK model).

**One-liner:** "Meet Tweek and ship your ideas."

---

## 2. Strategic Objectives

### Website Goals

| Goal | Metric | Target |
|------|--------|--------|
| Awareness | Monthly organic visitors | 10,000 by month 6 |
| Conversion | Download rate | 15% of visitors |
| Engagement | Avg time on site | > 2 minutes |
| AEO Visibility | AI citation rate | Mentioned in 20% of relevant AI queries |
| Brand Recognition | "Eidolon AI" search volume | 500+ monthly searches by month 6 |

### Target Audience

1. **Vibe Coders** - Self-taught devs who use AI assistants extensively
2. **Indie Creators** - Bloggers, newsletter writers, content creators
3. **AI Tool Enthusiasts** - People who follow and try new AI tools
4. **Developers seeking portfolio projects** - Looking for inspiration

---

## 3. Information Architecture

### Site Map

```
/                           → Home (hero, value prop, CTA)
├── /features               → Feature overview
│   ├── /features/chat      → Chat feature deep-dive
│   ├── /features/writer    → Writer's Studio deep-dive
│   └── /features/image     → Image Studio deep-dive
├── /download               → Download page with installers
├── /docs                   → Documentation hub
│   ├── /docs/getting-started
│   ├── /docs/api-setup
│   ├── /docs/keyboard-shortcuts
│   └── /docs/faq
├── /blog                   → Blog for SEO/AEO content
├── /about                  → About page, meet Tweek
├── /changelog              → Release notes
└── /compare                → Comparison pages (AEO-optimized)
    ├── /compare/chatgpt-vs-eidolon
    ├── /compare/t3-chat-vs-eidolon
    └── /compare/ai-writing-tools
```

### Page Priority for MVP

**Tier 1 (Launch):**
- Home
- Features (overview)
- Download
- Getting Started docs
- About

**Tier 2 (Week 2-4):**
- Feature deep-dives
- FAQ
- Compare pages
- Blog (first 5 posts)

**Tier 3 (Ongoing):**
- Additional blog content
- Changelog
- Community/showcase

---

## 4. SEO Strategy

### Keyword Research Framework

**Primary Keywords (High Intent):**
- "AI desktop app"
- "AI writing assistant with version control"
- "ChatGPT alternative desktop"
- "OpenRouter client"
- "AI chat app for writers"

**Long-tail Keywords (AEO-Focused):**
- "best AI tool for iterative writing"
- "how to use AI for document revision"
- "AI assistant with git-style version history"
- "desktop AI chat app with multiple models"
- "free AI writing tool BYOK"

**Question Keywords (Featured Snippets/Voice):**
- "What is the best AI desktop app?"
- "How to iterate on writing with AI?"
- "Can I use multiple AI models in one app?"
- "What is BYOK for AI tools?"

### On-Page SEO Requirements

**Every Page Must Have:**
- [ ] Unique title tag (50-60 chars) with primary keyword
- [ ] Meta description (150-160 chars) with CTA
- [ ] H1 tag with primary keyword
- [ ] Structured heading hierarchy (H2, H3)
- [ ] Internal links to related pages
- [ ] External links to authoritative sources
- [ ] Alt text for all images
- [ ] Schema markup (see below)

**Schema Markup (JSON-LD):**

```json
// Organization schema (site-wide)
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Eidolon",
  "applicationCategory": "ProductivityApplication",
  "operatingSystem": "Windows, macOS, Linux",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Desktop AI assistant with chat, writing studio, and image generation",
  "screenshot": "https://eidolon.app/screenshot.png",
  "downloadUrl": "https://eidolon.app/download"
}

// FAQ schema (for FAQ pages)
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [...]
}

// HowTo schema (for tutorial content)
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to set up Eidolon",
  "step": [...]
}

// Article schema (for blog posts)
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "author": {...},
  "datePublished": "...",
  "dateModified": "..."
}
```

### Technical SEO

- [ ] Next.js App Router with static generation where possible
- [ ] Sitemap.xml (auto-generated)
- [ ] Robots.txt
- [ ] Canonical URLs on all pages
- [ ] OpenGraph and Twitter Card meta tags
- [ ] Page speed: LCP < 2.5s, CLS < 0.1
- [ ] Mobile-responsive design
- [ ] HTTPS everywhere
- [ ] Clean URL structure (no query params for content)

---

## 5. Answer Engine Optimization (AEO) Strategy

### Core AEO Principles

1. **Direct Answers:** Each content chunk should answer one specific question
2. **Structured Content:** Use tables, lists, and clear hierarchies that LLMs can parse
3. **Entity Optimization:** Consistently mention "Eidolon," "Tweek," and key features
4. **Listicles Work:** Comparison lists and "best of" content get cited 32% of the time
5. **Freshness Signals:** Include current year in titles and meta where appropriate

### AEO Content Structure

**Format every piece of content as:**

```markdown
# [Question as H1]

[2-3 sentence direct answer - this is what AI will extract]

## [Supporting Section]

[Detailed explanation with specific facts, numbers, comparisons]

| Feature | Eidolon | Alternative |
|---------|---------|-------------|
| ... | ... | ... |

## Key Takeaways

- Bullet point 1
- Bullet point 2
- Bullet point 3
```

### AEO-Optimized Content Types

**1. Comparison Pages** (Highest citation potential)
- "Eidolon vs ChatGPT: Which AI Desktop App is Better?"
- "T3.chat vs Eidolon: Feature Comparison 2025"
- "Best AI Writing Tools with Version History Compared"
- "Top 10 OpenRouter Client Apps Ranked"

**2. Question-Answer Content**
- FAQ pages with one question per section
- "What is [concept]?" explainer posts
- "How to [task]" tutorials

**3. Listicles**
- "5 Reasons Writers Love AI Version Control"
- "7 Features That Make Eidolon Different"
- "10 Ways to Use AI for Iterative Writing"

**4. Definition/Concept Pages**
- "What is BYOK (Bring Your Own Key) for AI?"
- "What is Git-Style Version Control for Documents?"
- "AI Writing Studio: What It Is and Why You Need One"

### AEO Technical Requirements

**Text Fragment Optimization:**
- Use `#:~:text=` fragment identifiers for key answer paragraphs
- Ensure answer sections are self-contained (no pronouns that require prior context)

**Structured Data for AI:**
- FAQ schema on all question-based content
- HowTo schema on tutorial content
- Product schema with comprehensive attributes
- Tables for comparison data (LLMs love tables)

**Citation Optimization:**
- Mention "Eidolon" by name in the first 100 words
- Include specific numbers and statistics where possible
- Link to authoritative external sources
- Update content quarterly with fresh dates

### Content Calendar (First 90 Days)

**Week 1-2: Foundation**
- Home page with AEO-optimized copy
- "What is Eidolon?" landing page
- Getting Started guide (HowTo schema)
- FAQ page (20 questions minimum)

**Week 3-4: Comparison Content**
- vs ChatGPT comparison
- vs T3.chat comparison
- "Best AI Writing Tools 2025" listicle
- "Best OpenRouter Clients" listicle

**Week 5-8: Tutorials & Concepts**
- "What is BYOK for AI?" (definition)
- "How to Use AI for Document Revision" (tutorial)
- "Git-Style Version Control for Writers" (concept)
- "Multi-Model AI Chat Explained" (concept)

**Week 9-12: Blog Content**
- Weekly blog posts on AI writing topics
- Update comparison pages with fresh data
- User testimonials/case studies (when available)

---

## 6. Conversion Funnel

### Funnel Stages

```
AWARENESS → INTEREST → CONSIDERATION → CONVERSION → ACTIVATION
    │           │            │              │            │
    ▼           ▼            ▼              ▼            ▼
  SEO/AEO   Features    Compare/FAQ    Download    First Chat
  Content    Pages       Docs          Page        Complete
```

### Stage 1: Awareness

**Entry Points:**
- Google search (SEO keywords)
- AI answer citations (AEO)
- Social media (Twitter/X, Reddit, HN)
- Word of mouth

**Content:**
- Blog posts answering common questions
- Comparison pages
- "What is..." explainers

**Goal:** Click through to website

### Stage 2: Interest

**User Actions:**
- Browse features page
- Watch demo video (if created)
- Read about Tweek mascot

**Content:**
- Features overview with screenshots
- Interactive demos (if feasible)
- "Meet Tweek" brand content

**Goal:** Visit download page

### Stage 3: Consideration

**User Actions:**
- Read FAQ
- Check system requirements
- Compare with alternatives
- Read documentation

**Content:**
- Detailed FAQ
- Comparison tables
- System requirements
- "What You'll Need" checklist

**Goal:** Decide to download

### Stage 4: Conversion

**User Actions:**
- Click download button
- Choose platform (Windows/Mac/Linux)
- Complete download

**Download Page Elements:**
- [ ] Clear platform detection
- [ ] One-click download buttons
- [ ] File size and requirements shown
- [ ] "What happens next" preview
- [ ] Social proof (download count, GitHub stars)
- [ ] No-signup required messaging

**Goal:** Successful download

### Stage 5: Activation

**User Actions:**
- Install app
- Enter API key
- Send first message
- Use Writer's Studio

**Post-Download Content:**
- [ ] In-app onboarding
- [ ] "Getting Started" docs link
- [ ] Video tutorial (optional)
- [ ] Community invite

**Goal:** First successful AI interaction

### Funnel Metrics to Track

| Stage | Metric | Tool |
|-------|--------|------|
| Awareness | Organic traffic, AI citations | GA4, OmniSEO |
| Interest | Page views, time on site | GA4, Plausible |
| Consideration | FAQ/docs views, bounce rate | GA4 |
| Conversion | Download clicks, completion rate | GA4, custom events |
| Activation | App opens, first message | Telemetry (opt-in) |

---

## 7. Landing Page Specifications

### Home Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] Eidolon                      Features Docs [Download]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              [Tweek illustration with coffee]               │
│                                                             │
│        Ship Your Ideas. Deliberately.                       │
│                                                             │
│    AI chat, writing studio with version control,            │
│    and image generation. Free. Bring your own key.          │
│                                                             │
│              [Download Free] [See Features →]               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                     FEATURES GRID                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │   Chat   │  │  Writer  │  │  Image   │                  │
│  │ Multiple │  │ Version  │  │  Studio  │                  │
│  │  Models  │  │ History  │  │ Generate │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
├─────────────────────────────────────────────────────────────┤
│                   HOW IT WORKS                              │
│  1. Download → 2. Add API Key → 3. Start Creating           │
├─────────────────────────────────────────────────────────────┤
│                   SOCIAL PROOF                              │
│  "Quote from user" - Name, Role                             │
│  ★★★★★ 4.8/5 based on X reviews                           │
│  [GitHub Stars] [Download Count]                            │
├─────────────────────────────────────────────────────────────┤
│                   MEET TWEEK                                │
│  [Tweek illustration]                                       │
│  Your caffeinated companion...                              │
├─────────────────────────────────────────────────────────────┤
│                   FINAL CTA                                 │
│  Ready to ship?                                             │
│  [Download Free for Mac/Windows/Linux]                      │
├─────────────────────────────────────────────────────────────┤
│ Footer: Links | GitHub | Twitter | © 2025                   │
└─────────────────────────────────────────────────────────────┘
```

### Key Messaging

**Hero Headline Options:**
- "Ship Your Ideas. Deliberately."
- "AI-Powered Creating. Version-Controlled Writing."
- "Chat. Write. Iterate. Ship."

**Value Props (Feature Cards):**
1. **Multi-Model Chat:** "Use Claude, GPT, Gemini, and more—all in one place."
2. **Writer's Studio:** "Git-style version control for your writing. Branch, compare, merge."
3. **Image Generation:** "Turn ideas into visuals instantly."

**BYOK Messaging:**
- "Free forever. Bring your own API key."
- "No subscriptions. No limits. Just your OpenRouter key."
- "You control the models. You control the data."

### Download Page

```
┌─────────────────────────────────────────────────────────────┐
│                     Download Eidolon                        │
│                                                             │
│   We detected you're on [macOS/Windows/Linux]               │
│                                                             │
│        ┌─────────────────────────────────────┐              │
│        │  [Apple Icon]                       │              │
│        │  Download for macOS                 │              │
│        │  v1.0.0 • 145 MB • Intel & Apple    │              │
│        └─────────────────────────────────────┘              │
│                                                             │
│        Other platforms:                                     │
│        [Windows] [Linux .deb] [Linux .AppImage]             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│   What you'll need:                                         │
│   ✓ OpenRouter API key (get one free at openrouter.ai)     │
│   ✓ macOS 12+ / Windows 10+ / Ubuntu 20.04+                │
│                                                             │
│   After downloading:                                        │
│   1. Open the installer                                     │
│   2. Add your OpenRouter API key in settings                │
│   3. Start chatting with any AI model                       │
│                                                             │
│   [View Getting Started Guide →]                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Technical Stack

### Website Technology

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | Next.js 15 (App Router) | Static generation, great SEO, React ecosystem |
| **Styling** | Tailwind CSS + shadcn/ui | Consistent with app, fast iteration |
| **CMS** | MDX files in repo | Simple, version-controlled, no backend |
| **Analytics** | Plausible (privacy-first) | GDPR compliant, lightweight |
| **Search Analytics** | Google Search Console | Keyword tracking, indexing status |
| **AEO Tracking** | OmniSEO or manual checks | Monitor AI citations |
| **Hosting** | Vercel | Automatic deploys, edge functions, analytics |
| **Domain** | eidolon.app or similar | Short, memorable, .app implies software |

### Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 95+ |
| LCP | < 2.0s |
| FID | < 100ms |
| CLS | < 0.1 |
| Time to First Byte | < 200ms |
| Total Page Size | < 500KB (excluding images) |

### SEO Technical Checklist

- [ ] Next.js generateMetadata for all pages
- [ ] Automatic sitemap generation
- [ ] RSS feed for blog
- [ ] Structured data validation
- [ ] Image optimization with next/image
- [ ] Lazy loading for below-fold content
- [ ] Preconnect to critical origins
- [ ] Font optimization with next/font

---

## 9. Content Guidelines

### Voice & Tone

**Brand Voice:**
- Confident but not arrogant
- Technical but accessible
- Playful but professional
- Action-oriented ("Ship it" mentality)

**Writing Style:**
- Short sentences, short paragraphs
- Active voice
- Second person ("you")
- Specific over vague
- Show, don't tell

**Words We Use:**
- Ship, build, create, iterate
- Version, branch, compare
- Powerful, fast, free
- Your (data, keys, models)

**Words We Avoid:**
- Revolutionary, game-changing, cutting-edge
- Synergy, leverage, optimize
- "AI-powered" overuse (we are AI)
- Corporate jargon

### Tweek Usage on Website

**Where Tweek Appears:**
- Hero section (prominent)
- About page (full story)
- Error pages (404, etc.)
- Loading states
- Empty states in screenshots

**Tweek Guidelines:**
- Always has a beverage (coffee, energy drink)
- Always wearing "Ship it" shirt
- Expressions match context (happy=success, thinking=loading)
- Don't overuse—meaningful moments only

---

## 10. Analytics & Tracking

### Key Performance Indicators

**Traffic KPIs:**
- Monthly unique visitors
- Organic search traffic
- Traffic by source (Google, direct, referral, AI citations)
- Blog post traffic

**Engagement KPIs:**
- Average time on site
- Pages per session
- Bounce rate
- Scroll depth on key pages

**Conversion KPIs:**
- Download page visits
- Download button clicks
- Download completions (by platform)
- Conversion rate (visitors → downloads)

**AEO KPIs:**
- Brand mention tracking in AI responses
- Citation count in Perplexity, ChatGPT
- Featured snippet ownership
- Voice search visibility

### Tracking Implementation

```javascript
// Plausible custom events
plausible('Download', { props: { platform: 'macos' } })
plausible('CTA Click', { props: { location: 'hero' } })
plausible('Docs View', { props: { page: 'getting-started' } })
```

### Monthly Review Checklist

- [ ] Review Google Search Console for keyword opportunities
- [ ] Check AI citation status for key queries
- [ ] Analyze conversion funnel drop-off
- [ ] Update comparison pages with fresh data
- [ ] Publish at least 2 new blog posts
- [ ] Review and respond to feedback

---

## 11. Launch Checklist

### Pre-Launch (T-2 weeks)

- [ ] All Tier 1 pages complete
- [ ] SEO audit passed (Lighthouse, ahrefs)
- [ ] Schema markup validated
- [ ] Analytics configured
- [ ] Social media accounts created
- [ ] Press kit / assets ready
- [ ] Legal pages (Privacy, Terms)

### Launch Day

- [ ] Submit sitemap to Google Search Console
- [ ] Submit to Bing Webmaster Tools
- [ ] Announce on Twitter/X
- [ ] Post to relevant subreddits (r/SideProject, r/webdev)
- [ ] Submit to Product Hunt (consider timing)
- [ ] Hacker News "Show HN" post
- [ ] Personal network outreach

### Post-Launch (T+1 week)

- [ ] Monitor analytics for issues
- [ ] Respond to feedback/comments
- [ ] Fix any SEO issues identified
- [ ] Begin blog content publication
- [ ] Start AEO tracking

---

## 12. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Low initial traffic | High | Medium | Focus on long-tail AEO content |
| Poor conversion rate | Medium | High | A/B test CTAs, optimize download flow |
| AI citation takes time | Certain | Low | Consistent content, patience |
| Competition for keywords | Medium | Medium | Focus on unique angle (version control) |
| Tweek illustrations delayed | Medium | Low | Launch with placeholder, add later |

---

## 13. Open Questions

- [ ] Final domain name? (eidolon.app, geteidolon.com, etc.)
- [ ] Include video on homepage? (adds complexity)
- [ ] Product Hunt launch timing?
- [ ] Telemetry approach for activation tracking?
- [ ] Community platform? (Discord, GitHub Discussions)

---

## Appendix A: SEO Keyword List

### Primary Keywords

| Keyword | Monthly Volume | Difficulty | Intent |
|---------|----------------|------------|--------|
| ai desktop app | 1,200 | Medium | Commercial |
| openrouter client | 400 | Low | Commercial |
| ai writing assistant | 8,100 | High | Commercial |
| chatgpt alternative | 12,000 | High | Commercial |
| ai chat app desktop | 800 | Medium | Commercial |

### Long-Tail Keywords

| Keyword | Volume | Difficulty | Intent |
|---------|--------|------------|--------|
| ai writing tool with version control | 50 | Low | Commercial |
| best ai app for writers | 300 | Medium | Commercial |
| free ai chat app byok | 100 | Low | Commercial |
| multiple ai models one app | 200 | Low | Informational |
| git for writing documents | 150 | Low | Informational |

### Question Keywords (AEO Focus)

| Question | Target Page |
|----------|-------------|
| What is the best AI desktop app? | Home / Compare |
| How to use multiple AI models? | Features / Blog |
| What is BYOK for AI? | Blog / Docs |
| Best ChatGPT alternatives 2025 | Compare |
| AI writing tool with history | Features / Writer |

---

## Appendix B: Comparison Page Template

```markdown
# [Product A] vs [Product B]: [Benefit-Focused Comparison] 2025

[Direct answer in 2-3 sentences - what AI will cite]

## Quick Comparison

| Feature | [Product A] | [Product B] |
|---------|-------------|-------------|
| Price | ... | ... |
| Platform | ... | ... |
| Key Strength | ... | ... |
| Best For | ... | ... |

## [Product A] Overview

[2-3 paragraphs about Product A]

### Pros
- ...
- ...

### Cons
- ...
- ...

## [Product B] Overview

[2-3 paragraphs about Product B]

### Pros
- ...
- ...

### Cons
- ...
- ...

## Head-to-Head Comparison

### [Dimension 1]
[Comparison with specific examples]

### [Dimension 2]
[Comparison with specific examples]

## Which Should You Choose?

**Choose [Product A] if:** [criteria]

**Choose [Product B] if:** [criteria]

## Frequently Asked Questions

### Is [Product A] better than [Product B]?
[Direct answer]

### Can I use both?
[Direct answer]

## Conclusion

[Summary with clear recommendation]
```

---

*End of Marketing Website PRD*