@AGENTS.md
# CLAUDE.md

## Project Overview

Krisha Hospital is a hospital management application built with:

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS 4
* React Hook Form
* Zod
* shadcn/ui

The project should prioritize:

* Clean architecture
* Type safety
* Maintainability
* Accessibility
* Responsive UI
* Healthcare data privacy

---

## Development Rules

### TypeScript

* Never use `any` unless absolutely necessary.
* Prefer explicit types.
* Use interfaces for component props.
* Keep types close to where they are used.
* Fix TypeScript errors instead of suppressing them.

### React

* Use functional components only.
* Prefer Server Components when possible.
* Use Client Components only when required.
* Keep components focused on a single responsibility.
* Extract reusable logic into custom hooks.

### Next.js

* Follow App Router conventions.
* Use server actions when appropriate.
* Prefer server-side data fetching.
* Avoid unnecessary client-side fetching.
* Optimize performance and bundle size.

### Forms

* Use React Hook Form.
* Validate using Zod.
* Show user-friendly validation messages.
* Keep validation schemas separate and reusable.

### UI

* Prefer existing shadcn/ui components.
* Reuse existing components before creating new ones.
* Maintain consistent spacing and typography.
* Ensure responsive layouts for mobile, tablet, and desktop.
* Ensure accessibility standards are followed.

### Styling

* Use Tailwind CSS utilities.
* Avoid inline styles.
* Use `cn()` utility for class merging.
* Follow existing design patterns.

---

## File Organization

Before creating a new file:

1. Search for an existing implementation.
2. Reuse existing components where possible.
3. Avoid duplicate functionality.

Preferred structure:

* components/
* hooks/
* lib/
* types/
* app/

Keep files small and focused.

---

## Code Quality

* Remove unused imports.
* Remove dead code.
* Avoid code duplication.
* Prefer readable code over clever code.
* Keep functions short.

When modifying code:

* Preserve existing behavior unless requested otherwise.
* Explain any breaking changes.

---

## Security

Hospital-related applications may contain sensitive information.

* Never expose secrets.
* Never hardcode API keys.
* Never log sensitive patient information.
* Validate all external input.
* Sanitize user-provided data.

---

## Before Making Changes

Always:

1. Understand the current implementation.
2. Review related files.
3. Identify potential side effects.
4. Propose significant architectural changes before implementing them.

---

## Verification

After changes:

Run:

npm run lint

Verify:

* No TypeScript errors
* No ESLint errors
* No obvious UI regressions

---

## Response Format

When completing work:

1. Summarize what changed.
2. List modified files.
3. Mention assumptions.
4. Mention any remaining issues.
5. Suggest improvements if relevant.
