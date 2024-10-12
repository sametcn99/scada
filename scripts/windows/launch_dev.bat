@echo off
cd %~dp0
start cmd /k "cd ..\.. && cd server && npm run dev"
start cmd /k "cd ..\.. && cd client && npm run dev"