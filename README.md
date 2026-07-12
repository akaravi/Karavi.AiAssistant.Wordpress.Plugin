# Karavi AI Assistant

Free open-source AI chatbot and behavior automation plugin for WordPress and WooCommerce.

[![GitHub stars](https://img.shields.io/github/stars/akaravi/wordpress-Quorlyx?style=social)](https://github.com/akaravi/wordpress-Quorlyx/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/akaravi/wordpress-Quorlyx?style=social)](https://github.com/akaravi/wordpress-Quorlyx/forks)
[![License: GPL-2.0-or-later](https://img.shields.io/badge/license-GPL--2.0--or--later-blue)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
[![Version](https://img.shields.io/badge/version-2.2.29-blue)](readme.txt)
[![WordPress + WooCommerce](https://img.shields.io/badge/WordPress-WooCommerce-blue)](https://wordpress.org/plugins/karavi-ai-assistant/)

Karavi AI Assistant helps WordPress sites turn visitor behavior into useful AI-powered actions. Instead of showing the same static chatbot to every visitor, KaraviAiAssistant can react to what people are doing on the site: the page they are reading, the product they are viewing, how far they scroll, whether they are returning, whether they are close to leaving, what they click, what is in the cart, and how they move through a WooCommerce store.

[Download on GitHub](https://github.com/akaravi/wordpress-Quorlyx) | [Releases](https://github.com/akaravi/wordpress-Quorlyx/releases) | [WordPress.org](https://wordpress.org/plugins/karavi-ai-assistant/) | [Website](https://alikaravi.com) | [Community Support](https://discord.gg/ZTu6XFUZD)

If Karavi AI Assistant helps you build a smarter WordPress or WooCommerce site, a GitHub star helps more developers discover the project and shows which open-source work is worth improving next.

## GitHub Description

Open-source AI chatbot and behavior automation plugin for WordPress/WooCommerce: BYOK AI chat, smart triggers, Knowledge Base context, Content Insights, conversion goals, A/B testing, SEO tools, WooCommerce automation, and GitHub updates.

## Requirements

- WordPress 6.0 or newer (tested up to 6.5).
- PHP 7.4 or newer.
- WooCommerce is optional but required for cart, checkout, product, and marketplace automation features.
- An AI provider API key from Google Gemini, OpenAI, Anthropic Claude, Grok, Mistral, or DeepSeek (Bring Your Own Key).

## What Karavi AI Assistant Does

- Adds an AI chatbot to WordPress using the site owner's own AI provider API key.
- Supports Google Gemini, OpenAI, Anthropic Claude, Grok, Mistral, and DeepSeek.
- Creates behavior-based chat triggers for smarter proactive messages.
- Uses WordPress pages, posts, products, rendered page text, uploaded files, and live page context as Knowledge Base sources.
- Supports WooCommerce product context, cart behavior, checkout flow, purchase attribution, coupons, and product discovery.
- Tracks conversations, submissions, conversion goals, trigger analytics, A/B testing results, and content performance.
- Includes AI content generation, SEO tools, schema generation, internal-link suggestions, keyword ideas, and content refresh planning.
- Includes separate admin and frontend UI language controls with Persian (`fa_IR`) translation.
- Uses semantic design tokens, light/dark admin theme support, and WCAG-oriented UI helpers.

## Why It Saves Money

Many chatbot tools charge a recurring fee per website, seat, contact volume, or advanced feature. That becomes expensive for freelancers, agencies, small businesses, WooCommerce stores, marketplace builders, and anyone managing more than one WordPress site.

Karavi AI Assistant removes that extra hosted chatbot layer. The plugin is free and open source. You install it on your own WordPress site, add your own AI provider API key, and pay only for the AI usage you choose. There is no Karavi AI Assistant account fee, no per-site unlock step, no required hosted chatbot platform, and no forced vendor lock-in.

This matters because store owners and site builders can:

- Start with the AI provider they already trust.
- Use cheaper/faster models for simple messages and stronger models for complex questions.
- Cache answers and reuse context to reduce repeated AI calls.
- Keep the automation logic inside WordPress instead of paying another SaaS platform for basic behavior rules.
- Extend the plugin directly when a client or marketplace workflow needs something specific.

## Why It Can Be Better Than Generic Chatbots

Generic chat widgets usually wait for a visitor to ask a question. KaraviAiAssistant is built around WordPress, WooCommerce, and visitor behavior, so it can act at the right moment:

- It can open based on behavior, not only manual chat input.
- It understands WordPress content types, WooCommerce products, carts, and checkout context.
- It can use live page text, uploaded files, rendered content, and behavior snapshots as answer context.
- It lets site owners control provider, model, prompts, triggers, buttons, analytics, appearance, caching, and retention.
- It can test different chat variations and connect messages to real conversion goals.
- It is open source, so developers can inspect, modify, and extend it.

For WooCommerce stores and marketplaces, Karavi AI Assistant is useful because it can connect AI help to real buying behavior: product views, add-to-cart events, checkout drop-off, cart state, coupons, order attribution, and product-specific Knowledge Base answers.

## Media Gallery

Screenshots and GIFs are stored in this repository under `docs/media/`. Previews link to the full animated capture when available.

### Dashboard

[![Karavi AI Assistant dashboard](docs/media/previews/dashboard.png)](docs/media/dashboard.gif)

### Chat

[![Karavi AI Assistant chat settings](docs/media/previews/chat.png)](docs/media/chat.gif)

### Behavior Triggers

[![Karavi AI Assistant behavior triggers](docs/media/previews/triggers.png)](docs/media/triggers.gif)

### Content Insights

[![Karavi AI Assistant content insights](docs/media/previews/content-insights.png)](docs/media/content-insights.gif)

### Conversion Goals

[![Karavi AI Assistant conversion goals](docs/media/previews/goals.png)](docs/media/goals.gif)

### Cost Controls

[![Karavi AI Assistant cost controls](docs/media/previews/cost-controls.png)](docs/media/cost-controls.gif)

### SEO Tools

[![Karavi AI Assistant SEO tools](docs/media/previews/seo.png)](docs/media/seo.gif)

### Logs And Diagnostics

![Karavi AI Assistant logs and diagnostics](docs/media/logs-diagnostics.png)

## Feature Map

### AI Providers And Model Control

- Provider support for Gemini, OpenAI, Anthropic, Grok, Mistral, and DeepSeek.
- Separate API key fields for each provider.
- Automatic model fetching for selected providers.
- Variation A and Variation B can use different providers, models, personas, settings, and appearances.
- Content Engine can reuse Variation A credentials or use independent provider credentials.
- Optional fallback provider and fallback model when the primary provider fails.
- Optional model routing for short questions or greetings to cheaper/faster models.
- Local greeting replies can answer simple greetings without calling an AI model.
- Global API timeout setting.

### Chat Widget

- Frontend chat widget enable/disable control.
- Bot name control.
- Welcome message and loading message controls.
- Custom floating logo.
- AI persona/instructions field for tone, rules, button behavior, and answer style.
- AI-generated contextual buttons.
- Persistent quick chat buttons.
- Quick button placement under messages, in the chat bar, or both.
- Action buttons that can open URLs or send predefined messages to AI.
- Normal chat response format modes: free AI, template locked, or hybrid required placeholders.
- Response templates with placeholders, slot instructions, missing-placeholder policy, and max word controls.
- Main chat capture for contact/data requests into Submissions with purpose, status, tags, and capture instructions.
- Conversation history support with configurable message and character budgets.

### Knowledge Base

- Select which public WordPress content types can be used as AI context.
- Use posts, pages, WooCommerce products, and other public custom post types.
- Include rendered public page text from blocks, page builders, shortcodes, templates, and custom fields.
- Include visible current page text from the visitor's active page.
- Upload Knowledge Base files for AI context.
- Supported file-oriented knowledge workflows for PDF, TXT, Markdown, CSV, JSON, HTML, XML, and other text-like sources.
- Add behavior patterns from Content Insights as AI context.
- Control content excerpt words, product excerpt words, rendered page max characters, uploaded file count, and characters per file.
- Product tool-calling can let supported providers search WooCommerce products on demand.
- Tool result limits for product search.

### Appearance And Layout

- Desktop floating button positions: bottom right, bottom left, top right, top left, or custom coordinates.
- Desktop floating button size, logo scale, background color, and transparent background option.
- Mobile floating button size, logo scale, bottom offset, and side offset.
- Floating label text, label color, background color, transparency, max width, gap, desktop position, and desktop font size.
- Optional mobile label with separate mobile position and font size.
- Chat window desktop width and height.
- Mobile panel width, full-width mode, height, full-height mode, horizontal alignment, and vertical alignment.
- Header text color, user message background color, user message text color.
- Chat font family, font size, line height, background color, text color, border radius, and padding.
- Quick button style, shape, and font size.
- Generated button style, shape, and font size.

### A/B Testing

- Enable or disable A/B testing.
- Separate Variation A and Variation B configuration.
- Compare conversations, trigger conversations, normal conversations, views, conversions, and conversion rates.
- Assign triggers to all variations, Variation A only, or Variation B only.
- Mark conversion goals as A/B goals.
- Dashboard statistics for each variation.
- Export A/B results as CSV.

### Engagement Triggers

- Trigger types: time on page, scroll depth, inactivity, click intent, cart abandonment, return visitor, page depth, UTM/referrer, instant condition, and desktop exit intent.
- Target page URL contains rules.
- Excluded page URL rules.
- Target section CSS selector rules.
- Proactive message per trigger.
- Normal side-panel opening or centered modal opening.
- Trigger quick reply buttons.
- Trigger-specific chat follow-up instructions.
- Trigger-specific submission capture with purpose, status, and tags.
- Trigger message modes: static, AI, AI-first, or static-first.
- Trigger AI controls for persona, provider scope, provider, model, temperature, max tokens, cache TTL, fallback message, and audit saving.
- Trigger response templates, required placeholders, slot instructions, missing-placeholder handling, and max word controls.
- Priority score and high-priority override.
- Trigger order preview.
- Cooldown modes: once per session, once per page, once per day, once per N days, disabled, or unlimited where supported.
- Cooldown day controls and dismiss-suppression limits.
- Suppress after conversion.
- Minimum time on page.
- Only if cart is empty or only if cart has items.
- Suppress if visitor already visited matching URLs.
- Date scheduling, day scheduling, and time-window scheduling.
- QA preview only mode with preview URL support.
- Recovery templates for cart/exit moments.
- Recovery CTA options: resume checkout, view cart, apply offer, custom action, coupon selection, custom label, and custom URL.
- Optional exit warning and fake exit button controls.

### Trigger Segmentation And Verification

- Content Insights gate for trigger eligibility.
- Gate windows for last 7 days or last 30 days.
- Gate refresh intervals: 1 day, 7 days, 30 days, or manual.
- Thresholds for views, conversions, conversion rate, average time, scroll depth, add to cart, and checkout flow.
- Segment by page type: homepage, product, post, page, or any.
- Segment by device: mobile, desktop, or any.
- Segment by traffic source: direct, search, social, paid, email, referral, or any.
- Segment by behavior pattern: fast leaver, medium leaver, slow leaver, comparison shopper, fast closer, discoverer closer, unknown, or any.
- Segment by predicted next step.
- Include and exclude URL pattern filters.
- Opportunity threshold and hysteresis buffer controls.

### WooCommerce And Marketplace Features

- Product Knowledge Base context.
- WooCommerce product visit conversion goals.
- Product search/select controls for goals and targeting.
- Add-to-cart tracking.
- Checkout and place-order action tracking.
- WooCommerce purchase attribution for Content Insights.
- Cart abandonment trigger.
- Cart-not-empty and cart-empty trigger conditions.
- Checkout flow and checkout dropout behavior signals.
- Coupon dropdown for recovery CTA offers.
- Product queue for AI content generation.
- Generate content for all products, specific products, or keyword topics.
- Related product recommendations in generated content.
- Product tool-calling for supported AI providers.
- Useful for marketplaces because each product, seller page, category, checkout path, and campaign source can become part of the visitor context.

### Conversion Goals And Notifications

- Conversion goals by URL contains rules.
- Any detected conversion/payment success goal.
- CSS selector click goals.
- Form submit selector goals.
- Popular WordPress action goals.
- WooCommerce product visit goals.
- Common presets for WordPress button/CTA clicks, Contact Form 7, WPForms, Gravity Forms, Elementor forms, Fluent Forms, Ninja Forms, Formidable Forms, WooCommerce add to cart, WooCommerce checkout/place order, phone links, email links, and download links.
- Goal counters and A/B test goal selection.
- Email notifications for new leads.
- Optional full conversation transcript email to admin.

### Content Insights And Behavior Analytics

- Track all public content, selected post types, or target URLs.
- Include and exclude post types.
- Include and exclude exact URLs or URL contains rules.
- Filter by any content, AI-generated content, or manual content.
- Filter by improved or not-improved content.
- Opportunity scoring with threshold and top-opportunity limits.
- Conversion counting by any conversion signal or only configured goals.
- Database-first analytics processing option.
- Dedicated Content Insights admin page.
- Content performance labels such as promote, watch, or improve.
- Content Insights suggestions for practical next actions.
- Create triggers from insight opportunities.
- Import historical CSV analytics from external tools.
- Map CSV columns into KaraviAiAssistant fields.
- Pull historical metrics from compatible WordPress analytics data when available.

### Behavior Pattern Engine

- Browser behavior snapshots and milestone sync.
- Buyer/closer and non-converter profile tracking.
- WooCommerce purchase as primary conversion.
- Custom conversion rules for form submit, click, and event signals.
- Checkout flow signals for cart and checkout abandonment.
- Minimum sessions for classification.
- Sync interval, snapshot gap controls, server sync controls, and profile retention.
- Database-first profile aggregation option.
- Dynamic calibration lookback, minimum calibration profiles, and prediction confidence.
- Reference matching against stored behavior profiles.
- Reference error tolerance, minimum profiles per source, minimum samples per pattern, and fallback to rule-based classification.
- Pattern metrics: visit frequency, pages viewed, dwell time, cart activity, scroll depth, started chat, checkout flow, and traffic source.
- Per-metric weights for behavior prediction.
- Behavior classifications including fast leaver, medium leaver, slow leaver, comparison shopper, fast closer, and discoverer closer.

### Content Engine And SEO Tools

- Automated AI post generation.
- Manual "generate one post now" action.
- Generation schedules: manual only, daily, twice daily, or weekly.
- Posts per run control.
- Duplicate prevention with generation history and reset history.
- Generation sources: topic keyword queue, all products discovery mode, specific products, and product queue.
- Custom AI instructions for generated posts.
- Select output post type, author, and draft/publish status.
- Related recommendations appended to generated content.
- Recommendation sections for products, posts, and services.
- Taxonomy relevance for recommendations.
- Custom service taxonomies.
- Custom recommendation section labels.
- Recommendation cache TTL.
- Generate keyword ideas with AI.
- Analyze a topic for SEO.
- Generate schema markup.
- Suggest internal links.
- Improve existing posts, pages, and products with saved SEO suggestions.
- Filter SEO improvement targets by source and improvement status.
- Mark content as improved.

### Dashboard, Logs, Exports, And Maintenance

- KaraviAiAssistant Dashboard with conversation statistics, trigger analytics, conversion goals, and Content Insights summary.
- Submissions admin area for captured leads/contact/data requests.
- Conversations admin area for stored chat history.
- Export A/B results CSV.
- Export trigger analytics CSV.
- Export submissions CSV.
- Export conversations CSV.
- Event Logs tab.
- Clear all logs and delete selected logs.
- Analyze logs with AI.
- Setup guide chat for plugin questions.
- Health Check.
- Frontend Probe.
- Site snapshot for diagnostics.
- Reset selected data for A/B stats, goal counters, action counters, trigger analytics, product insights, content insights, behavior patterns, and conversations.
- Data retention controls for conversations and submissions.

### Performance And Cost Controls

- Response caching and response cache TTL.
- Context cache TTL.
- Optional WordPress object cache usage.
- Session context reuse for follow-up questions.
- Chat debounce.
- Context detail level: full or compact.
- Content excerpt length and product excerpt length.
- Rendered page max characters.
- Uploaded Knowledge Base file count and character budgets.
- Chat history message and character budgets.
- Persona prompt trimming and max character limit.
- Server-side chat rate limiting with request/window settings.
- Fallback provider cooldown.

## Open Source Release Notes (v2.2.6–2.2.29)

These are the main changes shipped in the current open-source line on [GitHub](https://github.com/akaravi/wordpress-Quorlyx) (stable tag **2.2.29**). They cover rebrand, Persian i18n, design system modernization, bug fixes, brand assets, and public documentation.

### English

#### Rebrand, identity, and safe upgrade

- Full rebrand to **Karavi AI Assistant** — bootstrap `KaraviAiAssistant.php`, text domain `karavi-ai-assistant`, PHP prefix `karaviaiassistant_`.
- Removed legacy product identifiers from source, assets, `dist/`, languages, docs, and operator configs.
- One-time storage migration (`includes/karavi-ai-assistant-storage-migration.php`) for options, tables, custom post types, meta, cron hooks, and admin capability on upgrade.
- GitHub updater installs the plugin folder as `wp-content/plugins/KaraviAiAssistant/` and matches release asset `KaraviAiAssistant.zip`.
- Public repository: [akaravi/wordpress-Quorlyx](https://github.com/akaravi/wordpress-Quorlyx) · WordPress.org slug: `karavi-ai-assistant`.

#### Internationalization (fa first, en aligned)

- Full Persian (`fa_IR`) UI coverage — **1300+** UI keys audited with **0 missing** at release **2.2.29**.
- Standard WordPress gettext: `.pot`, `.po`, compiled `.mo`, plus runtime fallback maps and guided-tour translations.
- Separate **Admin UI Language** and **Frontend UI Language** settings (independent admin vs visitor locale).
- i18n build pipeline: `karavi/karavi.scripts.tools/i18n-build.py`, `audit-i18n-missing.py`, and `verify-i18n.ps1`.
- Localized admin JS, guide/health severity labels, reset-data flows, and GitHub updater fallback strings.

#### Design system, accessibility, and admin UX

- Semantic design tokens in `assets/css/karavi-design-tokens.css` (`--kai-*`) — light/dark, RTL-friendly.
- Accessibility helpers in `assets/css/karavi-ui-a11y.css`; admin theme overrides in `karavi-admin-theme.css`.
- Token migration across `dist/admin.min.css`, `dist/dashboard.min.css`, and `dist/style.min.css` — no hardcoded hex in shipped admin/frontend CSS.
- Admin theme: **auto | light | dark** in settings; admin-bar quick toggle with per-user preference.
- Navigation IA: scrollable settings tabs, `role="tablist"` / `aria-selected`, focus-visible, localized section labels.
- Frontend widget: theme-only CSS injection when `style.min.css` is enqueued; performance and slop audit grades improved to **A** range.
- Guide panel, reset modal, switches, badges, and Content Insights panels moved from inline styles to tokenized CSS classes.

#### Brand and assets

- Official wordmark and icon from `karavi/karavi.assets/brand/` mapped into `assets/logo.png`, `assets/icon.png`, and white-bg variants.
- Split helpers: wordmark for admin headers, icon for menu/updates/default chat FAB when no custom logo is uploaded.
- Asset cache-bust uses `KARAVI_AI_ASSISTANT_VERSION` (fixes stale `?ver=1.6.29` on frontend scripts).

#### Stability and bug fixes

- Fixed invalid JS identifiers after bulk rename (admin collapsibles, frontend chat widget, analytics, behavior trackers).
- Fixed malformed admin `confirm()` and moved main admin inline script to nowdoc (prevents PHP string corruption).
- Scoped Quick Chat repeater handlers so Conversion Goals Edit/Done/Remove no longer conflict.
- Trigger active toggle, dashboard reset confirm button, and goal validation fixes in **2.2.29**.

#### Documentation and open-source hygiene

- README aligned with install paths, requirements, i18n workflow, and repository layout.
- Broken GitHub/media links replaced with canonical repo URLs and in-repo `docs/media/` previews.
- Operator workspace under `karavi/` (plans, history, publish config, verify gates) for contributors.
- GPL-2.0-or-later · BYOK · no required SaaS account · no silent install-domain tracking.

---

### فارسی

#### ریبرند، هویت، و ارتقای امن

- ریبرند کامل به **Karavi AI Assistant** — بوت‌استrap در `KaraviAiAssistant.php`، text domain برابر `karavi-ai-assistant`، پیشوند PHP برابر `karaviaiassistant_`.
- حذف شناسه‌های legacy محصول از سورس، assets، `dist/`، languages، docs و configهای اپراتور.
- مهاجرت یک‌بارهٔ داده (`includes/karavi-ai-assistant-storage-migration.php`) برای option، جدول، CPT، meta، cron و capability ادمین هنگام upgrade.
- GitHub updater پوشهٔ پلاگین را `wp-content/plugins/KaraviAiAssistant/` نصب می‌کند و asset رلیز `KaraviAiAssistant.zip` را match می‌کند.
- مخزن عمومی: [akaravi/wordpress-Quorlyx](https://github.com/akaravi/wordpress-Quorlyx) · اسلاگ WordPress.org: `karavi-ai-assistant`.

#### بین‌المللی‌سازی (fa اول، en هم‌تراز)

- پوشش کامل UI فارسی (`fa_IR`) — بیش از **1300** کلید UI با **۰ missing** در رلیز **2.2.29**.
- gettext استاندارد وردپرس: `.pot`، `.po`، `.mo` کامپایل‌شده، به‌علاوه mapهای runtime و ترجمهٔ تور راهنما.
- تنظیمات جداگانه **زبان UI ادمین** و **زبان UI فرانت** (locale مستقل برای پنل و بازدیدکننده).
- خط build i18n: `karavi/karavi.scripts.tools/i18n-build.py`، `audit-i18n-missing.py` و `verify-i18n.ps1`.
- بومی‌سازی JS ادمین، برچسب‌های severity راهنما/Health Check، reset-data و fallbackهای GitHub updater.

#### Design system، دسترس‌پذیری، و UX ادمین

- توکن‌های semantic در `assets/css/karavi-design-tokens.css` (`--kai-*`) — روشن/تاریک، سازگار با RTL.
- helperهای a11y در `assets/css/karavi-ui-a11y.css`؛ override تم ادمین در `karavi-admin-theme.css`.
- مهاجرت token در `dist/admin.min.css`، `dist/dashboard.min.css` و `dist/style.min.css` — بدون hex سخت‌کد در CSS منتشرشده.
- تم ادمین: **auto | light | dark** در تنظیمات؛ toggle سریع در admin bar با ترجیح per-user.
- IA ناوبری: تب‌های scrollable، `role="tablist"` / `aria-selected`، focus-visible، برچسب‌های localized.
- ویجت فرانت: تزریق CSS فقط-theme وقتی `style.min.css` enqueue شده؛ نمره audit عملکرد و slop در محدوده **A**.
- پنل راهنما، modal reset، switchها، badgeها و پنل‌های Content Insights از inline style به کلاس CSS مبتنی بر token منتقل شدند.

#### برند و دارایی‌ها

- wordmark و آیکن رسمی از `karavi/karavi.assets/brand/` به `assets/logo.png`، `assets/icon.png` و variantهای white-bg.
- helperهای جدا: wordmark برای header ادمین، icon برای منو/آپدیت/FAB پیش‌فرض چت وقتی لوگوی سفارشی خالی است.
- cache-bust asset با `KARAVI_AI_ASSISTANT_VERSION` (رفع `?ver=1.6.29` قدیمی روی اسکریپت فرانت).

#### پایداری و رفع باگ

- رفع شناسه‌های JS نامعتبر پس از rename انبوه (collapsible ادمین، ویجت چت فرانت، analytics، behavior tracker).
- رفع `confirm()` malformed ادمین و انتقال اسکریپت inline اصلی به nowdoc (جلوگیری از خرابی رشته PHP).
- محدود کردن handlerهای Quick Chat repeater تا Edit/Done/Remove اهداف تبدیل تداخل نکنند.
- رفع toggle فعال trigger، دکمه confirm reset داشبورد و validation هدف در **2.2.29**.

#### مستندات و بهداشت open source

- README هم‌تراز با مسیر نصب، requirements، workflow i18n و layout مخزن.
- لینک‌های GitHub/media شکسته با URL مخزن canonical و previewهای `docs/media/` در-repo جایگزین شد.
- workspace اپراتور در `karavi/` (plan، history، publish config، verify gates) برای مشارکت‌کنندگان.
- GPL-2.0-or-later · BYOK · بدون حساب SaaS اجباری · بدون ردیابی پنهان دامنه نصب.

## Installation

### Option 1: GitHub Release ZIP

1. Download the latest release ZIP from [GitHub Releases](https://github.com/akaravi/wordpress-Quorlyx/releases).
2. In WordPress admin, open **Plugins > Add New > Upload Plugin**.
3. Upload the ZIP and activate **Karavi AI Assistant**.
4. Open **Karavi AI Assistant > Settings**.
5. Add your own AI provider API key and model.
6. Configure the chatbot, Knowledge Base sources, triggers, goals, and optional content tools.

### Option 2: Manual Install

1. Copy this repository (or the release contents) into `wp-content/plugins/KaraviAiAssistant/`.
2. Activate **Karavi AI Assistant** from WordPress admin.
3. Open **Karavi AI Assistant > Settings**.
4. Add your own AI provider API key and model.
5. Configure chat behavior, Knowledge Base sources, triggers, goals, and optional content tools.

### Option 3: WordPress Marketplace

Use the WordPress.org listing when available: [wordpress.org/plugins/karavi-ai-assistant](https://wordpress.org/plugins/karavi-ai-assistant/)

## Updates

Karavi AI Assistant includes a GitHub release updater for self-hosted installs.

- WordPress checks the latest public GitHub release.
- Updates appear in the normal WordPress **Dashboard > Updates** and **Plugins** screens.
- Admins can use **Check GitHub updates** from the plugin row.
- GitHub ZIP folders are normalized so the plugin stays installed as `wp-content/plugins/KaraviAiAssistant/`.

## For Employers

KaraviAiAssistant is also a portfolio-grade engineering example. It demonstrates:

- WordPress plugin architecture across admin UI, frontend UI, AJAX, REST-style behavior, cron, exports, and persistence.
- AI product implementation with provider abstraction, prompt/context controls, fallback routing, caching, and cost controls.
- WooCommerce-aware automation using product, cart, checkout, and purchase signals.
- Analytics workflows with conversion goals, A/B tests, behavior events, CSV exports, and diagnostics.
- Security-minded open-source positioning: no committed secrets, no hidden install/domain tracking, and public issue-based support.
- Practical product judgment: the plugin is free, inspectable, and community-driven instead of locked behind a closed SaaS layer.

## Star And Share

The most useful way to support KaraviAiAssistant is to give the repository a star and share the specific workflow that made it useful.

- Star the repository: https://github.com/akaravi/wordpress-Quorlyx
- Share a short use case: "I am testing KaraviAiAssistant for WooCommerce cart recovery / behavior triggers / AI Knowledge Base chat."
- Open an issue when something is unclear, broken, or worth improving.
- Share the project with WordPress developers, WooCommerce store owners, agencies, and marketplace builders.

Copy-paste posts are available in [Share Karavi AI Assistant](docs/share-karavi-ai-assistant.md).

## Included

| Path | Role |
|---|---|
| `KaraviAiAssistant.php` | Main plugin bootstrap (admin, frontend, AJAX, cron, persistence) |
| `assets/` | Human-readable JS sources and brand assets |
| `assets/css/` | Design tokens, admin theme overrides, accessibility helpers |
| `dist/` | Minified distribution CSS/JS shipped with the plugin |
| `includes/` | i18n helpers and one-time storage migration |
| `languages/` | Text domain `karavi-ai-assistant` — `.pot`, `.po`, `.mo`, Persian runtime maps |
| `docs/` | Public product documentation |
| `karavi/` | Operator workspace (plans, history, publish/deploy config, i18n build tools) — see [karavi/README.md](karavi/README.md) |

WordPress installs the plugin folder as `KaraviAiAssistant/`; the gettext text domain remains `karavi-ai-assistant`.

## Development And Build Checks

Install local development tools:

```bash
composer install
```

Run PHP standards checks:

```bash
composer lint:php
```

Apply PHPCS autofixes only after reviewing the expected diff:

```bash
composer lint:php:fix
```

Quick syntax check on the bootstrap file:

```bash
php -l KaraviAiAssistant.php
```

Regenerate gettext and Persian translation artifacts:

```bash
python karavi/karavi.scripts.tools/i18n-build.py
```

Audit missing UI translation keys:

```bash
python karavi/karavi.scripts.tools/audit-i18n-missing.py
```

Or run the bundled verify gate:

```powershell
powershell -ExecutionPolicy Bypass -File karavi/karavi.scripts.tools/verify-i18n.ps1
```

Human-readable sources live in `assets/`; distribution-ready minified assets live in `dist/`. Design tokens and theme overrides live in `assets/css/`. When changing generated or minified assets, keep the matching human-readable source beside the distribution file and document any build command needed to reproduce it.

## Internationalization

- Text domain: `karavi-ai-assistant` · domain path: `/languages`
- Persian (`fa_IR`) ships with compiled `.mo`, runtime fallback maps, and guided-tour translations.
- **Settings > General** exposes separate **Admin UI Language** and **Frontend UI Language** controls.
- Translator workflow: see [languages/README-wordpress-i18n.txt](languages/README-wordpress-i18n.txt)

## Excluded From This Release Copy

- `node_modules/`
- generated ZIP archives
- generated DOCX files and extracted DOCX temp folders
- local WordOps/server tools
- local DNS/config/test logs
- embedded commercial server implementation

## Project Docs

- [Roadmap](ROADMAP.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
- [License](LICENSE)
- [Share Karavi AI Assistant](docs/share-karavi-ai-assistant.md)
- [Knowledge Base docs](docs/karavi-ai-assistant-knowledge.md)
- [Knowledge Base upload docs](docs/karavi-ai-assistant-knowledge-base-upload.md)
- [Persona templates](docs/karavi-ai-assistant-persona-templates.md)
- [WordPress i18n workflow](languages/README-wordpress-i18n.txt)

## Trust Notes

- Karavi AI Assistant uses the site owner's own AI provider keys.
- The plugin does not need a Karavi AI Assistant account to run.
- The project should not collect install domains silently.
- Keep private customer data out of public GitHub issues and Discord messages.

## License

GPL-2.0-or-later.
