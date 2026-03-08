# Navigation Patterns

## Pattern: Typed Stack
Always define a `RootStackParamList` in a central `navigation/types.ts` file.

## Rules
1. Never use `useNavigation<any>()`.
2. Map route parameters to specific interfaces.
3. Use `CompositeNavigationProp` for nested navigators.
