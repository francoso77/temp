@echo off
cls

del "C:\temp\jb\jb_frontend\src\types\*.ts"

xcopy "C:\temp\jb\jb_backend\src\types\*.ts" "C:\temp\jb\jb_frontend\src\types"