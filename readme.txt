=== Karavi AI Assistant ===
Contributors: akaravi
Tags: ai, chatbot, woocommerce, automation, analytics
Requires at least: 6.0
Tested up to: 6.5
Requires PHP: 7.4
Stable tag: 2.2.29
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Free open-source AI chatbot and behavior automation plugin for WordPress and WooCommerce.

== Description ==

Karavi AI Assistant helps WordPress and WooCommerce sites use BYOK AI chat, behavior-based triggers, Knowledge Base context, Content Insights, conversion goals, A/B testing, SEO tools, WooCommerce automation, and GitHub updates.

== Installation ==

1. Upload the `KaraviAiAssistant` folder to `/wp-content/plugins/`.
2. Activate Karavi AI Assistant from WordPress admin.
3. Open Karavi AI Assistant > Settings.
4. Add your own AI provider API key and configure chat, Knowledge Base sources, triggers, and goals.

== Development ==

Run `composer install` to install local development tools.
Run `composer lint:php` or `vendor/bin/phpcs` to check PHP files against `phpcs.xml.dist`.
Run `composer lint:php:fix` or `vendor/bin/phpcbf` only after reviewing the changed files.

The release includes human-readable source assets in `assets/` and third-party vendor sources in `dist/vendor/`. Generated or distribution-ready assets are kept in `dist/`.

== Changelog ==

= 2.2.29 =
* Fix: settings page button handlers — Conversion Goals Edit/Done/Remove no longer conflict with Quick Chat repeater JS; trigger active toggles clickable; reset confirm re-enables after errors.

= 2.2.28 =
* Guide panel: localized severity/status labels (ERROR, WARNING, SUCCESS, PASS, FAIL) for fa admin UI.

= 2.2.27 =
* Guide panel: CSS classes replace inline styles; severity/status badges use design tokens; guide finding labels i18n (`Issue`, `Action:`).
* Admin `$brand_css`: tokenized reset modal, switch toggles, Select2/multiselect, log type badges, backend chat log.

= 2.2.26 =
* i18n: localized reset-data, content-insight AI suggestion, and GitHub updater strings; added fa_IR map entries.
* Admin theme: tokenized inline `$brand_css` and full `admin.min.css` (0 hardcoded hex literals) for light/dark consistency.

= 2.2.25 =
* Version bump for publish release (frontend cache-bust, brand assets, chat JS fixes in 2.2.21–2.2.24).

= 2.2.24 =
* Fix: frontend script/style cache-bust used hardcoded `1.6.29` instead of plugin version — assets now load with `?ver=2.2.24` after install.
* readme Contributors aligned with Author (akaravi).

= 2.2.23 =
* Brand: full asset set from `karavi/karavi.assets/brand/` — wordmark (`logo.png`) and mark (`icon.png`) with white-bg variants.
* Split `karaviaiassistant_get_plugin_logo_url()` (headers) and `karaviaiassistant_get_plugin_icon_url()` (menu, updates, chat FAB default).
* Admin brand logo CSS: height-based sizing for with-text wordmark.

= 2.2.22 =
* Brand: initial AK monogram from brand Logo.png; default floating chat logo when Custom Floating Logo is empty.

= 2.2.21 =
* Fix: frontend JS identifiers after rebrand (`karaviAiAssistantVars`, `karaviAiAssistantAnalytics`, etc.) — chat widget initializes; console SyntaxError/`ai is not defined` resolved.

= 2.2.20 =
* Settings: separate Admin UI Language and Frontend UI Language (legacy combined option still read as fallback).

= 2.2.19 =
* Fix: admin settings JS SyntaxError (missing parenthesis on clear-logs confirm) — collapsible sections and tabs work again.
* Admin main inline script moved to nowdoc to prevent PHP `$this`/`$()` interpolation breaking jQuery handlers.

= 2.2.18 =
* Fix: admin settings collapsible sections and tabs — invalid JavaScript identifiers after rebrand broke inline admin script (SyntaxError).
* Collapsible panels resolve content via sibling/child selectors for reliable open/close.

= 2.2.17 =
* Frontend widget: tokenized spacing/typography in dist/style.min.css (fab, chat panel, messages).
* Admin navigation IA: scrollable tabs, focus-visible, role=tablist/tab, aria-selected; styles moved to admin.min.css.
* i18n: aria labels for settings and content insights tab lists.

= 2.2.16 =
* Extended design tokens: typography headings, fine spacing scale, radius-xs/tour.
* Tokenized all font-size and spacing literals in dist/admin.min.css and dist/dashboard.min.css.

= 2.2.15 =
* Fix KARAVI_AI_ASSISTANT_VERSION constant sync with plugin header (was 2.2.13).
* Admin theme typography baseline: font-family/size/line-height and form spacing via design tokens.
* verify-i18n.ps1 gate: i18n-build + audit in verify-gates.json.
* design-audit-2026.html synced to A- (88.5) and v2.2.15.

= 2.2.14 =
* i18n complete: compiled karavi-ai-assistant-fa_IR.mo for WordPress gettext; publish ZIP includes .mo.
* i18n-build.py merges translations-fa_IR + tour-translations + tour-ui-keys; regenerates .pot/.po/.mo (1365 strings).
* Tour alias keys for KaraviAiAssistant branding; audit 0 missing (1280 UI keys).
* About page owner/company strings in fa map; README-wordpress-i18n updated.

= 2.2.13 =
* Frontend widget CSS tokenized: dist/style.min.css uses semantic kai tokens (zero hardcoded colors).
* injectStyles fallback aligned with tokens; theme-only block ships kai surface/text/shadow defaults.
* New tokens: modal overlay, search/hover surfaces, header control backgrounds.

= 2.2.12 =
* Design tokens extended for WP admin bridge colors, shadows, and dividers; dark-scheme overrides aligned.
* Tokenized remaining hardcoded colors in dist/admin.min.css and dist/dashboard.min.css for theme coherence.

= 2.2.11 =
* Admin bar quick theme toggle on Karavi screens: cycle auto / light / dark with instant preview and per-user preference (user meta).
* Fixed admin script/style cache-bust version to use KARAVI_AI_ASSISTANT_VERSION instead of stale hardcoded value.

= 2.2.10 =
* Admin panel theme setting: auto (OS), light, or dark — scoped dark mode for Karavi admin and dashboard via design tokens.
* New assets/css/karavi-admin-theme.css enqueued on Karavi admin screens.

= 2.2.9 =
* Frontend CSS dedupe: injectStyles now outputs theme variables only when dist/style.min.css is enqueued; full fallback retained for edge cases.
* Moved fake-exit trigger and touch-action styles into style.min.css.

= 2.2.8 =
* 2026 design system: shared design tokens, accessibility baseline (focus-visible, reduced motion), dark-scheme surfaces.
* Modernized admin, dashboard, and chat CSS; removed legacy corrupted styles and AI-slop patterns (gradients, scale hovers, tour emoji).
* WCAG AA contrast verified on primary UI color pairs.

= 2.2.7 =
* Completed bilingual admin and frontend UI (fa/en): 112 missing Persian strings added; 1185 gettext entries; zero-key audit gap.
* Publish ZIP now includes tour-translations-fa_IR.php for guided tour localization.
* Fixed GitHub updater folder rename and release asset matching for KaraviAiAssistant.zip installs.

= 2.2.6 =
* Complete rebrand from legacy product identifiers to Karavi AI Assistant / KaraviAiAssistant.
* Added one-time storage migration for options, tables, CPTs, meta, cron, and admin capabilities on upgrade.
* Fixed invalid PHP variable names introduced during the identifier rename pass.

= 2.2.5 =
* Fixed PHPCS/WPCS issues found during standards cleanup.
* Added Composer development tooling for WordPress coding standards checks.
* Added a kind GitHub star support note in the About settings tab.

= 2.2.4 =
* Current open-source release.
