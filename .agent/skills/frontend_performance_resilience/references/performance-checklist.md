# Performance Checklist

## Rendering
- [ ] Are components memoized where necessary?
- [ ] Are keys in lists stable and unique?
- [ ] Are complex calculations inside `useMemo`?

## List Optimization
- [ ] Using `FlashList` for heavy lists?
- [ ] `getItemLayout` provided for predictable heights?
- [ ] `removeClippedSubviews` enabled for long lists?

## Memory
- [ ] Every `useEffect` subscription has a return cleanup?
- [ ] Images are resized or cached properly?
