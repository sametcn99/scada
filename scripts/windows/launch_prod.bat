@echo off
cd %~dp0
start cmd /k "cd ..\.. && cd server && bun run start"
start cmd /k "cd ..\.. && cd client && bun run start"