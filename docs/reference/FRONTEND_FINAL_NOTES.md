# Frontend Final Notes

- The hero artwork and landing artwork are used as full-width background images with `background-size: cover`, not as side `<img>` cards.
- Navigation uses Lucide React icons rather than a custom icon sheet.
- There is one authentication page for all roles. A normal admin account is redirected to the admin workspace after successful authentication; customers are redirected to the customer dashboard. No separate customer/admin role-selection screen is shown.
- Google Sign-In is available on login/register. Add the same Google Web Client ID to `VITE_GOOGLE_CLIENT_ID` (frontend) and `GOOGLE_CLIENT_ID` (backend).
- Toast notifications are used for authentication, purchase, renewal, cancellation and admin actions.
- Admin dashboard data loading uses explicit error states and retry instead of an endless spinner when an API request fails.
- The source guide's core workflows remain the focus: authentication, plans, premium calculation, purchase, renewal, cancellation approval, policy history, roles and validation.
