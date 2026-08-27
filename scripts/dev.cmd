@echo off
rem Dev launcher: ensures the portable Node install is on PATH, then runs pnpm dev.
set "PATH=%LOCALAPPDATA%\nodejs;%PATH%"
pnpm dev
