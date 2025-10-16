# Remove Header and Footer from Pages

## Changes Made

Updated the routing in App.tsx to remove header and footer from the following pages:
- Courses page
- Jobs page (Job Board)
- Messages page
- Progress page
- Profile page

### Files Modified

- `App.tsx`

## Details

The routing configuration was updated to use DashboardLayout instead of Layout for the specified pages. The DashboardLayout only includes:
- Sidebar navigation
- Main content area

This removes both the header and footer components from these pages, as required by the project specifications.

## Testing

To test this change:

1. Open the application and log in
2. Navigate to each of the affected pages:
   - Courses (/courses)
   - Jobs (/jobs)
   - Messages (/messages)
   - Progress (/progress)
   - Profile (/profile)
3. Verify that:
   - Header is no longer visible
   - Footer is no longer visible
   - Sidebar navigation is still present
   - Main content area is properly displayed
   - Navigation between pages works correctly

## Impact

This change implements the project requirement that when a user is logged in, the dashboard should only display the sidebar and main content area, without header and footer components. This creates a cleaner, more focused interface for logged-in users while maintaining access to all necessary navigation elements through the sidebar.