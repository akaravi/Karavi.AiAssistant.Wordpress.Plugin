# Generates WordPress-standard karavi-ai-assistant.pot, karavi-ai-assistant-fa_IR.po, and karavi-ai-assistant-fa_IR.mo
$ErrorActionPreference = 'Stop'
$buildScript = Join-Path (Split-Path $PSScriptRoot -Parent) 'karavi\karavi.scripts.tools\i18n-build.py'
if (-not (Test-Path $buildScript)) {
    throw "Missing i18n build script: $buildScript"
}
python $buildScript
if ($LASTEXITCODE -ne 0) {
    throw "i18n build failed with exit code $LASTEXITCODE"
}
