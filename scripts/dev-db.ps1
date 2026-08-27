# Start/stop the local portable PostgreSQL (installed at %LOCALAPPDATA%\pgsql).
# Usage:  .\scripts\dev-db.ps1 start | stop | status
param([ValidateSet('start', 'stop', 'status')][string]$Action = 'start')

$pg = "$env:LOCALAPPDATA\pgsql"
& "$pg\bin\pg_ctl.exe" -D "$pg\data" -l "$pg\pg.log" $Action
