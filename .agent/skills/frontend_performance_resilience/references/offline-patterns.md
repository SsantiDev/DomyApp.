# Offline Patterns

## Feedback Optimista
1. Trigger action.
2. Update local UI immediately.
3. Sync in background.
4. Rollback if API fails.

## Retry Strategy
- Use exponential backoff for background sync.
- Provide manual "Retry" button for user-facing errors.

## Caching
- Cache critical data (Profile, Recent activities) to show something on first launch without network.
