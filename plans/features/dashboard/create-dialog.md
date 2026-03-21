# Create Project Dialog

**Status:** todo

## What it does

A dialog form for creating new projects. Has fields for project name, description, and GitHub repo URL.

## Checklist

- [x] Create dialog using shadcn Dialog component
- [x] Add name input (required)
- [x] Add description input (optional)
- [x] Add repo URL input (github.com/owner/repo format)
- [x] Cancel and Create buttons in footer
- [ ] Wire to `useMutation(api.projects.createProject)`
- [ ] Add validation (non-empty name, valid repo URL)

## Files

- `src/app/[locale]/(app)/dashboard/_components/CreateProjectDialog.tsx`
