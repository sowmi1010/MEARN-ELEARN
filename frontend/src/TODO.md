# TODO List for Fixing Navbar and Admin Dashboard Issue

## Tasks
- [x] Update Navbar.jsx to display logged-in user's name and conditionally show links based on login state.
- [x] Update App.jsx to pass user info to Navbar.jsx.
- [ ] Test login as user and admin to verify navbar and dashboard display.
- [x] Add logout functionality in Navbar for normal users (removed as per user feedback).

## Notes
- Keep AdminLayout.jsx as is for admin users.
- Ensure routing in App.jsx remains unchanged for admin and user dashboards.
- Admin dashboard should only be accessible to admin users.
- Updated Navbar to show only "Welcome, {user.name}" for logged-in users as per user feedback.
