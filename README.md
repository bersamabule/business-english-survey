# Business English Survey

This repository contains the Business English Survey project.

## Automatic GitHub Commits and Netlify Deployment

This project is set up with automatic GitHub commits and pushes to ensure Netlify deploys updates without manual intervention.

### How It Works

1. The `auto-commit.ps1` PowerShell script automatically:
   - Adds all changes to Git
   - Creates a commit with a timestamp
   - Pushes changes to GitHub
   - Netlify will automatically detect these changes and deploy the updated site

### Running the Auto-Commit Script

To manually run the auto-commit script:

```powershell
.\auto-commit.ps1
```

### Setting Up Scheduled Auto-Commits

For fully automated commits, you can set up a scheduled task in Windows:

1. Open Task Scheduler
2. Create a new task
3. Set the trigger (e.g., daily, hourly, etc.)
4. Set the action to run PowerShell with the script path
5. Configure additional settings as needed

## Project Structure

(Project structure details will be added as the project develops)
