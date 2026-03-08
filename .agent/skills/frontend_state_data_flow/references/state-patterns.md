# State Patterns Reference

## Purpose
This reference defines how state should be structured and managed in the Domy frontend. It provides clear rules for deciding when to use local state, feature state, global session state, caching, and persistence. The goal is to keep the application predictable, maintainable, and resilient to network conditions.

---

## Core Principle
Choose the **smallest possible state scope** that correctly solves the problem.

State should only be elevated when:
- multiple components require the same data
- session context depends on it
- the data must persist across screens
- offline support or caching improves the user experience

Avoid global state unless it is truly global.

---

# Global State

## AuthContext
Use `AuthContext` for everything related to the active authenticated session.

This includes:

- authenticated user information
- authentication status
- login/logout lifecycle
- token availability
- session bootstrapping state

Example structure:

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
};

### Rules
- `AuthContext` must **only contain session-related data**
- Do not store unrelated domain data in `AuthContext`
- All screens should rely on this context to determine session state
- Token refresh or logout flows must be centralized

---

# Local State

Use local state for UI-specific or component-specific behavior.

Typical use cases:

- form inputs
- modal visibility
- toggles
- temporary filters
- local loading states
- UI interaction flags

Recommended tools:

- `useState`
- `useReducer` when the state has multiple transitions

Example:

const [loading, setLoading] = useState(false);
const [formValues, setFormValues] = useState<FormValues>();

---

# Feature State (Custom Hooks)

Feature state groups logic related to a screen or domain entity.

Use a **custom hook** when:

- data fetching is required
- retry logic exists
- the state contains loading/error/data
- multiple components in the same screen depend on the same logic

Example hook interface:

type ResourceState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

Example usage:

const { data, loading, error, reload } = useUserProfile();

Benefits:
- encapsulates logic
- separates UI from data flow
- improves reusability
- simplifies testing

---

# Caching Strategy

Caching improves perceived performance but **the backend remains the source of truth**.

Basic strategy:

1. Request data from the backend API.
2. Normalize or map the payload to frontend types.
3. Store it in feature state (`useState` or `useReducer`).
4. Optionally persist it if offline continuity is required.

Example flow:

API Request  
↓  
Mapper  
↓  
Feature Hook State  
↓  
Optional Persistence

### Cache Rules
- cached data is **not canonical truth**
- always define when cached data should refresh
- invalidate cache when the backend state changes
- do not rely on stale cache for sensitive operations

---

# Persistence Strategy

Use persistence only when the user experience benefits from it.

## AsyncStorage

Recommended for:

- session metadata
- lightweight cached entities
- user preferences
- last known state snapshots

Example uses:

- saved session tokens
- last opened screen state
- lightweight cached profile data

## SQLite

Recommended for:

- structured offline data
- large datasets
- relational offline queries
- synchronization queues

Use SQLite only when the complexity justifies it.

---

# Offline Support

Offline support should only be implemented where it improves UX.

Typical cases:

- cached profile data
- recently fetched lists
- draft content
- queued actions waiting for reconnection

Rules:

- never assume network availability
- provide feedback if the device is offline
- allow retry or recovery flows

---

# Standard Async State Pattern

Every async resource should expose a predictable structure.

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

This pattern ensures the UI can always represent:

- loading
- success
- failure
- empty data

---

# Decision Framework

## Use Local State When
- only one component needs the state
- it does not need persistence
- the state is UI-related

## Use Feature Hooks When
- multiple UI elements share the same logic
- remote data is involved
- retry logic or derived state exists

## Use AuthContext When
- the state represents session identity
- multiple screens depend on login status
- navigation depends on authentication

## Use Persistence When
- the data must survive app restarts
- offline support is required
- restoring the last known state improves UX

---

# Anti-Patterns

Avoid the following patterns:

- storing all application data in global context
- putting domain collections inside `AuthContext`
- duplicating the same remote state across multiple components
- persisting sensitive data unnecessarily
- mixing backend payloads directly into frontend state
- state structures without clear loading/error handling
- hooks that mix UI navigation, fetching, persistence, and rendering logic

---

# Required Checklist for New State Flows

Before implementing new state logic, define:

1. state scope (local, feature, global, persisted)
2. owner of data fetching logic
3. the exposed hook interface
4. loading, error, and empty state behavior
5. whether caching is required
6. whether persistence is required
7. when cached data becomes stale
8. how the system behaves if the network fails