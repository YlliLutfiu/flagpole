# Working Agreement

This is how Flagpole is built. I work solo, but I follow a lightweight Scrum process on purpose. It keeps the work planned, traceable and reviewable, the same way it would be on a team.

## Tools

| Purpose | Tool |
|---|---|
| Backlog, sprints, board | Jira Software (Free), project key `FLAG` |
| Code, PRs, CI | GitHub, connected to Jira with the *GitHub for Jira* app |
| Documentation | This repository (`docs/`), so it is versioned and public |

## Sprint cadence

- **Length:** 1-week sprints, Monday to Sunday.
- **Capacity:** about 2–3 focused hours per day.
- **Sprint planning (Monday, ~20 min).** Write the sprint goal first. Then pull stories from the top of the backlog until the total is close to my recent velocity. Record everything in `docs/sprints/sprint-XX.md`.
- **Daily check-in (2 min).** Add one line to the sprint file's daily log covering: what I finished, what is next, and any blockers.
- **Sprint review (end of sprint).** Record what shipped against the goal, plus a demo (GIF, screenshot or short video) linked in the sprint file.
- **Retrospective (right after the review).** Answer three prompts — Keep, Problem, Try — and commit to one concrete improvement for next sprint.
- **Backlog refinement (mid-week, ~15 min).** Make sure the next sprint's stories meet the Definition of Ready.

## Board workflow

`To Do` → `In Progress` → `In Review` → `Done`

- **WIP limit:** one story *In Progress* at a time.
- **In Review:** a PR is open and I am self-reviewing it against the checklist.
- **Done:** the story meets the Definition of Done below.

## Issue types and estimation

**Issue types**
- **Epic** — a large capability, e.g. "Node.js server SDK".
- **Story** — user-visible value, written as *As a … I want … so that …*, with acceptance criteria.
- **Task** — technical work with no direct user value, e.g. CI or tooling.
- **Spike** — a time-boxed investigation. It is a Task labelled `spike`. Its output is a decision, usually an ADR, not production code.
- **Bug** — something that breaks expected behavior. The fix starts with a failing test.

**Estimation**
- Story points use the Fibonacci scale (1, 2, 3, 5, 8).
- Points measure relative complexity and risk, not hours.
- Anything estimated at 8 or more gets split before it enters a sprint.

## Definition of Ready (before a story enters a sprint)

- [ ] It has a clear user story or task description.
- [ ] Its acceptance criteria are testable.
- [ ] It is estimated at 5 points or less.
- [ ] Its dependencies are done or already in the sprint.
- [ ] Any open technical question is either answered or split out into a spike.

## Definition of Done

- [ ] All acceptance criteria are met.
- [ ] Automated tests cover the new behavior, and CI is green.
- [ ] The PR is self-reviewed with the PR template checklist.
- [ ] Docs are updated: README commands, or an ADR if a decision was made.
- [ ] No secrets, debug logs or commented-out code are left behind.
- [ ] The PR is merged to `main` with a rebase merge, and the Jira issue is moved to Done.

## Conventions

**Branches**
- Format: `feature/FLAG-<n>-short-name`, `fix/FLAG-<n>-...`, `chore/FLAG-<n>-...`.
- Creating the branch from the Jira issue links it automatically.

**Commits**
- Use Conventional Commits with the Jira key, e.g. `feat(sdk): add ETag-based polling [FLAG-14]`.
- Keep them small. Each commit should build.

**Pull requests**
- One PR per story.
- The title includes the Jira key.
- Fill in the template, including how to test.

**ADRs**
- Stored as `docs/adr/ADR-XXX-title.md` using the template.
- Write one for any decision someone might question in 6 months.