# Workspace Customization Rules

These rules apply specifically to the Auto SLD project workspace.

## Backup Rule

- **Requirement**: BEFORE or AFTER making any code changes to the source files (such as `electricaldesignapp.tsx` or `AppsScriptCode.js`), you MUST run the backup script to save the current state of all files.
- **Command**: Run `node backup.js` in the workspace directory.
- **Target Folder**: `backups/Backup V.x` where `x` is auto-incremented by the script.
- **Policy**: Never commit code modifications or perform builds without verifying that a backup has been successfully created.
