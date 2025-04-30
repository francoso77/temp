@echo off
cls

cd C:\temp\jb\jb_frontend

start cmd /k npm run start

@REM start cmd /k json-server src\Login\db.json --p 3002 --id idPerson
