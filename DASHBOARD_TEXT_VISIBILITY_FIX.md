# Dashboard Text Visibility Fix

## Issues Identified

Some texts in the dashboard page weren't visible:
1. "Your Progress Overview"
2. "Continue Where You Left Off"
3. "Recommended Job Openings"

The issue was that the CSS utility classes `text-text-primary` and `text-text-secondary` were missing, which are used throughout the dashboard to apply proper text colors based on the theme.

## Changes Made

### 1. CSS Styles (`index.css`)
- Added missing utility classes to map Tailwind classes to CSS variables:
  - `.text-text-primary` maps to `var(--text-primary)`
  - `.text-text-secondary` maps to `var(--text-secondary)`
- These classes ensure proper text coloring in both light and dark modes

## Improvements

1. **Proper Text Mapping**: Added missing CSS utility classes to ensure `text-text-primary` and `text-text-secondary` work correctly
2. **Enhanced Visibility**: All dashboard text elements now have proper contrast in both light and dark modes
3. **Consistent Styling**: Applied uniform text styling across all text elements in the dashboard

## Testing

To test these changes:

1. Open the application in both light and dark modes
2. Navigate to the Dashboard page
3. Verify that all text elements are clearly visible:
   - "Your Progress Overview" heading
   - "Continue Where You Left Off" heading
   - "Recommended Job Openings" heading
   - All stat card titles and values
   - All other text elements in the dashboard

4. Toggle between light and dark modes - verify that text remains readable in both themes

## Files Modified

- `index.css`

These changes ensure that all text content in the dashboard is clearly visible and readable in both light and dark modes, with proper contrast and appropriate coloring for each text element.