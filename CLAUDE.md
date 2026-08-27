# CLAUDE.md

**Read [AGENTS.md](AGENTS.md) first** — it is the canonical map and rulebook for this repo. Everything there applies to Claude Code sessions.

Claude-specific notes:

- Working language of the codebase and docs is English; client-facing site content is EN + ES.
- When a task touches scope (anything resembling booking, availability, payments, scheduling, notifications), check [docs/FUTURE_MODULES.md](docs/FUTURE_MODULES.md) before writing code — the default answer is "documented, not built."
- When you make a non-obvious technical choice, append it to [docs/DECISIONS.md](docs/DECISIONS.md) in the same PR.
- Verification standard before saying "done" is defined in AGENTS.md → *Definition of done*. Follow it literally and report what was actually run.
- Design source of truth: the Claude Design project "CR Mariposa 1C Refined" (Classical design system — tokens summarized in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#design-reference)).
