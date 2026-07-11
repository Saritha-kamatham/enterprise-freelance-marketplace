@echo off
setlocal enabledelayedexpansion

:: Set Maven Version and URL
set "MAVEN_VERSION=3.9.6"
set "MAVEN_URL=https://archive.apache.org/dist/maven/maven-3/%MAVEN_VERSION%/binaries/apache-maven-%MAVEN_VERSION%-bin.zip"
set "MAVEN_DIR=%CD%\.maven"
set "MAVEN_HOME=%MAVEN_DIR%\apache-maven-%MAVEN_VERSION%"

if not exist "%MAVEN_HOME%\bin\mvn.cmd" (
    echo Downloading Maven %MAVEN_VERSION% using curl...
    mkdir "%MAVEN_DIR%" 2>nul
    
    :: Use native curl.exe instead of powershell to avoid PowerShell execution policies
    curl -L -o "%MAVEN_DIR%\maven.zip" "%MAVEN_URL%"
    
    if %ERRORLEVEL% neq 0 (
        echo Error downloading Maven using curl.
        exit /b %ERRORLEVEL%
    )

    echo Extracting Maven using tar...
    :: Use native tar.exe built into Windows 10/11
    tar -xf "%MAVEN_DIR%\maven.zip" -C "%MAVEN_DIR%"
    
    if %ERRORLEVEL% neq 0 (
        echo Error extracting Maven zip.
        exit /b %ERRORLEVEL%
    )
    
    del "%MAVEN_DIR%\maven.zip"
)

:: Run the downloaded Maven executable with all passed arguments
"%MAVEN_HOME%\bin\mvn.cmd" %*
