# PowerShell script to start Train Reservation backend in a persistent foreground
# Usage: Right-click -> Run with PowerShell OR execute: powershell -ExecutionPolicy Bypass -File .\start_backend.ps1

$ErrorActionPreference = 'Stop'

Write-Host '=== Backend Startup ==='
$backendRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $backendRoot

if (-not (Test-Path .\venv\Scripts\python.exe)) {
    Write-Host 'Virtual environment not found. Creating...' -ForegroundColor Yellow
    python -m venv venv
}

Write-Host 'Activating virtual environment...' -ForegroundColor Cyan
. .\venv\Scripts\Activate.ps1

Write-Host 'Python version:' (python -c "import sys; print(sys.version)")
Write-Host 'Checking required packages...' -ForegroundColor Cyan
$packages = @('Flask==3.0.0','Flask-CORS==4.0.0','mysql-connector-python==8.2.0','python-dotenv==1.0.0','Werkzeug==3.0.1')

foreach ($p in $packages) {
    $name = $p.Split('==')[0]
    $installed = python -c "import importlib, sys; print(importlib.util.find_spec('$name') is not None)" 2>$null
    if ($installed -ne 'True') {
        Write-Host "Installing missing package: $p" -ForegroundColor Yellow
        pip install $p
    }
}

Write-Host 'Starting Flask app (keep this window open)...' -ForegroundColor Green
python .\app.py
