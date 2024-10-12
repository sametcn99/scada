@echo off
cd %~dp0
start cmd /k "cd ..\.. && cd server && bun i && cd ..\client && bun i"