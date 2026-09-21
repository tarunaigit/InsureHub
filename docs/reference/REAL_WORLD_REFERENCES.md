# Real-world product references used for UI/workflow inspiration

This academic project does not copy proprietary code, branding, wording, rates, underwriting rules, or private APIs from other insurers. The references below were used only to model familiar customer journeys.

## Policybazaar
Official site: https://www.policybazaar.com/

Observed public-facing patterns useful for InsureHub:
- Insurance categories such as health, term/life, motor and travel.
- Plan discovery/comparison before purchase.
- Online purchase and policy servicing/renewal journeys.

## LIC of India
Official site: https://licindia.in/
Insurance plans: https://licindia.in/en/web/guest/insurance-plan
Buy online: https://licindia.in/en/buy-online

Observed public-facing patterns useful for InsureHub:
- Category-based plan browsing.
- Product detail pages.
- Online purchase/service flows for policyholders.

## What InsureHub implements
The final UI combines those general patterns with the supplied InsureHub visual reference: navy/blue branding, mint/teal accent, shield imagery, rounded cards, insurance-type categories, status badges, dashboard summaries, and a clear customer policy lifecycle.

All premium calculations in InsureHub are project-defined educational simulations, not real insurer underwriting formulas.

## Authentication reference

Google Sign-In uses Google's Identity Services for Web. The browser receives a Google ID-token credential and sends it to InsureHub's backend; the backend verifies the token before issuing its own JWT. See Google's current Sign in with Google JavaScript API reference for the required Web Client ID and credential-response flow.
