# API Contracts Reference

## Purpose
This reference defines how frontend code in Domy should consume backend APIs safely and consistently. Use it when implementing API clients, hooks, auth flows, payload mapping, response typing, and error handling.

## General contract rules

### 1. Naming convention
- Backend payloads use `snake_case`
- Frontend TypeScript models use `camelCase`
- Mapping between backend and frontend must be explicit
- Do not leak raw backend naming conventions into UI components unless strictly necessary

### 2. Response typing
- Every API response consumed by the frontend must have a typed contract
- Prefer explicit TypeScript interfaces or types for:
  - request payloads
  - success responses
  - error payloads
  - paginated responses
- Prefer wrapping responses in a shared `Result<T>` or equivalent response abstraction when the project pattern supports it

### 3. Error handling
- Handle `401 Unauthorized` globally and redirect to logout or token refresh flow according to the auth protocol
- Handle `403 Forbidden` as permission/access failure, not as session failure
- Handle `404` as missing resource
- Handle `422` or validation-style errors as user-correctable input problems when applicable
- Avoid showing raw backend error messages directly to end users unless sanitized

### 4. Auth contract
- Access token and refresh token flows must be centralized
- Do not duplicate auth recovery logic across multiple screens
- API clients must consistently attach auth headers where required
- Expired session behavior must be predictable across the app

### 5. API consumption rules
- UI components should not call raw endpoints directly if the flow is reusable
- Prefer encapsulating endpoint consumption in hooks, services, or client functions
- Request/response mapping must happen before data reaches presentation components
- Components should consume frontend-friendly typed models, not raw transport payloads

---

## Auth

### POST /api/auth/login/

#### Request
{
  "email": "string",
  "password": "string"
}

#### Response
{
  "access": "string",
  "refresh": "string",
  "user": {}
}

#### Frontend contract notes
- Persist tokens according to the app auth strategy
- Normalize returned user object before storing it in session state if needed
- Trigger global authenticated state update after successful login
- Handle invalid credentials as user-facing authentication error, not as unknown failure

#### Suggested TypeScript types

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  access: string;
  refresh: string;
  user: User;
};

---

## Profiles

### GET /api/users/profile/

#### Response
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "role": "admin"
}

#### Frontend contract notes
- Map first_name -> firstName
- Map last_name -> lastName
- Do not pass raw backend profile payload directly to UI
- Profile retrieval failures should distinguish:
  - session expired
  - no permission
  - network failure
  - unknown error

#### Suggested TypeScript types

type BackendProfile = {
  id: number;
  first_name: string;
  last_name: string;
  role: string;
};

type UserProfile = {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
};

#### Example mapper

const mapProfile = (payload: BackendProfile): UserProfile => ({
  id: payload.id,
  firstName: payload.first_name,
  lastName: payload.last_name,
  role: payload.role,
});

---

## Shared frontend contract patterns

### Result wrapper
Use a shared wrapper when the app benefits from predictable status handling.

type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: number };

Use this when:
- the hook must standardize success/error branches
- multiple screens consume the same endpoint pattern
- the UI needs a predictable branching model

---

### Paginated response pattern
Define a standard paginated type if the backend uses paginated lists.

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

---

### Mutation result pattern
For create/update/delete flows, define explicit success and validation handling.

type MutationResult<T> =
  | { ok: true; data: T }
  | { ok: false; validationErrors?: Record<string, string[]>; error?: string };

---

## Required decisions for every new endpoint
For each new endpoint integrated in frontend, define:

1. request type
2. response type
3. backend-to-frontend mapper
4. auth requirement
5. global vs local error handling
6. retry behavior
7. cacheability
8. session impact if it fails with 401

---

## Anti-patterns
- Using raw backend payloads directly in components
- Mixing snake_case backend fields into UI state without mapping
- Handling auth expiration differently in each screen
- Returning `any` from API functions
- Hiding HTTP semantics inside vague booleans without typed context
- Coupling transport shape too tightly to presentation components