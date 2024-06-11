@echo off
cls

cd C:\temp\React\funcionario

start cmd /k npm run start

start cmd /k json-server src\Login\db.json --p 3002 --id idFuncionario
