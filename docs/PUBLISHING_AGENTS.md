# Publishing Agents Guide

Learn how to publish your Claude Code subagent to the marketplace.

## Prerequisites

- A Claude Agent Hub account (sign up at claudeagenthub.dev)
- A working Claude Code subagent
- Basic understanding of agent structure

## Agent Structure

A Claude Code subagent consists of:

```
my-agent/
├── agent.md           # Agent metadata and description
├── system_prompt.md   # The main system prompt
├── tools.json         # Tool configuration
├── config.json        # Agent configuration
├── examples/          # Usage examples
│   └── basic.md
└── README.md          # Documentation
```

### Required Files

| File | Required | Description |
|------|----------|-------------|
| `system_prompt.md` | ✅ | The agent's system prompt |
| `config.json` | ✅ | Agent configuration |
| `README.md` | Recommended | Documentation for users |

### Optional Files

| File | Description |
|------|-------------|
| `tools.json` | Specify which tools the agent uses |
| `agent.md` | Additional metadata |
| `examples/` | Usage examples and tutorials |
| `CHANGELOG.md` | Version history |

## Publishing via Web UI

1. Sign in to your account
2. Navigate to **Publish** in the navigation
3. Fill in the publishing wizard:
   - **Agent Details**: Name, description, category, tags
   - **Content & Files**: System prompt, tools config, README
   - **Settings**: Version, visibility, license
   - **Review & Publish**: Final review before publishing

## Publishing via CLI (Coming Soon)

```bash
# Login
claude agent login

# Publish
claude agent publish

# Update version
claude agent publish --version 1.1.0
```

## Versioning

Use semantic versioning (semver):

- **Major (1.0.0 → 2.0.0)**: Breaking changes
- **Minor (1.0.0 → 1.1.0)**: New features, backward compatible
- **Patch (1.0.0 → 1.0.1)**: Bug fixes

## Validation

Before publishing, we automatically validate:

1. **Required Fields**: Name, description, category, tags
2. **File Structure**: Required files are present
3. **Security**: No harmful patterns in prompts
4. **Size Limits**: Files within allowed sizes
5. **Slug Format**: Valid URL slug

## Best Practices

### Writing Good Descriptions

- Be specific about what the agent does
- Mention frameworks, languages, or tools it works with
- Include use cases and examples

### Tags

- Use relevant, commonly-searched terms
- Include the primary language or framework
- Add domain-specific tags
- Maximum 15 tags

### README

Include:
- Overview and purpose
- Installation instructions
- Configuration options
- Usage examples
- Known limitations
- Contributing guidelines (if open source)

### System Prompts

- Be clear and specific about the agent's role
- Define boundaries and constraints
- Include error handling instructions
- Specify output format preferences
- Add examples of desired behavior

## Updating Your Agent

1. Navigate to your agent's page
2. Click "Edit" or publish a new version
3. Add a changelog entry
4. The new version becomes "latest"

## Promoting Your Agent

- Share on social media with the install command
- Add the AgentHub badge to your README
- Write a blog post about your agent
- Create example workflows
- Engage with reviews and feedback