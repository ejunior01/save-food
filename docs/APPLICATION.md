# DespensaCerta Application Documentation

This document consolidates the current application state with the product scope described in `Doc final.pdf` and `Teste PI.pptx`. It is intended to guide design and development decisions for the next iterations.

For implementation and design-generation context, use this document together with:

- `CONTEXT.md`: canonical domain language and glossary.
- `docs/DESIGN_AND_DEVELOPMENT_CONTEXT.md`: practical UX, UI, flow, data, and component guidance.

## Product Definition

DespensaCerta is a mobile application for organizing household food, tracking expiry dates, planning shopping, and reducing domestic food waste. The product promise is: more control in the household routine, less waste, and more savings.

The primary audience is families, students and young adults living independently, people with busy routines, household shoppers, and conscious consumers who value sustainability.

The MVP should validate whether users can reliably:

- Register food manually and by barcode.
- Track expiry dates before food is wasted.
- Organize food by category and storage location.
- Use available or expiring food through recipe suggestions.
- Maintain a shopping list without duplicating what is already stored.

## Source Alignment

The PDF defines a 2026 technical report for a React Native mobile application with authentication, services, database, notifications, and privacy/security requirements. The PPTX defines the academic pitch and MVP value: organization, economy, sustainability, and ODS 12 alignment.

Important source requirements:

- Expiry alerts at 30, 15, and 5 days before expiry.
- Storage locations such as pantry, refrigerator, and freezer.
- User account and login.
- Barcode-based registration.
- Manual product registration.
- Recipe suggestions based on available and near-expiry food.
- Shopping list creation and updates.
- Privacy, access control, and LGPD-aligned data handling.
- Future premium plan with personalization, reports, and fuller experience.

## Current Implementation

The application is an Expo/React Native app in `mobile/`, using React Navigation, React Query, AsyncStorage, Expo Camera, bottom sheets, Zod, React Hook Form, and Host Grotesk fonts.

Implemented user flows:

- Onboarding with three slides: reduce waste, scan and organize, cook with what is available.
- Login and sign-up screens with form validation and terms acceptance.
- In-memory/local authentication state through `AuthContext`.
- Home dashboard with pantry summary, quick actions, expiring food, and recipe cards.
- Barcode scanner using Expo Camera and Open Food Facts lookup.
- Manual food registration from the scanner screen.
- Food storage in AsyncStorage.
- Default storage location, with premium-gated custom locations.
- Expiry status calculation and in-app labels.
- Alerts screen with filters for all, expired, urgent, and attention states.
- "Use now" and "Discard" actions that remove the food item.
- Recipe list, search, category filter, featured recipe, and recipe detail route.
- Shopping list grouped by category, with add/edit, quantity stepper, check-off progress, and delete.
- Seed data for pantry, recipes, shopping list, and storage locations.
- Basic free/premium plan state, including premium upsell for storage locations.

Current technical boundaries:

- Data is local-only in AsyncStorage.
- Authentication is simulated and does not create a persisted user identity.
- Recipes are seeded/static, not generated from the actual pantry.
- Expiry alerts are visual in-app states, not scheduled push notifications.
- Barcode lookup depends on Open Food Facts and falls back to manual entry when not found.

## Gap Analysis

### MVP Coverage

| Requirement | Current status | Notes |
|---|---:|---|
| User onboarding | Done | Matches product narrative. |
| User sign-up/login | Partial | UI and validation exist, but no real account, session persistence, password storage, or backend. |
| Manual food registration | Partial | Exists, but only captures name and days until expiry; category, quantity, unit, and exact date are limited/defaulted. |
| Barcode registration | Partial | Camera and Open Food Facts lookup exist; product confirmation exists. Needs stronger error states and editable category/unit fields. |
| Expiry date registration | Partial | Uses "days from today" instead of explicit calendar date. |
| Expiry alerts | Partial | In-app filtering exists for expired/<=3/<=7 days. Source scope requires 30/15/5-day preventive alerts and notification delivery. |
| Organization by category | Partial | Categories exist and are displayed, but pantry browsing by category is limited. |
| Organization by storage location | Partial | Data model and picker exist. Free plan has only default pantry; premium custom locations exist. Needs first-class location views. |
| Recipe suggestions | Partial | Recipe browsing exists, but suggestions are static and not matched to pantry/expiry data. |
| Shopping list | Done for local MVP | Add, edit, quantity, check, group, and delete exist locally. |
| Data persistence | Partial | Local device persistence exists; no multi-device account storage. |
| Privacy/LGPD | Partial | Terms/privacy text is referenced in UI, but no actual policy flow, consent record, user data export, or deletion workflow. |
| Managerial indicators | Not started | PDF indicators such as most expired products, losses by location, alert effectiveness, and estimated savings are absent. |
| Monetization | Partial | Free/premium state and one premium gate exist. No payment, subscription, ads, or reporting features. |

### Key Contradictions To Resolve

The alert thresholds conflict: the documents require 30, 15, and 5 days, while the app currently uses expired/today, 1-3 days, and 4-7 days. Recommended resolution: keep the visual urgency states for daily use, but implement scheduled preventive Expiry Alerts at 30/15/5 days as the formal MVP requirement.

The source documents position storage locations as a core MVP feature, while the current app gates custom storage locations behind premium. Recommended resolution: include pantry, refrigerator, and freezer in the free MVP; reserve advanced custom locations and analytics for Premium.

The product promise says recipes use available items, but the app shows seeded recipes independent of pantry inventory. Recommended resolution: define recipe suggestion ranking by matching recipe ingredients to Food Items, with higher priority for near-expiry items.

## Design Direction

The visual identity should be household, practical, and sustainability-oriented. The current green palette, soft background, rounded surfaces, food imagery, and Host Grotesk typography are aligned with the product. Avoid making the app feel like a generic finance or productivity dashboard.

Recommended design principles:

- Make expiry urgency scannable before any other detail.
- Keep food registration short enough to happen right after shopping.
- Prefer explicit dates for accuracy, but support quick presets such as 5, 15, and 30 days.
- Show "what to use next" more prominently than generic inventory counts.
- Treat storage locations as household spaces, not technical folders.
- Use recipe suggestions as action prompts for reducing waste, not as a generic cookbook.
- Keep premium prompts rare and tied to clear extra value.

Primary navigation should remain:

- Home: summary, urgent food, suggested recipes, quick actions.
- Alerts: expiry-focused action queue.
- Scanner/Add: barcode and manual registration.
- Recipes: suggestions and recipe discovery.
- Shopping List: replenishment planning.

Recommended future pantry view:

- Add a dedicated "Despensa" or inventory screen if the product needs full item management beyond the alert queue.
- Group by storage location first, then category.
- Support search, edit, consume, discard, and move location.

## Feature Specifications

### Food Registration

Required fields for MVP:

- Name.
- Expiry date.
- Quantity.
- Unit.
- Category.
- Storage location.
- Optional barcode.

Recommended interactions:

- Barcode lookup pre-fills name, category, quantity, unit, and brand when available.
- User must confirm or correct expiry date.
- Manual mode should expose the same final fields as barcode mode.
- Expiry date input should support a calendar and quick presets.

### Expiry Alerts

The domain requirement is preventive alerts at 30, 15, and 5 days before expiry. The UI can additionally classify urgency:

- Expired: expiry date is today or past.
- Urgent: 1-5 days left.
- Upcoming: 6-15 days left.
- Planned: 16-30 days left.
- Safe: more than 30 days left.

Development tasks:

- Add alert schedule records or computed alert jobs.
- Add local push notification permission flow.
- Schedule notifications when a Food Item is created or its expiry date changes.
- Cancel/reschedule notifications when a Food Item is consumed, discarded, deleted, or edited.

### Storage Locations

MVP storage locations should include pantry, refrigerator, and freezer. Premium can add unlimited custom locations, icons, and location-level analytics.

Required item actions:

- Assign location during registration.
- Move item between locations.
- Filter inventory and alerts by location.
- Show location in item detail/list rows.

### Recipe Suggestions

A Recipe Suggestion should be ranked by:

- Number of matched Food Items.
- Presence of urgent or expired-soon Food Items.
- Missing ingredients count.
- Preparation time.

Recommended recipe states:

- "You have everything."
- "Missing 1-2 items."
- "Uses food expiring soon."

### Shopping List

The current shopping list is a strong local MVP. Next improvements:

- Add missing recipe ingredients to the shopping list.
- Warn when the user adds a Shopping Item that already exists as a Food Item.
- Convert checked Shopping Items into Food Items after purchase.
- Preserve category and quantity during conversion.

### Account, Privacy, And Data

For a public version, authentication must move beyond local state.

Required capabilities:

- Real account creation and login.
- Password reset or passwordless flow.
- User-scoped data storage.
- Terms and privacy policy screens.
- Consent timestamp for terms acceptance.
- Delete account/data request flow.
- Data isolation tests.

## Development Roadmap

### Phase 1 - MVP Hardening

- Replace simulated authentication with persistent user identity.
- Add explicit expiry date picker and complete manual food form.
- Align expiry thresholds with 30/15/5-day preventive alerts.
- Make pantry, refrigerator, and freezer available in the free MVP.
- Add edit flow for Food Items.
- Add inventory browsing by location/category.
- Match recipe suggestions to pantry items.
- Add basic local notification scheduling.

### Phase 2 - Product Validation

- Add analytics for most expired foods, location with most losses, alert usage, and shopping duplication.
- Add "used" vs "discarded" outcomes instead of only deleting items.
- Add estimated savings input and reporting.
- Add user testing instrumentation and feedback capture.
- Improve empty states and error states for offline/barcode failures.

### Phase 3 - Premium And Scale

- Add custom storage locations as a premium feature after core locations are free.
- Add reports for savings, waste avoided, and consumption patterns.
- Add cloud sync and backup.
- Add subscriptions/payments.
- Evaluate ads/partnerships only if they do not reduce trust or usability.

## Technical Recommendations

Keep the current layered structure: screens, components, hooks, services, storage, context, and navigation. The separation is understandable and already supports incremental development.

Short-term changes can still use AsyncStorage, but introduce repository interfaces before moving to a backend. That will make the eventual transition to cloud storage less invasive.

Recommended domain model additions:

- `barcode?: string` on Food Item.
- `brand?: string` on Food Item.
- `createdAt`, `updatedAt`, and optional `consumedAt` / `discardedAt`.
- `status` or event history for used/discarded outcomes.
- `expiryAlertOffsets` or generated alert records.
- `estimatedValue` for savings reports.

Recommended tests:

- Expiry day calculation around today, tomorrow, past dates, and timezone boundaries.
- Expiry status thresholds.
- Food create/update/delete flows.
- Shopping item create/edit/toggle/delete flows.
- Recipe matching and ranking.
- Storage location default handling and premium restrictions.

## Open Questions

1. Should the product name in the app remain "Save Food" internally or become "DespensaCerta" everywhere?
   Recommended answer: use "DespensaCerta" for user-facing copy and keep package/internal names only where renaming would be disruptive.

2. Are 30/15/5-day alerts mandatory for all food, or should users customize alert offsets?
   Recommended answer: ship 30/15/5 as defaults and add customization as Premium later.

3. Should free users have refrigerator and freezer locations?
   Recommended answer: yes; these are core to the MVP and the PDF explicitly names them.

4. Should "Usar agora" mean consumed immediately or opened a recipe flow?
   Recommended answer: for MVP, mark as consumed; later offer recipes before consumption.

5. Should discarded food be deleted or retained for waste analytics?
   Recommended answer: retain a discarded outcome record so managerial indicators and savings/waste reports can exist.
