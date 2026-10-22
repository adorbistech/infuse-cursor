# Security Policy

## Security Model & Boundaries

The **INFUSE Cursor Plugin** is a declarative adapter that integrates Cursor with the remote INFUSE Model Context Protocol (MCP) service.

### Governed Execution Paths
* **Remote MCP Tool Invocations:** Agent tool executions routed to the 12 canonical INFUSE MCP tools (`infuse_execute`, `infuse_control`, `infuse_get_execution`, `infuse_get_execution_state`, `infuse_get_execution_result`, `infuse_list_executions`, `infuse_list_events`, `infuse_publish_event`, `infuse_get_policy`, `infuse_list_policies`, `infuse_update_policy`, `infuse_get_governor_decision`) pass directly to the authoritative INFUSE Core backend.
* **Authoritative Policy & Governor Evaluation:** All task classifications, policy thresholds, Governor regulation signals (`CONTINUE`, `THROTTLE`, `SWITCH`, `STOP`), and cost/token tracking are evaluated and enforced remotely by INFUSE Core.
* **Zero Credential Storage:** The plugin does not store, intercept, persist, or transmit LLM provider API keys, user secrets, or private tokens.
* **Encrypted Transport:** All communication with the remote MCP service is conducted strictly over encrypted HTTPS (`TLS 1.2` or higher).

### Platform Boundaries (Ungoverned Routes)
* **Native Host Model Inference:** Direct Cursor model inference, token generation, and prompt interactions (e.g., Cursor Chat, Composer, Copilot) occur out-of-band directly between Cursor and LLM providers and do not route through MCP tool servers.
* **Native Cursor Tool & Editor Operations:** Direct Cursor workspace file editing, file creation/deletion, terminal executions, linting, and internal IDE actions are governed solely by Cursor platform controls and do not pass through the remote MCP server.
* **Third-Party MCP Servers:** Out-of-band MCP servers configured in Cursor settings operate independently and do not route through INFUSE.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

Adorbis takes the security of our software and services seriously. If you discover a security vulnerability within the INFUSE Cursor Plugin or any related INFUSE service, please report it responsibly.

### How to Report

Please do **NOT** report security vulnerabilities via public GitHub issues.

Instead, submit your report to:
- **Email**: security@adorbistech.com
- **Website**: [https://adorbistech.com/security](https://adorbistech.com/security)

Please include:
- A description of the issue and potential impact
- Step-by-step instructions or proof-of-concept to reproduce the behavior
- Any affected versions or environments

We appreciate your cooperation in responsibly disclosing issues and will investigate all reports promptly.
