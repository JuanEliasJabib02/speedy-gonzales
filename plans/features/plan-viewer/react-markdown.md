# Full react-markdown + remark-gfm

**Status:** todo

## What it does

Replace the basic line-by-line renderer with `react-markdown` and `remark-gfm` for proper markdown rendering with GFM support.

## Checklist

- [ ] Install `react-markdown` and `remark-gfm`
- [ ] Create markdown component with custom renderers
- [ ] Support: headings, paragraphs, bold/italic, links
- [ ] Support: code blocks with syntax highlighting (optional)
- [ ] Support: GFM tables
- [ ] Support: GFM task lists (checkboxes)
- [ ] Support: strikethrough
- [ ] Style with design system tokens (no prose defaults)

## Notes

- Use `react-markdown` for the rendering
- `remark-gfm` adds GitHub Flavored Markdown support
- Custom component overrides for consistent styling with our design system
