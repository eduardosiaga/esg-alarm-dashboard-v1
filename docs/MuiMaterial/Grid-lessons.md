# Grid Component - Lessons Learned

## Key Takeaways from MUI v6 Grid

### 1. Grid2 is the New Standard
- In Material UI v6, use `Grid2` instead of the old `Grid` component
- Import from `@mui/material/Grid2`
- The old Grid is deprecated and will be removed in future versions

### 2. Simplified Props API
**Problem**: v5 had too many breakpoint-specific props (xs, sm, md, lg, xl, xsOffset, smOffset, etc.)
**Solution**: v6 consolidates into `size` and `offset` props that accept objects

```jsx
// ❌ Old way (v5)
<Grid xs={12} sm={6} md={4} xsOffset={2} smOffset={1} />

// ✅ New way (v6)
<Grid size={{ xs: 12, sm: 6, md: 4 }} offset={{ xs: 2, sm: 1 }} />
```

### 3. The "grow" Value
**Problem**: `<Grid xs>` was confusing - what does boolean true mean for a size?
**Solution**: Renamed to the more descriptive `size="grow"`

```jsx
// ❌ Old
<Grid xs />

// ✅ New
<Grid size="grow" />
```

### 4. Typography NoWrap Issue
**Problem**: Typography with `noWrap` can break Grid layouts due to `min-width: auto`
**Solution**: Add `zeroMinWidth` prop to the Grid item

```jsx
<Grid item xs zeroMinWidth>
  <Typography noWrap>
    This long text won't break the grid layout
  </Typography>
</Grid>
```

### 5. Nested Grids Inherit Properties
- Nested Grid containers inherit `columns` and `spacing` from parent
- Must be direct children to maintain inheritance
- Can override parent properties if needed

### 6. Spacing Uses CSS Gap
**Change**: v6 uses CSS `gap` property instead of negative margins
**Benefit**: More predictable spacing and better browser support
**Impact**: Grid items no longer include spacing within their boxes

### 7. Migration Tools Available
- Use codemods for automatic migration
- Different commands for v6 and v7
- Can specify custom breakpoints

```bash
npx @mui/codemod@latest v6.0.0/grid-v2-props <path>
```

## Common Pitfalls to Avoid

1. **Don't mix Grid v1 and Grid2** - Use one consistently
2. **Don't forget responsive design** - Always consider mobile-first
3. **Don't overuse nested grids** - Can lead to complex, hard-to-maintain layouts
4. **Don't ignore zeroMinWidth** - Essential for text overflow scenarios

## Performance Tips

1. Use `size="grow"` sparingly - Can cause layout recalculations
2. Minimize nesting depth - Each level adds complexity
3. Use CSS Grid directly for very complex layouts
4. Consider virtualization for grids with many items

## Dashboard-Specific Lessons

For dashboard layouts:
1. Use consistent spacing (typically 2 or 3)
2. Mobile-first approach: `size={{ xs: 12, sm: 6, md: 4, lg: 3 }}`
3. Group related cards in nested grids
4. Use `size="grow"` for flexible sidebar/content layouts

## Testing Considerations

1. Test at all breakpoints (xs, sm, md, lg, xl)
2. Verify text overflow handling
3. Check nested grid alignment
4. Validate responsive behavior on actual devices