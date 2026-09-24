$ErrorActionPreference = 'Stop'
npm run lint
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
$staged = @(git diff --cached --name-only --diff-filter=ACMR)
$scanned = @($staged | Where-Object { $_ -ne 'scripts/verify-s3.ps1' })
if ($scanned.Count -gt 0 -and (rg -n '(?i)(api[_-]?key|jwt[_-]?secret|password)\s*=\s*[''\"][^''\"]{12,}' -- $scanned)) { throw 'Potential secret pattern detected.' }
