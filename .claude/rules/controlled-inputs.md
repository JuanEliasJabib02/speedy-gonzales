# Controlled Inputs Rule

## The problem

React warns when an input changes from uncontrolled to controlled (or vice versa). This happens when a `checked`, `value`, or similar prop is `undefined` in some renders and defined in others.

## Rules

### 1. Always set explicit `checked` on checkboxes
- `<input type="checkbox" checked={true} readOnly />` for checked
- `<input type="checkbox" checked={false} readOnly />` for unchecked
- Never omit `checked` — it makes the input uncontrolled

### 2. Always set explicit `value` on text inputs
- `<input value={someString} onChange={handler} />` for controlled
- Never let `value` be `undefined` — use `""` as default

### 3. Pick controlled or uncontrolled — never mix
- Controlled: set `value`/`checked` + `onChange` (or `readOnly`)
- Uncontrolled: use `defaultValue`/`defaultChecked`, no `value`/`checked`
- Never switch between the two during the component's lifetime
