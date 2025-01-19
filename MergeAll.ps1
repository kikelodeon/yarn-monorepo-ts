# CombineFilesForJSONandTS.ps1
param(
    [string]$RootFolder = ".\",
    [string]$OutputFile = "combined.txt"
)

# Clear or create the output file
Set-Content -Path $OutputFile -Value ""

# Pre-scan to calculate total size and file count for JSON/TS files
Write-Host "Scanning files and calculating total size..."
$totalFiles = 0
$totalSize = 0

function PreScan {
    param(
        [string]$FolderPath
    )

    # Get all JSON and TS files recursively
    $files = Get-ChildItem -Path $FolderPath -Recurse -File | Where-Object { $_.Extension -eq ".json" -or $_.Extension -eq ".ts" }
    foreach ($file in $files) {
        $totalSize += $file.Length
    }
    $totalFiles = $files.Count
    return $files
}

# Perform the pre-scan and get the list of files
$allFiles = PreScan -FolderPath $RootFolder

# Check the condition to exit only if no files were found
if ($allFiles.Count -eq 0) {
    Write-Host "No JSON or TS files found in the directory. Exiting."
    exit 1
}

Write-Host "Total files: $totalFiles, Total size: $totalSize bytes"

# Initialize progress variables
$currentFiles = 0
$currentSize = 0

# Recursive function to process folders
function ProcessFolder {
    param(
        [string]$FolderPath
    )

    # Get all JSON and TS files in the current folder
    $files = Get-ChildItem -Path $FolderPath -File | Where-Object { $_.Extension -eq ".json" -or $_.Extension -eq ".ts" }

    foreach ($file in $files) {
        # Update progress
        $currentFiles++
        $currentSize += $file.Length
        $progressPercent = if ($totalSize -gt 0) {
            [math]::Round(($currentSize / $totalSize) * 100, 2)
        } else {
            0
        }

        Write-Progress -Activity "Combining Files" `
                       -Status "Processing file $currentFiles of $totalFiles" `
                       -PercentComplete $progressPercent

        # Add the file path to the output file
        Add-Content -Path $OutputFile -Value "$($file.FullName)`n"

        # Add the file content
        Add-Content -Path $OutputFile -Value (Get-Content -Path $file.FullName -Raw)
        Add-Content -Path $OutputFile -Value "`n" # Add a blank line for separation
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

Write-Host "Combined JSON and TS file content written to $OutputFile"
