# deleteProject Mutation

**Status:** in-progress

## What it does

Deletes a project and all its associated data (epics, tickets, chat messages).

## Checklist

- [ ] Verify user owns the project
- [ ] Delete all tickets belonging to project's epics
- [ ] Delete all epics belonging to project
- [ ] Delete all chat messages for project's epics
- [ ] Delete the project document
- [ ] Remove GitHub webhook if configured

## Notes

- This is a cascading delete — must clean up all related data
- Consider soft-delete for safety (add `deletedAt` field instead)
