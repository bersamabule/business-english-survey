# Auto-commit and push script for Netlify deployment
# This script automatically commits all changes and pushes them to GitHub

# Get current timestamp for commit message
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "Auto-commit: Updates as of $timestamp"

# Check if the repository has been initialized
$hasCommits = git rev-parse --verify HEAD 2>$null
$initialCommit = $false

if (-not $hasCommits) {
    Write-Host "Initializing repository with first commit..."
    $initialCommit = $true
}

# Add all changes
git add .

# Add the new dice project files explicitly to ensure they're included
git add -f dice/index.html
git add -f dice/styles.css
git add -f dice/script.js
git add -f dice/README.md

# Commit changes with timestamp
if ($initialCommit) {
    git commit -m "Initial commit"
} else {
    git commit -m "$commitMessage"
}

# Check which branch we're on and push accordingly
$currentBranch = git branch --show-current
if (-not $currentBranch) {
    $currentBranch = "main" # Default to main if no branch is detected
}

# Push to GitHub
git push -u origin $currentBranch

# Output success message
Write-Host "Successfully committed and pushed changes to GitHub at $timestamp"
