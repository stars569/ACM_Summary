@echo off
chcp 65001
cls

echo 启动ACM统计平台
echo.

echo 正在启动后端服务器...
start "ACM Backend Server" cmd /k "chcp 65001 && cd server && node index.js"

echo 等待后端服务器启动...
timeout /t 3 /nobreak >nul

echo 正在启动前端服务器...
start "ACM Frontend Server" cmd /k "chcp 65001 && cd src && npm start"

echo.
echo ACM统计平台启动完成!
echo 后端服务器: http://localhost:8080
echo 前端服务器: http://localhost:3000
echo.
echo 请等待几秒钟让服务器完全启动...
pause