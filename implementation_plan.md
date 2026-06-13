# Implementation Plan - Premium Unified SaaS Design System

Update the entire IdleAxe frontend UI to adhere to a premium, unified SaaS design system inspired by Stripe and Apple. The core identity is a clean white/light neutral background, obsidian/charcoal text, and vibrant cyber-emerald green accents.

## User Review Required

> [!IMPORTANT]
> The landing page currently on the `main` branch (`LandingPage.jsx`) is a single, self-contained file with basic features/stats, whereas the repository contains high-fidelity landing subcomponents (`HeroSection`, `LiveSwarmExecution`, `AIReasoningSection`, etc.) that are modular but unused. We plan to restore the modular assembly for `LandingPage.jsx` using these subcomponents, refactoring all of them to fit the new premium green-and-white theme.

> [!WARNING]
> We will remove the static flowchart from the landing page completely (deleting the flow diagram mockup inside the hero) and ensure that no flowchart/diagram components are loaded. We will also remove the "Workflow" and "Governance" buttons or navigation items from the landing page navigation/hero section to simplify the user journey.

## Open Questions

> [!NOTE]
> Are there any additional pages (e.g., login, settings) that require specific styling beyond the landing page, signup page, and dashboard? If so, we will apply the design tokens globally to cover those as well.

---

## Proposed Changes

### Global Styling

#### [MODIFY] [index.css](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/assets/index.css)
- Update CSS variables/tokens (`:root`) to reflect the new premium green-and-white theme:
  - Primary accents: Cyber-emerald green (`#10b981` / `#059669`).
  - Backgrounds: Pristine white (`#ffffff`) and soft neutral gray/green-tinted backgrounds (`#f8fafc` / `#f4fbf7`).
  - Text: Obsidian/Charcoal (`#0f172a` / `#1e293b` / `#334155`).
  - Borders: Clean light gray (`#f1f5f9` / `#e2e8f0`).
- Update default button classes (`btn-primary`, `btn-secondary`) and cards (`saas-card`) to match the minimalist SaaS aesthetics (spacious, rounded corners, subtle shadows, and smooth hover translations).

---

### Landing Page Components

#### [MODIFY] [LandingPage.jsx](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/pages/landing/LandingPage.jsx)
- Reconstruct the page to import and render the high-fidelity modular sections:
  - `HeroSection`
  - `LiveSavingsBanner`
  - `ProblemSection`
  - `SensePlanActSection`
  - `LiveSwarmExecution`
  - `AIReasoningSection`
  - `ArchitectureSection`
  - `TestimonialsSection`
  - `FinalCTA`
  - `Footer`
- Re-style the page wrapper with the light background and grid pattern.
- Update navigation header to use `IdleAxeLogo` correctly and have a clean layout (removing "Workflow" and "Governance" buttons/links).

#### [MODIFY] [HeroSection.jsx](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/components/landing/HeroSection.jsx)
- Convert to white/light-gray background and obsidian text.
- Remove the right-side flowchart/diagram entirely. Re-center the hero copy or pair it with a sleek, minimalist product UI mock-up.
- Update action buttons to use the emerald green accent.

#### [MODIFY] [LiveSavingsBanner.jsx](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/components/landing/LiveSavingsBanner.jsx)
- Shift to light gray/emerald background (`bg-emerald-50/40`) with dark text and emerald green stats.

#### [MODIFY] [ProblemSection.jsx](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/components/landing/ProblemSection.jsx)
- Apply light background, dark titles, and emerald green accents to the problem cards.

#### [MODIFY] [SensePlanActSection.jsx](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/components/landing/SensePlanActSection.jsx)
- Change to a light background, white cards with subtle borders/shadows, and use variations of emerald green and charcoal instead of blue, purple, and red for the SENSE, PLAN, and ACT columns.

#### [MODIFY] [LiveSwarmExecution.jsx](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/components/landing/LiveSwarmExecution.jsx)
- Update the section to use a clean light background and obsidian text.
- Maintain the code terminal aesthetic (using a dark slate theme) but update any highlights/glows to use emerald green.
- Refactor the infrastructure visualization to use emerald green/gray status accents instead of blue/red.

#### [MODIFY] [AIReasoningSection.jsx](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/components/landing/AIReasoningSection.jsx)
- Update background to light neutral.
- Re-style the mock-up card using white/light gray backgrounds, obsidian text, and emerald green accents for decision badges, progress bars, and score values.

#### [MODIFY] [ArchitectureSection.jsx](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/components/landing/ArchitectureSection.jsx)
- Transition to light background. Replace card colors (blue, indigo, purple, red, amber) with consistent light emerald / obsidian borders and icons.

#### [MODIFY] [TestimonialsSection.jsx](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/components/landing/TestimonialsSection.jsx)
- Re-style with light background, white quote cards, and emerald green star ratings.

#### [MODIFY] [FinalCTA.jsx](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/components/landing/FinalCTA.jsx)
- Convert section to light background.
- Refactor the right-side execution policy card to use a white background with thin borders and emerald highlights instead of the dark/black card style.

#### [MODIFY] [Footer.jsx](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/components/landing/Footer.jsx)
- Update to a clean white background with a light border (`border-t border-gray-100`) and use the `IdleAxeLogo` component for proper branding.

---

### Signup Page Redesign

#### [MODIFY] [SignupPage.jsx](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/pages/signup/SignupPage.jsx)
- Remove the white card container (`rounded-2xl border border-gray-100 bg-white p-8 shadow-lg`) surrounding the signup form to allow it to blend seamlessly into the page.
- Re-style input fields to use simple, elegant borders, crisp focus states (emerald ring), and plenty of whitespace.
- Maintain a centered, responsive layout with clean typography.

---

### Dashboard Theme Update

#### [MODIFY] [DashboardLayout.jsx](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/layouts/DashboardLayout.jsx)
- Update page-level container style (`bg-[#F5F7FA]`) to a slightly brighter/cleaner neutral background (`bg-[#f8fafc]`).

#### [MODIFY] [KPICard.jsx](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/components/KPICard.jsx)
- Update KPI card background/borders. Replace blue/red/amber accent states with emerald green styles for unified dashboard metrics.

#### [MODIFY] [CloudSavingsChart.jsx](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/components/CloudSavingsChart.jsx)
- Replace blue accent color (`#2563EB`) on the trend line and dots with emerald green (`#10b981`).

#### [MODIFY] [ResourceStatusChart.jsx](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/components/ResourceStatusChart.jsx)
- Refactor pie chart cells to use a unified emerald/gray palette: `['#10b981', '#34d399', '#a7f3d0', '#64748b']` (representing active, flagged, pending, and terminated states respectively) instead of blue/amber/red.

#### [MODIFY] [AgentActivityChart.jsx](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/components/AgentActivityChart.jsx)
- Update area chart gradient/stroke colors (previously blue `#2563EB`, purple `#8B5CF6`, and green `#10B981`) to a cyber-emerald monochromatic theme: `#059669` (Audit), `#10b981` (Context), and `#6ee7b7` (Guard).

#### [MODIFY] [TopWasteChart.jsx](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/components/TopWasteChart.jsx)
- Replace red colors (`#EF4444` and `#FCA5A5`) with custom emerald green accents (`#10b981` for top source, `#a7f3d0` for others) to fit the unified palette.

#### [MODIFY] [MonthlyCostReduction.jsx](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/components/MonthlyCostReduction.jsx)
- Replace blue radial progress fill (`#2563EB`) with cyber-emerald green (`#10b981`).

#### [MODIFY] [LiveAuditFeed.jsx](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/components/LiveAuditFeed.jsx)
- Change the live status indicator colors from blue (`bg-blue-400`, `bg-blue-500`) to green (`bg-emerald-400`, `bg-emerald-500`).

#### [MODIFY] [ApprovalQueue.jsx](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/components/ApprovalQueue.jsx)
- Fix the missing `CheckSquare` import from `'lucide-react'`.
- Replace the blue hover border (`hover:border-blue-200`) with emerald (`hover:border-emerald-200`).
- Update button styles to use the clean primary/secondary theme.

#### [MODIFY] [InfrastructureGraph.jsx](file:///c:/Users/sizzl/Desktop/Idleaxe/IdleAxe/frontend/src/components/InfrastructureGraph.jsx)
- Re-theme node styles to use emerald, teal, and slate/gray backgrounds rather than the rainbow of blue, indigo, purple, red, and amber.
- Update connection path active stroke colors from blue/purple/amber to matching shades of emerald.

---

## Verification Plan

### Automated Verification
- Verify that the development server compiles successfully after changes:
  `npm run build` or inspect output logs in `frontend/vite.current.err.log` / `frontend/vite.err.log`.

### Manual Verification
- Launch the dev server and visually inspect the landing page, signup page, and dashboard layouts to ensure consistency, crisp SVG logo rendering, proper spacing, clean typography, mobile responsiveness, and zero flowchart sections.
