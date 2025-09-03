# MUI Material Grid v6 Documentation

## Import Statement
```jsx
import Grid from '@mui/material/Grid2';
```

## Basic Usage

### Grid Container
```jsx
<Grid container>
  <Grid size={{ xs: 6, sm: 4, lg: 3 }} />
  <Grid size={{ xs: 6, sm: 4, lg: 3 }} />
  <Grid size={{ xs: 6, sm: 4, lg: 3 }} />
</Grid>
```

### Key Changes in v6
- The Grid component is now called `Grid2` in Material UI v6
- Uses `size` prop instead of individual breakpoint props (xs, sm, md, lg, xl)
- Uses `offset` prop for spacing
- The `true` value is now `"grow"`
- Removed `disableEqualOverflow` prop (behavior is now default)

### Size Prop Examples
```jsx
// Old v5 way
<Grid xs={12} sm={6} md={4} />

// New v6 way
<Grid size={{ xs: 12, sm: 6, md: 4 }} />

// Single value for all breakpoints
<Grid size={6} />

// Grow to fill available space
<Grid size="grow" />
```

### Offset Prop
```jsx
// Old v5 way
<Grid xsOffset={2} smOffset={3} />

// New v6 way
<Grid offset={{ xs: 2, sm: 3 }} />

// Single offset value
<Grid size={6} offset={2} />
```

### Nested Grids
```jsx
<Grid container spacing={2}>
  <Grid size={8}>
    Outer Grid Item 1
    <Grid container spacing={1}>
      <Grid size={6}>
        Inner Grid Item 1
      </Grid>
      <Grid size={6}>
        Inner Grid Item 2
      </Grid>
    </Grid>
  </Grid>
  <Grid size={4}>
    Outer Grid Item 2
  </Grid>
</Grid>
```

### Typography with NoWrap Fix
When using Typography with `noWrap` inside Grid items:
```jsx
<Grid item xs zeroMinWidth>
  <Typography noWrap>
    Long text that won't break the grid
  </Typography>
</Grid>
```

## Migration from v5 to v6

### Using Codemod
```bash
# For v6
npx @mui/codemod@latest v6.0.0/grid-v2-props <path/to/folder>

# For v7
npx @mui/codemod@next v7.0.0/grid-props <path/to/folder>
```

### Manual Migration Examples
```diff
 <Grid
-  xs={12}
-  sm={6}
-  xsOffset={2}
-  smOffset={3}
+  size={{ xs: 12, sm: 6 }}
+  offset={{ xs: 2, sm: 3 }}
 >

-<Grid xs>
+<Grid size="grow">

-<Grid disableEqualOverflow>
+<Grid>
```

## Advanced Features

### Custom Breakpoints
```jsx
// With custom breakpoints
<Grid size={{ mobile: 12, desktop: 6 }} offset={{ mobile: 2, desktop: 4 }} />
```

### Container Props
- `spacing`: Controls gap between items
- `columns`: Number of columns (default: 12)
- `direction`: row | row-reverse | column | column-reverse
- `wrap`: wrap | nowrap

### Item Props
- `size`: Responsive sizing object or single value
- `offset`: Responsive offset object or single value
- `zeroMinWidth`: Prevents text overflow issues

## CSS Grid Alternative
For more complex layouts, you can also use CSS Grid directly:
```jsx
<Box sx={{ display: 'grid' }}>…</Box>
<Box sx={{ display: 'inline-grid' }}>…</Box>
```

## Best Practices
1. Always use Grid2 for new projects in v6+
2. Use responsive size prop for mobile-first design
3. Leverage "grow" for flexible layouts
4. Use nested grids for complex layouts
5. Apply `zeroMinWidth` when using `noWrap` Typography