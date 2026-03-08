# Design System Reference

## Purpose
This reference defines how visual styles must be implemented in Domy frontend. Its purpose is to ensure that every component, screen, and layout uses the project's real design tokens and shared styling primitives instead of hardcoded values.

The first source of truth is always the existing project variables, constants, theme objects, and shared style files already defined in the codebase.

---

## Core Rule
Use existing design tokens and theme variables from the codebase before introducing any new value.

Do not:
- hardcode colors directly in components
- hardcode spacing values if a token already exists
- invent parallel naming for colors, font sizes, or spacing
- duplicate theme values locally inside screens or components

If a required token does not exist:
1. verify that it is truly missing
2. follow the current naming convention of the project
3. propose adding it in the shared theme or tokens file
4. do not create isolated ad hoc values inside a single component unless strictly justified

---

## Source of Truth
The visual source of truth must be the shared design system already present in the project.

Typical sources include:
- `theme/colors.ts`
- `theme/spacing.ts`
- `theme/typography.ts`
- `theme/shadows.ts`
- `constants/theme.ts`
- `styles/tokens.ts`
- shared UI libraries or central style modules

Use the real file names and exported variables from the project whenever available.

---

## Token Usage Rule
When styling a component:

1. search for an existing token first
2. reuse the existing exported variable or theme key
3. only introduce a new token if the design need is real and reusable
4. keep naming aligned with the established system

Always prefer this:

`color: colors.primary`  
`padding: spacing.md`  
`fontSize: typography.body.fontSize`

Instead of this:

`color: '#007AFF'`  
`padding: 16`  
`fontSize: 16`

---

## Color Tokens
Use the project's predefined color variables as the official source of truth.

Preferred pattern:
- `colors.primary`
- `colors.success`
- `colors.warning`
- `colors.danger`
- `colors.background`
- `colors.textPrimary`
- `colors.textSecondary`
- `colors.border`
- `colors.surface`

If your real project uses different names, preserve those names exactly.

### Reference palette
Only use this as fallback documentation if you need to understand semantic intent:

- Primary: Blue
- Success: Green
- Warning: Orange
- Danger: Red
- Background: Light neutral background

Do not prioritize raw hex values over the project token names.

---

## Spacing Tokens
Use the shared spacing scale already defined in the project.

Preferred pattern:
- `spacing.xs`
- `spacing.sm`
- `spacing.md`
- `spacing.lg`
- `spacing.xl`

If your project instead uses names like:
- `spaceSmall`
- `spaceMedium`
- `spaceLarge`

then keep those exact names and do not rename them in components.

### Semantic guidance
Typical intentions:
- small spacing: compact separation
- medium spacing: standard internal spacing
- large spacing: section spacing
- xl spacing: major visual separation

Do not hardcode numeric spacing values in components unless there is no shared token and the exception is justified.

---

## Typography Tokens
Use the shared typography definitions already present in the project.

Preferred pattern:
- `typography.h1`
- `typography.h2`
- `typography.body`
- `typography.caption`

Or preserve the exact project naming if it differs.

A typography token should ideally centralize:
- `fontSize`
- `fontWeight`
- `lineHeight`
- optional `letterSpacing`

Preferred usage:

`...typography.h1`

or

`fontSize: typography.body.fontSize`  
`fontWeight: typography.body.fontWeight`  
`lineHeight: typography.body.lineHeight`

Do not manually rebuild typography styles repeatedly inside components if a shared token already exists.

---

## Border Radius, Elevation, and Shadows
If the project already defines tokens for radius or elevation, always reuse them.

Preferred patterns:
- `radius.sm`
- `radius.md`
- `radius.lg`
- `shadows.sm`
- `shadows.md`

Do not create one-off shadow or radius definitions per component unless there is a specific visual need not covered by the shared system.

---

## Component Styling Rules
When building or updating a component:

1. use shared tokens first
2. keep styles inside `StyleSheet.create` or the shared styling approach used by the project
3. avoid large inline style objects
4. avoid redefining the same visual constants in multiple files
5. if a style pattern repeats, extract it into a shared component or style primitive

---

## Variant Rules
If a component needs variants, base them on semantic tokens rather than raw values.

Preferred:
- primary button uses `colors.primary`
- error badge uses `colors.danger`
- success state uses `colors.success`

Avoid:
- manually assigning unique colors inside each component variant without reference to the design system

---

## Required Audit Checklist
For every new component or screen, verify:

1. are colors coming from shared tokens
2. is spacing coming from the shared spacing scale
3. is typography coming from shared typography definitions
4. are radius and shadows reused from shared tokens if available
5. are styles consistent with existing components
6. is there any duplicated hardcoded visual value that should be extracted

---

## Anti-patterns
- hardcoding hex values in component files
- hardcoding spacing values repeatedly
- redefining typography in each screen
- creating visual variants outside the theme system
- introducing new token names that conflict with existing naming conventions
- mixing semantic tokens and raw values inconsistently
- duplicating theme constants locally

---

## Implementation note
If the project already has predefined variables, those variables override this document's generic examples.

This reference exists to reinforce reuse of the real system, not to replace it.