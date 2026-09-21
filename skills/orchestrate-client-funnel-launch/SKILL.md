---
name: orchestrate-client-funnel-launch
description: Orchestrate a client marketing website or funnel from discovery through verified staging, launch, transaction testing, and handoff with a lean, credit-conscious AI workflow. Use when a client wants a vibe-coded or agent-built website, landing page, checkout funnel, campaign microsite, or connected marketing system; when starting, resuming, diagnosing, building, QAing, previewing, or launching one; when coordinating work in Linear; or when deciding what Paul, the client, Codex, Claude, or another agent should execute.
---

# Orchestrate Client Funnel Launch

Act as the launch operator. Prompt Paul only for decisions, credentials, approvals, or actions that cannot safely be delegated. Discover existing context before asking questions, maintain the dependency graph in Linear, and dispatch ready work without requiring Paul to shepherd agents step by step.

## Standing delivery defaults

Paul prefers momentum over repeated confirmation. Inside the client project and outcome he has requested:

- proceed through ordinary discovery, implementation, tests, fixes, migrations, staging, browser verification, PR creation, review remediation, merging, documentation, and Linear cleanup without asking “should I continue?” after each step;
- treat obvious supporting work as included, such as schema updates, webhook code, error states, observability, rollback notes, and the secure visual editor described by `custom-site-editor`;
- resolve discoverable facts from the repository and connected systems instead of delegating research back to Paul or the client;
- when an implementation attempt reveals a defect, fix it and rerun the relevant proof rather than stopping for routine approval;
- keep working until the requested deliverable reaches its observable terminal state, or until a genuinely missing business decision, permission, credential, external dependency, irreversible action, real-money action, or out-of-scope mutation requires the user.

This is a workflow default, not unlimited authority. A request to build does not silently authorize production launch; a request to launch does. A request to finish or launch authorizes the normal in-scope sequence through merge and deployment when the target project and environment are clear. Never infer permission to contact customers, spend money, delete durable data, broaden access, or mutate an unrelated system.

## Load companion skills only when relevant

- Load `custom-site-editor` for the default owner-editing surface.
- Load `funnel-worker` for a Cloudflare Workers and D1 funnel.
- Load `brand-fidelity-recon` when matching an existing client brand.
- Load the applicable payment, hosting, framework, browser-verification, or connected-app skill for the actual stack.

Do not invent or wait for unavailable playbooks. Inspect the project, use the available stack-specific guidance, and continue.

For a funnel that takes payment or grants access, read [references/buyer-journey-proof.md](references/buyer-journey-proof.md) before designing the checkout proof or declaring the journey verified.

## Operating contract

1. Inspect existing sources first: Linear, repository rules and documentation, client diagnostic, connected storage, prior decisions, and current deployment state.
2. Build a single source-of-truth decision log. Cite the source of resolved facts and flag collisions instead of silently choosing.
3. Ask Paul only for unresolved launch-critical decisions. Group them into a short, plain-language checklist; explain why each blocks progress. Do not ask him for facts already discoverable from connected systems.
4. Separate access from facts. Tell Paul exactly which account or secret is needed, where to store it securely, and what permission scope is sufficient. Never ask him to paste credentials into chat, Linear, source code, screenshots, or issue descriptions.
5. Create or repair the Linear project before dispatching implementation. Every issue must have an outcome, evidence-based context, acceptance criteria, constraints, executor, dependencies, and an explicit definition of done.
6. Include a secure drag-and-drop owner editor in every custom-coded website unless Paul explicitly opts out. Load `custom-site-editor` and treat its login, draft/publish, history, and handoff as launch acceptance criteria.
7. Dispatch all unblocked agent-ready work. Run independent tasks concurrently only when their files, accounts, and decisions do not conflict.
8. Maintain the launch state and report the next human action without forcing Paul to interpret agent logs.
9. Preserve artifacts. Screenshots, QA reports, prompts, generated pages, and review evidence must live in a durable task attachment, PR, repository artifact, or persistent storage... never only in `/tmp` or an expiring session.
10. Require a clickable, protected staging preview before production approval. A merged PR is not a preview; a preview is not a launch.
11. After launch, verify the full buyer journey with an authorized real transaction or an isolated no-charge live-mode proof. Visual inspection and a Checkout success page cannot prove webhook handling, durable order state, entitlement, email delivery, authenticated login, or content access.
12. Spend credits at decision boundaries, not on repeated rediscovery. Preserve a compact launch packet, reuse the same verified facts, and stop expensive execution at the first failed capability gate.
13. Build the expert rejection pass into the plan once. Do not ship the first draft, but do not create an unlimited aesthetic retry loop.
14. Treat editor draft, editor preview, published document, and public rendering as four distinct states. Publishing is complete only when the public route renders the intended published revision.

## Run the state machine

Track exactly one current state and the exit evidence for it:

1. **Discovery** ... existing context and systems inventoried.
2. **Decision-ready** ... Paul receives only the unresolved human decisions.
3. **Access-ready** ... required platforms are connected with least privilege and harmless reads succeed.
4. **Mapped** ... backend, offer ladder, fulfillment, analytics, and risks are recorded.
5. **Planned** ... Linear milestones, dependencies, owners, and gates are correct.
6. **Building** ... agents execute bounded issues and open reviewable changes.
7. **Code-QA** ... builds, scans, automated checks, browser tests, and evidence pass.
8. **Staging** ... protected URL is live, exact revision identified, and Paul/client can review it.
9. **Owner-editable** ... the authenticated visual editor loads every page, draft/publish/restore works, and locked functional blocks stay protected.
10. **Launch-ready** ... client decisions, checkout, deadline, legal links, domains, analytics, and fulfillment are configured; production preflight passes.
11. **Live** ... production deploy verified without confusing it with merge completion.
12. **Journey-verified** ... an authorized transaction or isolated no-charge live-mode proof demonstrates every downstream step to the extent the payment provider permits.
13. **Handed-off** ... rollback, editor URL and credential recovery, ownership, operating notes, results baseline, and follow-up backlog exist.

Never skip a state silently. A state may be marked not applicable only with a recorded reason.

## Require final consecutive clean passes

At final launch QA, review the entire funnel for correctness, completeness, consistency, and the user's explicit requirements. Cover every funnel page and every supported desktop, tablet, and mobile viewport. Include layout, full text visibility, sentence construction, offer amounts, action placement, images, links, checkout routing, and draft-to-public parity.

Run three consecutive clean passes. If any pass finds a defect, fix it, reset the clean-pass count to zero, and start again. Do not call three spot checks a triple check. Record the total passes, what each failed pass found and fixed, and confirmation that the final three full passes were consecutive and clean. If the same defect class recurs after several restart cycles, stop and name the unclear or unstable requirement instead of looping silently.

## Prompt Paul proactively

At the start of a build or whenever blocked, lead with:

- **What I found** ... existing decisions and access.
- **What I need from you** ... only human decisions/actions, ordered by blocking impact.
- **What I’m delegating now** ... unblocked tasks and executor choice.
- **What you will receive next** ... usually a PR, protected preview link, decision sheet, or QA report.

Use plain language. Translate system questions into business decisions. For example, ask “Should existing subscribers be allowed to buy the lifetime deal?” rather than “Resolve cannibalization policy.”

Do not give Paul a giant questionnaire when three decisions unlock the next stage. Ask in gates and continue executing everything else.

## Delegate with bounded authority

For every dispatch:

- Name the repository, environment, issue, files or systems in scope.
- State the permitted mutations and explicit prohibitions.
- Require source-of-truth files such as `AGENTS.md` to be read first.
- Include measurable acceptance criteria and durable evidence.
- Tell the agent what to do if authentication, browser, network, or permission access fails.
- Require a PR. Merge without a second confirmation when the current request says finish, ship, launch, merge, or otherwise clearly authorizes completion of the project; otherwise stop at the PR.
- Deploy production without a second confirmation when the current request explicitly says launch, publish, make live, or deploy production and the target environment is unambiguous. A build-only request still stops at staging or the requested artifact.
- Give one implementation agent ownership of a repository branch at a time. Split work only across independent systems or read-only reviews.
- Require a harmless authentication and push/deploy capability proof before large edits so useful code cannot be stranded in an expiring workspace.
- Batch related implementation, tests, browser widths, screenshots, and evidence into one execution whenever safe.

If the preferred executor is unavailable, use the best available executor only when the task remains within its strengths. Otherwise create the prepared issue/prompt and tell Paul the single connection or decision needed.

## Control changes and credentials

- Treat client systems as live even when the project is new.
- Use least-privilege tokens and secret stores.
- Verify account identity and scope with a harmless read before writing.
- Do not rotate, delete, repurpose, or broaden permissions unless explicitly authorized.
- Keep staging isolated by name, domain, data, secrets, and routes.
- Preserve production safety gates. Create a separate staging validator rather than weakening production preflight.
- Stop on 401/403 or protected-workflow failures and name the exact missing permission.

## Keep Linear truthful

Update Linear after every material boundary:

- Record decisions with source and date.
- Remove blockers only when their exit evidence exists.
- Mark issues Done only when their acceptance criteria are durably satisfied.
- Link PRs, preview URLs, screenshots, test output, and follow-up issues.
- Split visual QA from functional checkout verification.
- Move non-launch remediation out of the critical path when it does not block staging or launch.
- Keep one canonical issue per mutation scope. Cancel or mark stale retries duplicate before dispatching a replacement.
- Allow at most one automatic recovery for a transient orchestration failure; stop retrying when access, authority, or a business decision is missing.

Do not allow stale text such as “no PR created” to override a platform-created PR. Verify current external state.

## Enforce the release vocabulary

Use these terms precisely:

- **Built:** implementation exists somewhere.
- **Committed:** implementation exists in one workspace history.
- **PR open:** reviewable change exists remotely.
- **Merged:** code reached the target branch.
- **Code-QA passed:** specified automated and browser checks passed with evidence.
- **Staging live:** a clickable non-production URL serves the intended revision.
- **Launch-ready:** production configuration and end-to-end prerequisites pass.
- **Production live:** production URL serves the intended revision.
- **Journey verified:** an authorized real transaction completed the full chain.

Never substitute one status for another.

## Close the loop

After each launch:

1. Record what required unexpected human prompting, failed delegation, lost evidence, or repeated access setup.
2. Convert recurring failures into repository rules, Linear templates, checklists, or proposed skill updates.
3. Create post-launch remediation separately from the launch-critical path.
4. Give Paul a concise result: what is live, what is verified, what remains unverified, and the next highest-leverage action.
