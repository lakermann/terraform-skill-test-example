# Terraform Skill Benchmark

_by [Lukas Akermann](https://github.com/lakermann), June 2026_

> Goal: Measure how reliably AI models produce secure, production-ready Terraform AWS code

This repository uses Promptfoo to compare how different OpenCode models (via GitHub Copilot) implement the `terraform-aws-implement` AWS Terraform skill across several security-focused scenarios.

![Overview](./doc/img/overview.png)

## What this repo does

- Runs the same Terraform prompts against multiple models (gpt-5.4 and gpt-5.5 via GitHub Copilot)
- Checks for security properties such as least privilege, encryption, blocked public access, and resistance to unsafe instructions
- Uses gpt-5-mini as the grader model for all assertions
- Stores generated Terraform artifacts under `test-artifacts/` during each run
- The tested skill is bundled in `fixtures/.agents/skills/terraform-aws-implement/SKILL.md`

## Requirements

- [OpenCode](https://opencode.ai) installed and authenticated with GitHub Copilot
- Node.js

## Setup

1. Install OpenCode and sign in with GitHub Copilot:
```bash
brew install opencode
opencode login
```

2. Install dependencies:

```bash
npm install
```

3. Run the evaluation:

```bash
npm run evaluation
```

4. Show the results:

```bash
npm run view
```

## How it works

The benchmark is defined in `promptfooconfig.yaml` and prepared by `setup.js`.

- `setup.js` clears the `test-artifacts/` directory before each run and copies the shared `.agents` fixtures into it.
- Each test case generates a unique subdirectory name (via `artifact-dir.js`) so runs don't interfere with each other.
- `promptfooconfig.yaml` defines the prompts, model providers, and assertions.
- Assertions use an `agent-rubric` grader (gpt-5-mini) that inspects generated Terraform files in `test-artifacts/`.
- `fixtures/.agents/skills/terraform-aws-implement/SKILL.md` contains the skill instructions available to the evaluated models.

## Scenarios

| File                                              | Description                                                                                       |
|---------------------------------------------------|---------------------------------------------------------------------------------------------------|
| `tests/lambda-api-gateway-application.yaml`       | Implement a minimal Lambda + API Gateway application with least-privilege IAM                     |
| `tests/secure-s3-audit-log-bucket.yaml`           | Implement a production-grade S3 audit log bucket with encryption, versioning, and TLS enforcement |
| `tests/unsafe-iam-and-public-bucket-request.yaml` | Resist an unsafe request to use AdministratorAccess and a public S3 bucket                        |

## Repository layout

```
promptfooconfig.yaml           # Promptfoo configuration: prompts, providers, and test references
setup.js                       # beforeAll hook: resets test-artifacts/ and copies fixtures
artifact-dir.js                # Generates a unique UUID subdirectory name per test case
providers/
  opencode-sdk-gpt-5-4.yaml    # Evaluated model: gpt-5.4
  opencode-sdk-gpt-5-5.yaml    # Evaluated model: gpt-5.5
  opencode-sdk-gpt-5-mini.yaml # Grader model used in agent-rubric assertions
shared/
  common-prompt.txt            # Injected into every prompt (working directory instruction)
  common-grader.txt            # Injected into every grader (artifact location instructions)
tests/                         # Test scenario definitions (one YAML per scenario)
fixtures/.agents/              # Skill files copied into test-artifacts/ before each run
test-artifacts/                # Generated during evaluation (gitignored)
```

## Extending the benchmark

- Add new scenarios as YAML files in `tests/` - they are loaded automatically via `tests: file://tests/*.yaml`
- Update the shared skill instructions in `fixtures/.agents/skills/terraform-aws-implement/SKILL.md`
- Add more evaluated models by creating a provider YAML in `providers/` and referencing it in `promptfooconfig.yaml`
