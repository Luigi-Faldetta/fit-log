# Claude AI Assistant Guidelines

## Commit Message Rules
- **NEVER mention "Claude Code" in commit messages**
- Keep commit messages professional and focused on the changes made
- Do not include AI attribution in commits

## Project Overview
Fit-Log - A fitness tracking application with workout management, exercise tracking, and analytics features.

## Git Branch Management Rules

### IMPORTANT: Development Branch Only
- **ALWAYS work on the `development` branch** for any code changes
- **NEVER make direct changes to the `main` branch**
- **NEVER merge to main without explicit user approval after testing**

### Workflow
1. Before starting any work: `git checkout development`
2. Make all changes in the development branch
3. Commit changes to development branch when complete
4. Push development branch to remote
5. Only merge to main after:
   - All features are complete
   - Testing has been performed
   - User explicitly approves the merge

### Git Commands Reference
```bash
# Always start with:
git checkout development

# After making changes:
git add .
git commit -m "descriptive message"
git push origin development

# Only when explicitly approved by user:
git checkout main
git merge development
git push origin main
```

## Current Integration Task
Integrating redesigned React components with modern UI/UX inspired by DeepMind's Project Mariner design system.

### Component Migration Strategy
- Incremental approach: component by component
- Maintain backward compatibility initially
- Test each component in isolation
- Keep old components temporarily for fallback

## Testing Requirements
Before merging to main:
- Verify all components render correctly
- Test API integrations
- Check responsive design
- Ensure no breaking changes
- Run linting and type checking if available

## Project Structure
```
fit-log/
├── client/          # React frontend
├── server/          # Node.js backend
├── redesigned-components/  # New UI components to integrate
└── CLAUDE.md       # This file
```

## Environment Setup
- Frontend runs on: http://localhost:5173
- Backend runs on: http://localhost:3000
- Database: PostgreSQL (local development)