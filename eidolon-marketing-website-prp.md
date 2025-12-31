name: "Eidolon Marketing Website - SEO/AEO Optimized Next.js 15 Site"
description: |

## Purpose
Build a high-performance Next.js 15 marketing website optimized for both traditional SEO and Answer Engine Optimization (AEO). The site drives awareness, educates visitors, and converts them to download the free BYOK Eidolon desktop app.

## Core Principles
1. **Context is King**: All SEO/AEO strategies and implementation details included
2. **Validation Loops**: Lighthouse, schema validation, and content checks
3. **Progressive Success**: Launch Tier 1 pages first, expand with content
4. **Answer-First**: Structure content for AI citation
5. **Global Rules**: Follow all rules in CLAUDE.md

---

## Goal
Create a marketing website at eidolon.app (or similar domain) that:
- Ranks for AI desktop app and writing tool keywords
- Gets cited by AI answer engines (ChatGPT, Perplexity, Claude)
- Converts 15%+ of visitors to download the app
- Loads fast with 95+ Lighthouse performance score

**Primary Goal:** Convert visitors to download and try Eidolon (free BYOK model).

## Why
- **Business Value:** Drive awareness and downloads for Eidolon desktop app
- **User Impact:** Educate potential users on BYOK AI tools and iterative writing
- **SEO/AEO Opportunity:** Few competitors for "AI writing tool with version control" keywords
- **Brand Building:** Establish Tweek mascot and "Ship it" culture

## What
A Next.js 15 App Router website with:
- **Home Page:** Hero with Tweek, features grid, social proof, CTA
- **Features Pages:** Deep dives on Chat, Writer's Studio, Image Studio
- **Download Page:** Platform detection, one-click downloads
- **Documentation:** Getting started, FAQ, keyboard shortcuts
- **Blog:** SEO/AEO content targeting long-tail keywords
- **Compare Pages:** vs ChatGPT, vs T3.chat, etc.

### Success Criteria
- [ ] Home page loads with LCP < 2.0s
- [ ] Lighthouse Performance score 95+
- [ ] All pages have proper meta tags and OpenGraph
- [ ] SoftwareApplication schema on download page
- [ ] FAQ schema on FAQ page
- [ ] Sitemap.xml auto-generated
- [ ] llms.txt generated for AI crawlers (via next-aeo)
- [ ] Mobile responsive on all breakpoints
- [ ] Plausible analytics tracking downloads

---

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window

# Next.js 15
- url: https://nextjs.org/docs/app/getting-started
  why: App Router fundamentals
  critical: "Use app/ directory, generateMetadata for SEO"

- url: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
  why: Metadata API for SEO
  critical: "Export metadata or generateMetadata function"

- url: https://nextjs.org/learn/seo
  why: Official SEO guide
  critical: "Structured data, sitemap, robots.txt"

# AEO (Answer Engine Optimization)
- url: https://www.tryprofound.com/blog/next-aeo
  why: next-aeo package documentation
  critical: "Generates llms.txt for AI visibility"

- url: https://dev.to/vrushikvisavadiya/nextjs-15-seo-checklist-for-developers-in-2025-with-code-examples-57i1
  why: Comprehensive SEO/AEO checklist
  critical: "GEO (Generative Engine Optimization) patterns"

# Schema.org Structured Data
- url: https://schema.org/SoftwareApplication
  why: App schema reference
  critical: "operatingSystem, offers, downloadUrl"

- url: https://schema.org/FAQPage
  why: FAQ schema reference
  critical: "mainEntity array with Question items"

- url: https://schema.org/HowTo
  why: Tutorial schema reference
  critical: "step array with HowToStep items"

# Styling
- url: https://ui.shadcn.com/docs/installation/next
  why: shadcn/ui for Next.js
  critical: "Use bunx shadcn@latest init"

- url: https://tailwindcss.com/docs/guides/nextjs
  why: Tailwind CSS setup
  critical: "postcss.config.js, tailwind.config.ts"

# Analytics
- url: https://plausible.io/docs/nextjs-integration
  why: Privacy-first analytics
  critical: "next-plausible package, custom events"

# Project Documentation (LOCAL FILES)
- docfile: docs/eidolon-marketing-website-spec.md
  why: Full marketing requirements, sitemap, content strategy

- docfile: docs/eidolon-design-system-UIUX-spec.md
  why: Design tokens, CSS variables, component specs

- docfile: docs/eidolon-brand-identity.md
  why: Color palette, typography, Tweek usage guidelines
```

### Site Architecture
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

### Current Codebase Tree
```bash
# Starting fresh - no existing website code
```

### Desired Codebase Tree
```bash
eidolon-website/
├── app/
│   ├── layout.tsx                    # Root layout with metadata
│   ├── page.tsx                      # Home page
│   ├── globals.css                   # Tailwind + CSS variables
│   │
│   ├── features/
│   │   ├── page.tsx                  # Features overview
│   │   ├── chat/page.tsx             # Chat deep-dive
│   │   ├── writer/page.tsx           # Writer deep-dive
│   │   └── image/page.tsx            # Image deep-dive
│   │
│   ├── download/
│   │   └── page.tsx                  # Download page
│   │
│   ├── docs/
│   │   ├── layout.tsx                # Docs layout with sidebar
│   │   ├── page.tsx                  # Docs index
│   │   ├── getting-started/page.mdx
│   │   ├── api-setup/page.mdx
│   │   ├── keyboard-shortcuts/page.mdx
│   │   └── faq/page.tsx              # FAQ with schema
│   │
│   ├── blog/
│   │   ├── page.tsx                  # Blog index
│   │   └── [slug]/page.tsx           # Blog post template
│   │
│   ├── about/
│   │   └── page.tsx                  # About page
│   │
│   ├── changelog/
│   │   └── page.tsx                  # Changelog
│   │
│   ├── compare/
│   │   ├── page.tsx                  # Comparison index
│   │   └── [slug]/page.tsx           # Comparison template
│   │
│   ├── not-found.tsx                 # 404 page with Tweek
│   ├── sitemap.ts                    # Dynamic sitemap
│   └── robots.ts                     # Robots.txt
│
├── components/
│   ├── ui/                           # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   │
│   ├── layout/
│   │   ├── Header.tsx                # Site header/nav
│   │   ├── Footer.tsx                # Site footer
│   │   ├── MobileNav.tsx             # Mobile navigation
│   │   └── DocsNav.tsx               # Docs sidebar
│   │
│   ├── sections/
│   │   ├── Hero.tsx                  # Home hero section
│   │   ├── Features.tsx              # Features grid
│   │   ├── HowItWorks.tsx            # 3-step process
│   │   ├── SocialProof.tsx           # Testimonials/stars
│   │   ├── MeetTweek.tsx             # Mascot section
│   │   └── FinalCTA.tsx              # Bottom CTA
│   │
│   ├── download/
│   │   ├── PlatformDetector.tsx      # Detect OS
│   │   ├── DownloadButton.tsx        # Platform download
│   │   └── Requirements.tsx          # System requirements
│   │
│   ├── blog/
│   │   ├── PostCard.tsx              # Blog post card
│   │   ├── PostContent.tsx           # MDX renderer
│   │   └── TableOfContents.tsx       # Auto TOC
│   │
│   └── shared/
│       ├── SEOSchema.tsx             # JSON-LD component
│       ├── Tweek.tsx                 # Mascot illustrations
│       └── CodeBlock.tsx             # Syntax highlighted code
│
├── content/
│   ├── blog/                         # MDX blog posts
│   │   ├── what-is-byok.mdx
│   │   ├── ai-writing-version-control.mdx
│   │   └── ...
│   └── compare/                      # Comparison content
│       ├── chatgpt-vs-eidolon.mdx
│       └── t3-chat-vs-eidolon.mdx
│
├── lib/
│   ├── utils.ts                      # Utility functions
│   ├── metadata.ts                   # Metadata helpers
│   ├── schema.ts                     # Schema.org generators
│   └── content.ts                    # Content loading utilities
│
├── public/
│   ├── images/
│   │   ├── tweek/                    # Tweek illustrations
│   │   │   ├── standard.svg
│   │   │   ├── thinking.svg
│   │   │   ├── celebrating.svg
│   │   │   └── error.svg
│   │   ├── screenshots/              # App screenshots
│   │   └── og-image.png              # Default OG image
│   ├── downloads/                    # Installer files (or CDN links)
│   └── fonts/                        # Web fonts
│
├── styles/
│   └── design-tokens.css             # CSS variables from design system
│
├── next.config.ts                    # Next.js config
├── tailwind.config.ts                # Tailwind config
├── components.json                   # shadcn config
├── tsconfig.json
├── package.json
└── README.md
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Next.js 15 uses new metadata API
// BAD: Using next/head
// GOOD: Export metadata object or generateMetadata function

// CRITICAL: App Router requires 'use client' for interactive components
// Components using hooks, useState, onClick need 'use client' directive

// CRITICAL: MDX in App Router needs @next/mdx configuration
// Install: @next/mdx @mdx-js/loader @mdx-js/react

// CRITICAL: next-aeo generates llms.txt during build
// Must run build to see the output

// CRITICAL: Schema.org JSON-LD should be in <script type="application/ld+json">
// Use dangerouslySetInnerHTML or next/script

// CRITICAL: Plausible custom events use window.plausible()
// Check if function exists before calling

// CRITICAL: Download links should use Plausible events
// Track: plausible('Download', { props: { platform: 'macos' } })
```

---

## Implementation Blueprint

### Data Models (TypeScript Types)

```typescript
// lib/types.ts

// === CONTENT TYPES ===
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  content: string;
  readingTime: number;
}

export interface ComparisonPage {
  slug: string;
  title: string;
  description: string;
  productA: {
    name: string;
    pros: string[];
    cons: string[];
  };
  productB: {
    name: string;
    pros: string[];
    cons: string[];
  };
  features: Array<{
    name: string;
    productA: string;
    productB: string;
  }>;
}

export interface FAQ {
  question: string;
  answer: string;
}

// === SEO TYPES ===
export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
  };
}

// === DOWNLOAD TYPES ===
export interface DownloadInfo {
  platform: 'macos' | 'windows' | 'linux';
  version: string;
  size: string;
  url: string;
  architecture?: string;
}
```

### Schema.org Generators

```typescript
// lib/schema.ts

export function generateSoftwareApplicationSchema() {
  return {
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
    "description": "Desktop AI assistant with chat, writing studio with version control, and image generation. Free with BYOK (Bring Your Own Key).",
    "screenshot": "https://eidolon.app/images/screenshots/main.png",
    "downloadUrl": "https://eidolon.app/download",
    "author": {
      "@type": "Organization",
      "name": "Eidolon"
    }
  };
}

export function generateFAQSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

export function generateHowToSchema(steps: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to set up Eidolon",
    "description": "Get started with Eidolon in 3 easy steps",
    "step": steps.map((step, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": step
    }))
  };
}

export function generateArticleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "datePublished": post.date,
    "dateModified": post.date
  };
}
```

---

## Implementation Tasks

### Phase 1: Foundation (Tasks 1-8)

```yaml
Task 1.1: Initialize Next.js 15 with App Router
RUN: npx create-next-app@latest eidolon-website --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
VERIFY: npm run dev shows Next.js welcome page

Task 1.2: Configure Tailwind CSS with design tokens
MODIFY: tailwind.config.ts
  - ADD: CSS variable references for all colors
  - ADD: Custom fonts (Satoshi, General Sans, JetBrains Mono)
  - PATTERN: Extend theme from design system spec

CREATE: app/globals.css
  - ADD: All CSS variables from design system
  - ADD: @font-face for custom fonts
  - ADD: Dark theme as default

Task 1.3: Set up shadcn/ui with Eidolon theme
RUN: bunx shadcn@latest init
  - STYLE: new-york
  - BASE_COLOR: zinc
  - CSS_VARIABLES: yes

RUN: bunx shadcn@latest add button card input textarea dropdown-menu navigation-menu sheet accordion tabs

MODIFY: Component files to use Eidolon CSS variables

Task 1.4: Configure MDX for content
INSTALL: @next/mdx @mdx-js/loader @mdx-js/react

MODIFY: next.config.ts
  - ADD: MDX configuration
  - ADD: pageExtensions: ['ts', 'tsx', 'mdx']

CREATE: mdx-components.tsx
  - MAP: Custom components for h1, h2, code, etc.
  - STYLE: Match design system

Task 1.5: Set up Plausible analytics
INSTALL: next-plausible

MODIFY: app/layout.tsx
  - ADD: PlausibleProvider with domain
  - CONFIGURE: Custom events for downloads

CREATE: lib/analytics.ts
  - FUNCTION: trackDownload(platform)
  - FUNCTION: trackCTA(location)

Task 1.6: Create layout components
CREATE: components/layout/Header.tsx
  - LOGO: Eidolon wordmark
  - NAV: Features, Docs, Blog, About
  - CTA: Download button
  - MOBILE: Hamburger menu with Sheet

CREATE: components/layout/Footer.tsx
  - COLUMNS: Product, Resources, Company, Social
  - COPYRIGHT: © 2025 Eidolon
  - LINKS: GitHub, Twitter

CREATE: components/layout/MobileNav.tsx
  - TRIGGER: Hamburger icon
  - CONTENT: All nav links + download

Task 1.7: Configure generateMetadata for SEO
CREATE: lib/metadata.ts
  - FUNCTION: generateMetadata(page) helper
  - DEFAULTS: Site name, description, OG image
  - PATTERN: Merge with page-specific metadata

MODIFY: app/layout.tsx
  - EXPORT: metadata with site defaults

Task 1.8: Set up next-aeo for llms.txt
INSTALL: next-aeo

MODIFY: next.config.ts
  - ADD: next-aeo plugin configuration
  - CONFIGURE: Route scanning

RUN: npm run build
  - VERIFY: llms.txt generated in output
```

---

### Phase 2: Core Pages (Tasks 9-18)

```yaml
Task 2.1: Build Home page
CREATE: app/page.tsx
  - SECTION: Hero with Tweek, headline, CTAs
  - SECTION: Features grid (3 cards)
  - SECTION: How It Works (3 steps)
  - SECTION: Social Proof (testimonials when available)
  - SECTION: Meet Tweek
  - SECTION: Final CTA

CREATE: components/sections/Hero.tsx
  - HEADLINE: "Ship Your Ideas. Deliberately."
  - SUBHEAD: Value proposition
  - CTA: Download Free, See Features
  - IMAGE: Tweek illustration

CREATE: components/sections/Features.tsx
  - CARDS: Chat, Writer's Studio, Image Studio
  - PATTERN: Grid layout with icons
  - LINKS: To feature deep-dive pages

CREATE: components/sections/HowItWorks.tsx
  - STEPS: Download → Add API Key → Start Creating
  - PATTERN: Numbered steps with icons
  - SCHEMA: HowTo structured data

Task 2.2: Create Features overview page
CREATE: app/features/page.tsx
  - HERO: Features overview headline
  - GRID: All features with descriptions
  - LINKS: To individual feature pages

Task 2.3: Build Download page
CREATE: app/download/page.tsx
  - DETECT: User's platform
  - PRIMARY: Large download button for detected OS
  - SECONDARY: Links to other platforms
  - INFO: Version, size, requirements
  - SCHEMA: SoftwareApplication

CREATE: components/download/PlatformDetector.tsx
  - DETECT: window.navigator.platform
  - STATE: detectedPlatform

CREATE: components/download/DownloadButton.tsx
  - PROPS: platform, url, size
  - TRACK: Plausible download event
  - STYLE: Large, prominent button

Task 2.4: Create Getting Started docs
CREATE: app/docs/layout.tsx
  - SIDEBAR: Navigation for docs
  - CONTENT: MDX content area

CREATE: app/docs/page.tsx
  - INDEX: Links to all docs pages

CREATE: app/docs/getting-started/page.mdx
  - STEPS: Install, Configure API, First Chat
  - SCHEMA: HowTo

Task 2.5: Build About page
CREATE: app/about/page.tsx
  - SECTION: Mission/Vision
  - SECTION: Meet Tweek (full story)
  - SECTION: Ship It culture
  - IMAGE: Full Tweek illustration

Task 2.6: Create FAQ page with schema
CREATE: app/docs/faq/page.tsx
  - LAYOUT: Accordion for questions
  - CONTENT: 20+ FAQs from marketing spec
  - SCHEMA: FAQPage structured data

CREATE: lib/faq-data.ts
  - EXPORT: Array of {question, answer}

Task 2.7: Build comparison page template
CREATE: app/compare/[slug]/page.tsx
  - DYNAMIC: Load from MDX content
  - STRUCTURE: Quick comparison table
  - SECTIONS: Product A overview, Product B overview
  - SECTIONS: Head-to-head, Which to choose
  - SCHEMA: Product structured data

CREATE: content/compare/chatgpt-vs-eidolon.mdx
  - COMPARISON: ChatGPT vs Eidolon
  - TABLE: Feature comparison
  - VERDICT: When to use each

Task 2.8: Create 404 page with Tweek
CREATE: app/not-found.tsx
  - IMAGE: Tweek looking confused
  - MESSAGE: "Page not found"
  - ACTIONS: Go Home, Search

Task 2.9: Build sitemap.xml generation
CREATE: app/sitemap.ts
  - GENERATE: All static pages
  - GENERATE: All blog posts
  - GENERATE: All comparison pages
  - PRIORITY: Home=1.0, Features=0.8, Blog=0.6

Task 2.10: Create robots.txt
CREATE: app/robots.ts
  - ALLOW: All crawlers
  - SITEMAP: Link to sitemap.xml
  - DISALLOW: /api/ (if any)
```

---

### Phase 3: SEO/AEO (Tasks 19-25)

```yaml
Task 3.1: Implement SoftwareApplication schema
MODIFY: app/download/page.tsx
  - ADD: JSON-LD script with SoftwareApplication
  - INCLUDE: All required properties

CREATE: components/shared/SEOSchema.tsx
  - PROPS: schema object
  - RENDER: <script type="application/ld+json">

Task 3.2: Add FAQ schema to FAQ page
MODIFY: app/docs/faq/page.tsx
  - GENERATE: FAQPage schema from questions
  - INJECT: Via SEOSchema component

Task 3.3: Create HowTo schema for tutorials
MODIFY: app/docs/getting-started/page.mdx
  - ADD: HowTo schema for setup steps
  - STEPS: Download, Configure, Use

Task 3.4: Optimize Core Web Vitals
AUDIT: npm run build && npm start, then Lighthouse

OPTIMIZE:
  - IMAGES: Use next/image with proper sizing
  - FONTS: Use next/font for self-hosting
  - LAZY: Below-fold sections lazy loaded
  - PRECONNECT: Critical origins in layout

TARGETS:
  - LCP: < 2.0s
  - FID: < 100ms
  - CLS: < 0.1

Task 3.5: Set up Google Search Console
MANUAL:
  - ADD: Property in GSC
  - VERIFY: Via DNS or meta tag
  - SUBMIT: sitemap.xml

CREATE: app/google[hash].html (if needed for verification)

Task 3.6: Create initial comparison pages
CREATE: content/compare/t3-chat-vs-eidolon.mdx
  - FOCUS: Multi-model chat comparison
  - UNIQUE: Writer's Studio differentiator

CREATE: content/compare/ai-writing-tools.mdx
  - LISTICLE: Top AI writing tools with version control
  - EIDOLON: Featured prominently

Task 3.7: Configure OpenGraph and Twitter cards
MODIFY: app/layout.tsx
  - ADD: Default OG image (1200x630)
  - ADD: Twitter card meta tags

CREATE: public/images/og-image.png
  - DESIGN: Eidolon logo + Tweek + tagline
  - SIZE: 1200x630
```

---

## Validation Loop

### Level 1: Build & Type Check
```bash
# Run after every file change
npm run build                       # Next.js build
npx tsc --noEmit                   # TypeScript check

# Expected: No errors
# If errors: Read message, fix code, re-run
```

### Level 2: Lighthouse Audit
```bash
# Build and start production server
npm run build && npm start

# Run Lighthouse in Chrome DevTools or CLI
npx lighthouse http://localhost:3000 --view

# Targets:
# - Performance: 95+
# - Accessibility: 95+
# - Best Practices: 95+
# - SEO: 95+
```

### Level 3: Schema Validation
```bash
# Use Google's Rich Results Test
# https://search.google.com/test/rich-results

# Test pages:
# - /download (SoftwareApplication)
# - /docs/faq (FAQPage)
# - /docs/getting-started (HowTo)
# - /blog/[slug] (Article)

# Expected: All schemas valid, eligible for rich results
```

### Level 4: AEO Validation
```bash
# Build to generate llms.txt
npm run build

# Check llms.txt exists
cat .next/static/llms.txt

# Verify content structure:
# - All pages listed
# - Key content sections identified
# - Metadata accurate
```

### Level 5: Mobile Responsiveness
```bash
# Test at breakpoints:
# - 320px (mobile small)
# - 375px (mobile standard)
# - 768px (tablet)
# - 1024px (laptop)
# - 1440px (desktop)

# Verify:
# - No horizontal scroll
# - Touch targets 44px+
# - Text readable without zoom
# - Navigation works on mobile
```

---

## Content Guidelines

### Voice & Tone
- **Confident but not arrogant**
- **Technical but accessible**
- **Action-oriented** ("Ship it" mentality)
- **Playful but professional**

### AEO Content Structure
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

### SEO Page Template
```markdown
Title: [Primary Keyword] - Eidolon | [50-60 chars]
Description: [Include CTA, 150-160 chars]

H1: [Primary keyword, match title]
H2s: [Supporting topics, secondary keywords]
H3s: [Subsections]

Internal links: 3-5 to related pages
External links: 1-2 to authoritative sources
```

### Keywords to Target

**Primary (High Intent):**
- AI desktop app
- AI writing assistant with version control
- ChatGPT alternative desktop
- OpenRouter client
- AI chat app for writers

**Long-tail (AEO-Focused):**
- best AI tool for iterative writing
- how to use AI for document revision
- AI assistant with git-style version history
- free AI writing tool BYOK

**Questions (Featured Snippets):**
- What is the best AI desktop app?
- How to iterate on writing with AI?
- Can I use multiple AI models in one app?
- What is BYOK for AI tools?

---

## Final Validation Checklist

### Technical SEO
- [ ] All pages have unique title tags (50-60 chars)
- [ ] All pages have meta descriptions (150-160 chars)
- [ ] H1 tags on every page with primary keyword
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Internal links to related pages
- [ ] Alt text on all images
- [ ] sitemap.xml accessible at /sitemap.xml
- [ ] robots.txt accessible at /robots.txt
- [ ] Canonical URLs on all pages

### Schema Markup
- [ ] SoftwareApplication on /download
- [ ] FAQPage on /docs/faq
- [ ] HowTo on /docs/getting-started
- [ ] Article on blog posts
- [ ] All schemas validate in Rich Results Test

### Performance
- [ ] Lighthouse Performance 95+
- [ ] LCP < 2.0s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Images optimized with next/image

### AEO
- [ ] llms.txt generated during build
- [ ] Answer-first content structure on key pages
- [ ] Comparison tables on /compare pages
- [ ] FAQs structured for extraction

### Analytics
- [ ] Plausible tracking on all pages
- [ ] Download events tracked
- [ ] CTA clicks tracked

---

## Anti-Patterns to Avoid

- ❌ Don't use next/head (deprecated in App Router)
- ❌ Don't forget 'use client' on interactive components
- ❌ Don't hardcode metadata (use generateMetadata)
- ❌ Don't skip schema validation
- ❌ Don't ignore Core Web Vitals
- ❌ Don't use generic stock photos for Tweek
- ❌ Don't write walls of text (use structure, lists, tables)
- ❌ Don't stuff keywords unnaturally
- ❌ Don't forget mobile testing
- ❌ Don't launch without analytics

---

## Confidence Score: 9/10

### Strengths
- **Standard Patterns**: Next.js 15 App Router is well-documented
- **Clear Structure**: Marketing spec defines all pages
- **Design System**: Complete tokens and components provided
- **SEO Guidance**: Comprehensive checklist in marketing spec

### Risks
- **Tweek Illustrations**: May need placeholder SVGs initially
- **AEO Effectiveness**: Emerging field, measurement challenging
- **Content Creation**: Blog posts require ongoing effort

### Mitigation
- Use simple geometric Tweek placeholder (circle + coffee cup)
- Focus on content structure, AEO will follow
- Create 5 foundational blog posts, expand over time

---

*End of PRP*
