# CombineFilesForJSONandTS.ps1
param(
    [string]$RootFolder = ".\",
    [string]$OutputFile = "combined.txt"
)

# Clear or create the output file
Set-Content -Path $OutputFile -Value ""

# Pre-scan to calculate total size and file count for specified files
Write-Host "Scanning files and calculating total size..."
$script:totalFiles = 0
$script:totalSize = 0

function PreScan {
    param(
        [string]$FolderPath
    )

    # Get all relevant files recursively
    $files = Get-ChildItem -Path $FolderPath -Recurse -File | Where-Object {
        $_.Extension -match '\.(json|ts|yml|yaml)$' -or
        $_.Name -match '^(\.env|Dockerfile)(\..*)?$'
    }
    
    foreach ($file in $files) {
        $script:totalSize += $file.Length
    }
    $script:totalFiles = $files.Count
    return $files
}

# Perform the pre-scan and get the list of files
$allFiles = PreScan -FolderPath $RootFolder

# Check the condition to exit only if no files were found
if ($allFiles.Count -eq 0) {
    Write-Host "No matching files found in the directory. Exiting."
    exit 1
}

Write-Host "Total files: $($script:totalFiles), Total size: $($script:totalSize) bytes"

# Initialize progress variables
$currentFiles = 0
$currentSize = 0

# Function to obfuscate .env values
function ObfuscateEnvContent {
    param([string]$content)
    return ($content -split "`n" | ForEach-Object {
        if ($_ -match '^\s*#') { $_ } # Keep comments
        elseif ($_ -match '^\s*([^=]+)=(.*)') {
            "$($matches[1])=*****"
        }
        else { $_ }
    }) -join "`n"
}

# Recursive function to process folders
function ProcessFolder {
    param(
        [string]$FolderPath
    )

    # Get all relevant files in the current folder
    $files = Get-ChildItem -Path $FolderPath -File | Where-Object {
        $_.Extension -match '\.(json|ts|yml|yaml)$' -or
        $_.Name -match '^(\.env|Dockerfile)(\..*)?$'
    }

    foreach ($file in $files) {
        # Update progress
        $script:currentFiles++
        $script:currentSize += $file.Length
        $progressPercent = if ($script:totalSize -gt 0) {
            [math]::Round(($script:currentSize / $script:totalSize) * 100, 2)
        } else {
            0
        }

        Write-Progress -Activity "Combining Files" `
                       -Status "Processing file $script:currentFiles of $($script:totalFiles)" `
                       -PercentComplete $progressPercent

        # Add the file path to the output file
        Add-Content -Path $OutputFile -Value "=== FILE: $($file.FullName) ===`n"

        # Get and process content
        $content = Get-Content -Path $file.FullName -Raw
        
        # Obfuscate .env files
        if ($file.Name -match '^\.env') {
            $content = ObfuscateEnvContent -content $content
        }

        Add-Content -Path $OutputFile -Value $content
        Add-Content -Path $OutputFile -Value "`n`n" # Add separation between files
    }

    # Process subfolders recursively
    $subfolders = Get-ChildItem -Path $FolderPath -Directory
    foreach ($subfolder in $subfolders) {
        ProcessFolder -FolderPath $subfolder.FullName
    }
}

# Start processing from the root folder
Write-Host "Processing files with progress..."
ProcessFolder -FolderPath $RootFolder

# Add directory tree at the end
Add-Content -Path $OutputFile -Value "`n`n=== DIRECTORY TREE ==="
$treeOutput = cmd /c tree /f "$RootFolder"
Add-Content -Path $OutputFile -Value $treeOutput

Write-Host "Combined file content written to $OutputFile"