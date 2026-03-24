# Optimistic Updates Rule

## Default: use `withOptimisticUpdate` for simple mutations

When a mutation only changes a field value (status, order, name) or removes a record,
use `.withOptimisticUpdate()` instead of local loading state + spinner.

### When to use optimistic updates

- Status changes (e.g. `backlog → todo`, `review → completed`)
- Deleting a record from a list
- Reordering items
- Toggling a boolean field

### When NOT to use optimistic updates

- The mutation triggers side effects the UI must reflect (e.g. creates related records)
- The mutation can fail frequently due to validation or permissions — rollback UX ("appeared then disappeared") is jarring
- You need a confirm dialog before acting — keep `showXxxDialog` state (it's UI state, not loading state)

## Pattern

```ts
const promoteToTodo = useMutation(api.epics.promoteToTodo)
  .withOptimisticUpdate((localStore, { epicId }) => {
    const current = localStore.getQuery(api.epics.getByProject, { projectId })
    if (!current) return
    localStore.setQuery(api.epics.getByProject, { projectId },
      current.map(e => e._id === epicId ? { ...e, status: "todo" } : e)
    )
  })

const deleteEpic = useMutation(api.epics.deleteEpic)
  .withOptimisticUpdate((localStore, { epicId }) => {
    const current = localStore.getQuery(api.epics.getByProject, { projectId })
    if (!current) return
    localStore.setQuery(api.epics.getByProject, { projectId },
      current.filter(e => e._id !== epicId)
    )
  })
```

## What disappears with optimistic updates

- `isDeleting`, `isPromoting`, `isApproving` loading states → **gone**
- Spinners on action buttons → **gone**
- `disabled` during mutation → optional, but low value since UI already updated

## What stays

- `showDeleteDialog` — this is UI state, not loading state. Keep it.
- Any state unrelated to the mutation's in-flight status.
