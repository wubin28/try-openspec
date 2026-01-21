# Project Context

## Purpose
Experimental Next.js web application project to evaluate and learn the OpenSpec framework for AI-assisted development. This is a learning/exploration project to understand how OpenSpec can improve the development workflow for modern web applications.

## Tech Stack
- **Framework**: Next.js 16.1.4 (App Router)
- **UI Library**: React 19.2.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Linting**: ESLint 9 with Next.js config (core-web-vitals + typescript)
- **Build Tools**: Next.js built-in bundler, PostCSS
- **Fonts**: Geist Sans & Geist Mono (via next/font)

## Project Conventions

### Code Style
- **TypeScript**: Strict mode enabled (`strict: true`)
- **Target**: ES2017
- **Module System**: ESNext with bundler resolution
- **JSX Transform**: Modern react-jsx (no React import needed)
- **File Extensions**: `.tsx` for React components, `.ts` for utilities, `.mjs` for config files
- **Naming**: Lowercase filenames (e.g., `page.tsx`, `layout.tsx`)
- **Imports**: Path alias `@/*` maps to project root
- **ESLint**: Following Next.js recommended configurations for code quality and web vitals

### Architecture Patterns
- **Routing**: Next.js App Router (file-system based routing in `app/` directory)
- **Components**: React Server Components by default (use 'use client' directive when needed)
- **Layout System**: Root layout in `app/layout.tsx` with nested layouts as needed
- **Styling**: Tailwind CSS utility classes, global styles in `app/globals.css`
- **Font Loading**: Optimized with next/font, CSS variables for font families
- **Metadata**: Export metadata objects from page/layout files for SEO

### Testing Strategy
Not yet configured. Future considerations:
- Jest or Vitest for unit testing
- React Testing Library for component testing
- Playwright or Cypress for E2E testing

### Git Workflow
- **Main Branch**: `main`
- **Current Status**: Clean working tree
- **Commit Style**: Conventional commits preferred (e.g., "chore:", "feat:", "fix:")
- Recent commits show: initialization, Next.js setup, gitignore configuration

## Domain Context
This is an experimental/learning project focused on:
- Understanding OpenSpec's proposal-based development workflow
- Learning Next.js 16 with the App Router paradigm
- Exploring modern React patterns (Server Components, streaming)
- Testing AI-assisted development workflows

The project name "jianshaoaihuanjue" may indicate future AI-related features or experimentation.

## Important Constraints
- Learning/experimental nature means rapid iteration expected
- No production deployment requirements at this stage
- Focus on understanding tooling and patterns over feature completeness

## External Dependencies
None currently configured. Project is using standard Next.js dependencies only.
