# Source Requirements and UI Reference

This project was prepared from the supplied InsureHub project guide/PDF and the supplied InsureHub visual reference image.

The guide requires the complete web application to include customer/admin roles, JWT authentication, plans, premium calculation, policy purchase, renewal, cancellation request/approval, history, validation, testing and Swagger/OpenAPI documentation.

The guide's recommended repository blueprint is `backend/`, `frontend/`, `docs/architecture/`, `docs/database/`, `docs/api/`, `docs/screenshots/` and `docs/project-report/`.

The visual reference is used for the frontend design language: navy/royal-blue branding, mint/teal accent, shield imagery, rounded information cards, status badges, insurance-type icons, a large family hero banner, and the "Secure Today • Brighter Tomorrow" message.

The guide also lists React/Spring official documentation and notes that Create React App is deprecated; this implementation uses Vite for the React build. The final frontend uses Lucide React icons and toast notifications for interface feedback.

## External inspiration

Public reference sites used only for general customer-journey inspiration are documented in `REAL_WORLD_REFERENCES.md` (Policybazaar and LIC of India). No proprietary code or credentials are included.

## Frontend interpretation

- The provided brand sheet is treated as a visual system rather than a literal component sheet: the hero and landing artwork are rendered as full-bleed backgrounds, while interface icons come from `lucide-react`.
- Authentication intentionally uses one shared login/register experience. The account role returned by the backend controls access; the source guide does not specify a customer/admin selection screen.
- Google Sign-In is an additional authentication method and requires a Google Web Client ID; the source guide itself specifies JWT/password authentication but does not prohibit additional authentication providers.
