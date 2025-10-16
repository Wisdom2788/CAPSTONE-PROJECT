# Course Card Text Visibility Fix

## Issues Identified

The contents/texts in the course cards weren't visible due to:
1. Missing CSS utility classes for `text-text-primary` and `text-text-secondary` 
2. Text colors not properly mapped to CSS variables
3. Insufficient contrast in dark mode

## Changes Made

### 1. CSS Styles (`index.css`)
- Added missing utility classes to map Tailwind classes to CSS variables:
  - `.text-text-primary` maps to `var(--text-primary)`
  - `.text-text-secondary` maps to `var(--text-secondary)`
- These classes ensure proper text coloring in both light and dark modes

### 2. CourseCard Component (`components/CourseCard.tsx`)
- Added explicit dark mode text colors for better visibility:
  - Category text: `dark:text-blue-400`
  - Title text: `dark:text-white`
  - Instructor text: `dark:text-gray-300`
  - Secondary text (rating, duration): `dark:text-gray-300`
  - Star icon: `dark:text-yellow-400`
  - Clock icon: `dark:text-gray-300`
- Ensured proper contrast for all text elements in both light and dark modes

## Improvements

1. **Proper Text Mapping**: Added missing CSS utility classes to ensure `text-text-primary` and `text-text-secondary` work correctly
2. **Enhanced Dark Mode Visibility**: Added explicit dark mode text colors for better contrast
3. **Consistent Styling**: Applied uniform text styling across all text elements in the card
4. **Fallback Colors**: Added specific colors for dark mode to ensure readability

## Testing

To test these changes:

1. Open the application in both light and dark modes
2. Navigate to the Courses page - verify that all text in course cards is clearly visible
3. Check the Dashboard page - verify that course cards in "Continue Where You Left Off" section have visible text
4. Toggle between light and dark modes - verify that text remains readable in both themes
5. Check all text elements:
   - Course category
   - Course title
   - Instructor name
   - Rating
   - Duration

## Files Modified

- `components/CourseCard.tsx`
- `index.css`

These changes ensure that all text content in course cards is clearly visible and readable in both light and dark modes, with proper contrast and appropriate coloring for each text element.