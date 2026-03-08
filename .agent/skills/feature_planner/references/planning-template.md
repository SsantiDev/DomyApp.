# Planning Template Reference

## Purpose
This reference defines the standard planning template for complete features in Domy. Use it when translating a feature request into a structured, executable technical plan across frontend, backend, data, security, testing, and delivery.

The goal is to make every feature plan:
- clear
- actionable
- layered
- testable
- easy to implement in atomic steps

---

## Core Rule
A feature plan must start from the functional goal and end with an implementation sequence.

Do not start from files, folders, or technologies alone.
Always begin with:
1. what the feature does
2. who uses it
3. what outcome it must produce

---

## Standard Feature Planning Template

# 1. Functional Goal
Describe the feature in plain language.

Questions to answer:
- What problem does this feature solve?
- Who uses it?
- What result should the user experience?
- What is the main outcome when the feature is complete?

Example:
- Drivers can view their upcoming scheduled services in a dedicated screen.
- Admin users can approve payment requests and leave audit comments.

---

# 2. Scope
Define what is included and what is excluded.

## In Scope
List the behaviors, screens, endpoints, or flows that belong to this feature.

## Out of Scope
List explicitly what should not be built now to prevent scope drift.

Example:
In Scope:
- Profile editing form
- Avatar update
- Validation errors
- Save confirmation

Out of Scope:
- Password reset
- Role management
- Multi-profile support

---

# 3. Assumptions and Dependencies
Document all assumptions and prerequisites.

Typical examples:
- User must already be authenticated
- Backend profile endpoint already exists
- Feature depends on a permissions model
- A new table or migration is required
- The design system already contains the necessary input components

Always state:
- assumptions that may affect implementation
- external dependencies
- prior work required
- unclear business rules

---

# 4. Functional Decomposition
Break the feature into smaller user-facing capabilities or flows.

Each subflow should answer:
- what happens first
- what happens next
- what can fail
- what the user sees

Recommended breakdown:
- happy path
- validation or decision points
- error states
- edge cases
- empty states if relevant

Example:
1. User opens profile screen
2. Current data is loaded
3. User edits fields
4. Validation runs
5. User saves changes
6. Success feedback appears
7. Errors are shown if update fails

---

# 5. Layer Impact
Map the feature to system layers.

## Frontend
Describe:
- screens
- components
- hooks
- state changes
- navigation
- UX states

## Backend
Describe:
- models
- services
- serializers
- views or endpoints
- permissions
- business rules

## Data / Persistence
Describe:
- new entities
- updated entities
- local cache needs
- database implications
- migration requirements

## Security
Describe:
- auth requirements
- permissions
- ownership checks
- sensitive data handling

---

# 6. Backend Required
List the backend work required for the feature.

Use this structure when applicable:

## Models
- new model
- modified model
- constraints
- relations

## Services
- business logic needed
- orchestration rules
- transaction boundaries

## API
- endpoints
- methods
- serializers
- response shape
- validation rules

## Permissions
- who can access
- who can mutate
- ownership or scope checks

## Performance
- query implications
- expected related loading
- need for pagination or indexing

---

# 7. Frontend Required
List the frontend work required for the feature.

Use this structure when applicable:

## Screens
- new screens
- updated screens

## Components
- atoms
- molecules
- organisms
- reusable UI pieces

## Hooks / Data Flow
- new hooks
- session dependencies
- caching
- retry or refresh logic

## Navigation
- new routes
- param updates
- guarded flows

## UX States
- loading
- error
- empty
- success
- retry
- offline if needed

---

# 8. Data and Contracts
Define the key transport and state contracts.

Document:
- request payloads
- response payloads
- frontend mappers
- persistence expectations
- temporary or cached state
- whether the backend is the source of truth
- whether local data must survive app restarts

If relevant, specify:
- snake_case to camelCase mapping
- Result wrapper pattern
- validation error structure
- auth failure handling

---

# 9. Security and Validation
Describe what must be protected or validated.

Include:
- authentication requirement
- authorization or role checks
- object ownership
- sensitive fields
- validation rules
- misuse scenarios
- replay or duplicate submission risks if relevant

Never omit this section for features that mutate data or expose private information.

---

# 10. Technical Risks
List the main technical uncertainties or implementation risks.

Typical risk categories:
- unclear business rules
- dependency on legacy code
- frontend/backend contract mismatch
- migration risk
- permission ambiguity
- concurrency issues
- performance degradation
- offline complexity
- hidden refactor dependency

For each risk, indicate:
- why it matters
- what it could affect
- how to reduce or isolate it

---

# 11. Implementation Sequence
Define the safest and clearest order to build the feature.

The sequence should be executable in blocks.

Recommended structure:
1. prerequisite refactor or schema work
2. backend domain or API foundation
3. frontend data flow integration
4. UI implementation
5. UX state completion
6. testing
7. cleanup or small refactors

The sequence must avoid forcing all work at once.

---

# 12. Test Plan
Define the minimum validation needed before considering the feature complete.

Include when relevant:
- unit tests
- integration tests
- permission tests
- serializer or validation tests
- hook tests
- screen behavior tests
- loading/error/empty state tests
- regression checks

Do not leave this section generic.
State what must actually be verified.

---

# 13. Atomic Commits
Propose implementation blocks that can map to atomic commits.

Each commit should represent one coherent technical intention.

Good examples:
- `feat: add payment request model and validation rules`
- `feat: expose payment approval endpoint`
- `feat: add payment approval hook and typed client`
- `feat: build payment approval screen`
- `test: add coverage for payment approval permissions`

Avoid:
- one giant commit for the whole feature
- mixing backend, frontend, refactor, and tests without separation
- vague commit purposes

---

# 14. Final Recommendation
Close with the best implementation strategy.

This section should answer:
- what should be built first
- what should be delayed
- what risk needs extra attention
- what the safest route is for delivery

---

## Quality Checklist
Before closing a feature plan, verify:

- Is the functional goal clear?
- Is the scope bounded?
- Are frontend and backend responsibilities separated?
- Are contracts and validations defined?
- Are risks visible?
- Is the implementation order realistic?
- Are tests included?
- Are commits atomic and coherent?

---

## Anti-Patterns
Avoid these planning mistakes:
- describing only files instead of flows
- mixing future ideas into the current feature scope
- skipping risks
- omitting testing
- planning frontend and backend without boundaries
- proposing one large implementation block
- hiding refactor needs
- assuming unknown business rules without marking them