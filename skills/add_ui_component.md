# Skill: Add a shadcn/ui component

The repo uses shadcn/ui (`components.json`: style `new-york`, JSX, aliases `@/components/ui`, `@/lib/utils`) with filenames renamed to PascalCase. The rename step is inferred from existing files, not documented `[UNVERIFIED]`.

## Steps
1. Check it doesn't exist already: `ls src/components/ui/`.
2. Generate it:
   ```bash
   npx shadcn@latest add <component>
   ```
   This writes `src/components/ui/<component>.jsx` (kebab-case) and may add a Radix dependency to `package.json`.
   - If the CLI asks to overwrite existing files (e.g. `button.jsx` vs `Button.jsx` on case-insensitive filesystems), answer **no** and ask the owner.
3. Rename to PascalCase to match the repo: `<component>.jsx` → `<Component>.jsx` (e.g. `hover-card.jsx` → `HoverCard.jsx`).
4. Fix imports inside the new file to PascalCase paths (e.g. `@/components/ui/Button`).
5. Match export style: keep the named exports; add a `export default <Main>` if the component has one main export (as in `Button.jsx`, `Avatar.jsx`, `DropdownMenu.jsx`).
6. Replace stock palette classes with project tokens where obvious (`bg-bg-2`, `text-fg-2`, `border-border`); see `context/conventions.md` → Styling.
7. Run `skills/run_checks.md`.
8. Commit the new component together with any `package.json` / `package-lock.json` change.
