@echo off
echo ========================================
echo  QUICK DIAGNOSTIC CHECK
echo ========================================
echo.

echo [1/5] Checking Python installation...
python --version 2>nul
if errorlevel 1 (
    echo [FAIL] Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/downloads/
    goto :end
) else (
    echo [PASS] Python is installed
)
echo.

echo [2/5] Checking backend folder...
if exist "backend\app.py" (
    echo [PASS] Backend folder found
) else (
    echo [FAIL] Backend folder not found
    echo Please run this from the project root directory
    goto :end
)
echo.

echo [3/5] Checking if data folder exists...
if exist "backend\data" (
    echo [PASS] Data folder exists
    dir /b backend\data | find /c ".csv" > nul
    if errorlevel 1 (
        echo [WARN] No CSV files found in data folder
        echo You may need to run setup.bat
    ) else (
        echo [PASS] CSV files found
    )
) else (
    echo [FAIL] Data folder does NOT exist
    echo.
    echo ACTION REQUIRED: Run setup.bat first!
    echo This will generate the datasets and train the model.
    echo.
    goto :suggest_setup
)
echo.

echo [4/5] Checking if model is trained...
if exist "backend\data\traffic_rf.pkl" (
    echo [PASS] Model file exists
) else (
    echo [FAIL] Model file not found
    echo.
    goto :suggest_setup
)
echo.

echo [5/5] Checking frontend files...
if exist "frontend\index.html" (
    echo [PASS] Frontend files found
) else (
    echo [FAIL] Frontend files not found
    goto :end
)
echo.

echo ========================================
echo  SYSTEM READY!
echo ========================================
echo.
echo To start the application:
echo   1. Run: start_backend.bat
echo   2. Run: start_frontend.bat (in new window)
echo   3. Open: http://localhost:8000
echo.
echo OR simply run: start_both.bat
echo.
goto :end

:suggest_setup
echo ========================================
echo  SETUP REQUIRED
echo ========================================
echo.
echo Your system is not set up yet.
echo.
echo Please run: setup.bat
echo.
echo This will:
echo   - Install required Python packages
echo   - Generate city-based traffic datasets
echo   - Train the machine learning model
echo.
echo After setup completes, run this diagnostic again.
echo.

:end
pause
