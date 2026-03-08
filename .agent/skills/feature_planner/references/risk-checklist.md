# Risk Checklist Reference

## Purpose
This reference defines the standard risk checklist for feature planning in Domy. Use it to identify, categorize, and communicate technical risks before implementation begins.

The goal is not to block delivery.
The goal is to make uncertainty visible, reduce surprise, and sequence implementation more safely.

---

## Core Rule
Every non-trivial feature has risk.

A good plan does not pretend risk does not exist.
A good plan:
- identifies risk early
- labels it clearly
- reduces it where possible
- isolates it when it cannot be removed

---

## How to Use This Checklist
For each planned feature, review the categories below and answer:

1. Does this risk exist here?
2. How severe is it?
3. What part of the system does it affect?
4. Can it be reduced before implementation?
5. Should it be isolated into a separate block or prerequisite?

Use severity labels such as:
- low
- medium
- high
- critical

---

# 1. Functional Ambiguity Risk
This risk exists when the feature is not clearly defined from a product or user perspective.

Typical signals:
- unclear expected behavior
- undefined edge cases
- missing user roles
- unclear success criteria
- conflicting interpretations of the same feature

Questions:
- Is the expected behavior fully understood?
- Are input and output expectations clear?
- Are invalid or partial states defined?
- Is the difference between in-scope and out-of-scope clear?

Mitigation:
- document assumptions explicitly
- narrow scope
- isolate ambiguous parts
- request clarification before implementation if the ambiguity is blocking

---

# 2. Frontend / Backend Contract Risk
This risk exists when data shape, error semantics, auth flow, or field mapping may drift between frontend and backend.

Typical signals:
- undefined request/response payloads
- unclear validation response format
- inconsistent naming conventions
- unknown auth behavior on failure
- frontend assumptions not guaranteed by backend

Questions:
- Are request and response contracts defined?
- Are snake_case and camelCase mappings explicit?
- Are error states and auth failures predictable?
- Does frontend depend on fields not guaranteed by backend?

Mitigation:
- define contracts before implementation
- add mapping rules
- centralize error handling
- align serializer and frontend model expectations

---

# 3. Domain Integrity Risk
This risk exists when the feature affects core business rules, entity consistency, or multi-step mutations.

Typical signals:
- multiple related writes
- state transitions with rules
- model changes
- constraint-sensitive data
- duplicate submission risk
- idempotency concerns

Questions:
- Does this feature mutate more than one entity?
- Are business rules enforced in backend?
- Is there any chance of inconsistent state?
- Should the operation be atomic?
- Could users trigger the same action twice?

Mitigation:
- define transaction boundaries
- use backend validation and constraints
- isolate state transitions
- review rollback expectations

---

# 4. Security and Authorization Risk
This risk exists when the feature exposes data, depends on permissions, or changes session-sensitive behavior.

Typical signals:
- user-owned resources
- role-based access
- admin-only actions
- personal data
- token/session-dependent behavior
- data visibility by identity or tenant

Questions:
- Who can access this feature?
- Who can mutate this resource?
- Is ownership validated?
- Does the frontend assume access that backend does not guarantee?
- Could sensitive fields leak through responses or logs?

Mitigation:
- define permissions explicitly
- validate scope on backend
- minimize data exposure
- review auth and logout behavior
- audit serializer fields and logs

---

# 5. Migration and Data Evolution Risk
This risk exists when database structure changes or data must be transformed.

Typical signals:
- new models
- modified fields
- nullable to non-nullable transitions
- backfills
- relation changes
- large production tables

Questions:
- Does this require a migration?
- Could existing data break the new schema?
- Is backfill needed?
- Is rollback realistic?
- Could production data volume make this risky?

Mitigation:
- split migrations if needed
- avoid destructive changes without plan
- validate defaults and nullability
- plan data compatibility carefully

---

# 6. Query and Performance Risk
This risk exists when the feature may introduce expensive reads, heavy list rendering, or poor scalability.

Typical signals:
- list endpoints
- relation-heavy screens
- large datasets
- filters and sorting
- nested serializers
- slow-loading UI
- N+1 risk
- expensive calculations in render

Questions:
- Will this feature list many records?
- Does it rely on related data?
- Could it trigger N+1 queries?
- Does it need pagination?
- Could the UI feel slow even if the backend works?

Mitigation:
- review query strategy
- define pagination early
- align frontend loading states with expected latency
- optimize serializer/queryset shape
- reduce unnecessary payload size

---

# 7. UX Resilience Risk
This risk exists when the feature depends on remote state, long operations, or unstable connectivity.

Typical signals:
- async operations
- latency-sensitive flows
- network-dependent screens
- retry behavior not defined
- offline ambiguity
- no loading/error/empty states

Questions:
- What does the user see while waiting?
- What happens on timeout or disconnect?
- Is there a retry path?
- Is empty state defined?
- Is cached or last-known data needed?

Mitigation:
- define loading/error/empty states
- define retry behavior
- provide feedback for long operations
- decide whether cache or offline continuity is needed

---

# 8. Architectural Alignment Risk
This risk exists when the feature pressures the system toward shortcuts, layer violations, or inconsistent structure.

Typical signals:
- business logic leaking to frontend
- UI components doing networking directly
- backend HTTP layer carrying domain logic
- duplicated rules across layers
- feature-specific hacks
- pressure to bypass existing architecture

Questions:
- Is logic being placed in the right layer?
- Is this solution consistent with architecture skills?
- Is there duplication across frontend and backend?
- Does this introduce a workaround that will age poorly?

Mitigation:
- move logic to the correct layer
- separate presentation from orchestration
- use existing architecture patterns
- flag exceptions explicitly instead of hiding them

---

# 9. Refactor Dependency Risk
This risk exists when the feature looks implementable but actually depends on cleaning prior code first.

Typical signals:
- giant files
- mixed responsibilities
- no clear extension point
- fragile legacy code
- repeated hacks
- no safe place to add the new logic

Questions:
- Can the feature be added cleanly without prior cleanup?
- Is the current structure safe to extend?
- Would implementation be much riskier without a small refactor first?
- Should the refactor be isolated as a separate step?

Mitigation:
- identify prerequisite refactors early
- separate refactor from feature work
- keep refactor behavior-preserving
- do not hide structural debt inside the main feature

---

# 10. Delivery and Sequencing Risk
This risk exists when implementation order is unclear or dependencies are stacked poorly.

Typical signals:
- frontend blocked by undefined backend
- backend built without contract clarity
- testing deferred to the end
- commits too large
- multiple unknowns tackled simultaneously

Questions:
- Is the build order correct?
- Are prerequisites identified?
- Can the feature be split into milestones?
- Are commits likely to become too large?
- Is there a smaller safe first delivery?

Mitigation:
- define implementation sequence explicitly
- split into phases if needed
- isolate high-risk blocks
- propose atomic commits from the start

---

## Risk Summary Template
Use this structure when summarizing risks for a feature:

### Risk
Short risk name

### Severity
Low / Medium / High / Critical

### Why it matters
Explain the consequence if not handled

### Affected area
Frontend / Backend / Data / Security / UX / Delivery

### Mitigation
State the concrete action to reduce or isolate the risk

---

## Minimum Risk Review
Before closing a feature plan, confirm:

- functional ambiguity reviewed
- contracts reviewed
- security reviewed
- domain integrity reviewed
- performance reviewed
- resilience reviewed
- architectural alignment reviewed
- refactor prerequisites reviewed
- sequencing reviewed

---

## Anti-Patterns
Avoid:
- saying “no major risks” without review
- hiding uncertainty to make the plan sound stronger
- mixing risk with vague general advice
- describing risks without mitigation
- treating all risks as equally severe
- ignoring delivery risk because the technical solution looks correct