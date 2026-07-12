KaraviAiAssistant — WordPress i18n files
==============================

Text domain : karavi-ai-assistant
Domain path : /languages (see KaraviAiAssistant.php plugin header)

Files
-----
karavi-ai-assistant.pot              Template — for translators / GlotPress
karavi-ai-assistant-fa_IR.po         Persian translation — Poedit / Loco Translate
karavi-ai-assistant-fa_IR.mo         Compiled gettext (WordPress load_plugin_textdomain)
translations-fa_IR.php               Runtime fallback map (karaviaiassistant_t when .mo missing)
tour-translations-fa_IR.php          Guided tour (Shepherd) Persian strings
tour-ui-keys.json                    English tour keys (source of truth for tour strings)

Build / regenerate
------------------
Run from plugin root:

  python karavi/karavi.scripts.tools/i18n-build.py

Or:

  powershell -ExecutionPolicy Bypass -File languages/generate-wordpress-po.ps1

This merges translations-fa_IR.php + tour-translations-fa_IR.php, all PHP/uiStrings/tour keys,
writes .pot / .po / .mo, and updates karavi/karavi.status/i18n-build-report.json.

Audit missing keys:

  python karavi/karavi.scripts.tools/audit-i18n-missing.py

How karaviaiassistant_t works
-----------------------------
1. WordPress gettext: __( $text, 'karavi-ai-assistant' ) via karavi-ai-assistant-fa_IR.mo
2. Fallback: translations-fa_IR.php + tour-translations-fa_IR.php when locale is fa_IR

Enable Persian UI
-----------------
KaraviAiAssistant → Settings → Chatbot → General → Admin UI Language / Frontend UI Language → Persian (Farsi)

Updated: 2026-07-12
