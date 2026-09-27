<div align="center">

<img src="https://static.wixstatic.com/media/aec640_ec489547dc9847f4aceef2969b8376e2~mv2.png" alt="INFUSE Logo" width="180" />

# INFUSE Cursor Plugin

**Observe execution. Understand state. Regulate what happens next.**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![MCP Protocol](https://img.shields.io/badge/MCP%20Protocol-2024--11--05-green.svg)](https://modelcontextprotocol.io/)
[![MCP Transport](https://img.shields.io/badge/Transport-Streamable_HTTP-orange.svg)](https://infuse-api.adorbistech.com/mcp)
[![INFUSE MCP](https://img.shields.io/badge/INFUSE%20MCP-v1.30.0-blueviolet.svg)](https://infuse-api.adorbistech.com/mcp)

[Official Website](https://infuse.adorbistech.com/) • [GitHub Repository](https://github.com/adorbistech/infuse-cursor) • [Remote MCP Endpoint](https://infuse-api.adorbistech.com/mcp)

</div>

---

## What is INFUSE?

**INFUSE** is an execution intelligence and runtime governance platform designed for autonomous AI agents, multi-agent systems, and production LLM workloads.

As AI agents operate autonomously across complex toolchains and environments, engineering teams require deep observability, deterministic execution safety, and real-time intervention capabilities. INFUSE provides unified runtime observation, evaluated execution states, policy enforcement, and operational execution control boundaries without intrusive changes to underlying model logic.

---

## What This Repository Is

This repository contains the official **INFUSE Cursor Plugin** adapter.

It provides the integration interface that exposes INFUSE capabilities directly to the Cursor editor environment via the Model Context Protocol (MCP).

> [!NOTE]
> **Adapter Boundary Notice**
>
> This repository is an integration adapter. It does not reimplement or duplicate the INFUSE governance engine, policy evaluator, or execution boundary. All governance decisions, runtime telemetry evaluation, routing logic, and state management are executed centrally by the authoritative INFUSE Core service.

---

## Architecture

The INFUSE integration follows a strict client-adapter-core architecture:

```text
┌─────────────────────────────────────────────────────────┐
│                      Cursor Agent                       │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  INFUSE Cursor Plugin                   │
│          (.cursor-plugin/plugin.json + mcp.json)        │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    INFUSE Remote MCP                    │
│        Streamable HTTP Transport (2024-11-05)           │
│        https://infuse-api.adorbistech.com/mcp           │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                       INFUSE Core                       │
├────────────────────────────┬────────────────────────────┤
│ • Execution Context        │ • Observation & Telemetry  │
│ • Classification           │ • Execution State Evaluator│
│ • Registry & Routing       │ • Governor Engine          │
│ • Lifecycle Management     │ • Policy Enforcement       │
│ • Control Boundary         │ • Cost & Token Tracking    │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                 Agent / Provider Runtime                │
│             (LLMs, Tools, APIs, Services)               │
└─────────────────────────────────────────────────────────┘
```

---

## ONE CORE, MANY ADAPTERS

INFUSE operates on the foundational principle of **ONE CORE, MANY ADAPTERS**:

- **Centralized Intelligence & State**: The core intelligence, execution state models, historical metrics, and governance policies live exclusively within the centralized INFUSE backend.
- **Uniform Governance**: Whether an agent is invoked via the REST API, the Python/TypeScript SDKs, CLI agents, IDE extensions, or MCP clients, identical governance policies and telemetry standards apply.
- **Thin Adapters**: The Cursor Plugin acts strictly as a lightweight adapter surface, discovering the remote MCP server and passing tool invocations seamlessly to the production backend.

---

## Remote MCP Configuration

The INFUSE Cursor Plugin connects directly to the canonical remote MCP endpoint:

- **Endpoint URL**: `https://infuse-api.adorbistech.com/mcp`
- **Transport**: Streamable HTTP (`text/event-stream`)
- **Protocol Version**: `2024-11-05`
- **Server Name**: `infuse`
- **Server Version**: `1.30.0`

---

## MCP Capabilities & Tool Surface

The INFUSE MCP server exposes 12 canonical tools categorized across execution, telemetry observation, governance, and operational control:

| Category | Tool | Description |
| :--- | :--- | :--- |
| **Execution** | `infuse_execute` | Submit a governed AI execution task through INFUSE and return canonical execution results including cost, token metrics, Governor decisions, and execution state. |
| **Observation & Events** | `infuse_get_execution` | Retrieve summary telemetry, status, and metadata for a specific execution by ID. |
| | `infuse_get_execution_state` | Inspect the evaluated execution state, current phase, and associated reason codes. |
| | `infuse_get_execution_result` | Retrieve the final execution result or detailed telemetry summary. |
| | `infuse_list_executions` | List and filter historical execution runs across projects and sessions. |
| | `infuse_list_events` | List structured telemetry and lifecycle events recorded during an execution run. |
| | `infuse_publish_event` | Publish custom execution telemetry events using the canonical INFUSE event envelope. |
| **Governance & Policy** | `infuse_get_policy` | Retrieve an existing governance policy configuration or view the active default policy. |
| | `infuse_list_policies` | List all available governance policies and identify the currently active policy. |
| | `infuse_update_policy` | Create or update governance policy rules, thresholds, and operational constraints. |
| | `infuse_get_governor_decision` | Inspect real-time Governor regulation actions, intervention rationales, and reason codes. |
| **Operational Control** | `infuse_control` | Dispatch runtime operational control signals (`CONTINUE`, `THROTTLE`, `SWITCH`, `STOP`) through the Execution Control Boundary. |

---

## Governance Model

Governance in INFUSE is evaluated in real time at the core layer. During agent execution, the **Governor** assesses execution state, policy compliance, resource consumption, and error rates to render authoritative regulation decisions:

- **`CONTINUE`**: Execution is within normal operating bounds; proceed as requested.
- **`OPTIMIZE`**: Execution is approved with active optimization hints (e.g., token reduction, model downgrade recommendation).
- **`THROTTLE`**: Rate limits, budget pacing, or resource constraints require delayed or batched execution.
- **`SWITCH`**: Runtime failures, latency spikes, or policy constraints require rerouting to an alternate provider or model fallback.
- **`STOP`**: Hard threshold violation, security policy breach, or anomaly detection; execution is halted immediately.

---

## Execution Control Boundary

The **Execution Control Boundary (ECB)** is the deterministic safety boundary enforced by INFUSE Core.

When operational control commands (such as `STOP`, `THROTTLE`, `SWITCH`, or `CONTINUE`) are issued via `infuse_control`, they are validated and processed through the ECB. The Cursor adapter cannot bypass, override, or suppress ECB decisions, ensuring that administrative policies and safety interventions remain strictly enforced.

---

## Security

- **Zero Credential Exposure**: The Cursor plugin does not store, process, or transmit model provider credentials or API secrets.
- **Authorization & Isolation**: All MCP interactions are authenticated and authorized directly against the remote INFUSE infrastructure.
- **Boundary Preservation**: The plugin does not bypass or disable any policy evaluation, execution state validation, or Governor decisions.

For vulnerability reporting and disclosure procedures, please review our [Security Policy](SECURITY.md).

---

## Local Development & Structure

### Repository Layout

```text
infuse-cursor/
├── .cursor-plugin/
│   └── plugin.json       # Cursor plugin manifest
├── mcp.json              # MCP server configuration
├── README.md             # Project documentation
├── SECURITY.md           # Security disclosure policy
└── LICENSE               # Apache-2.0 license
```

### Cloning

```bash
git clone https://github.com/adorbistech/infuse-cursor.git
cd infuse-cursor
```

---

## MCP Configuration

The plugin defines its remote server in `mcp.json`:

```json
{
  "mcpServers": {
    "infuse": {
      "url": "https://infuse-api.adorbistech.com/mcp"
    }
  }
}
```

---

## Local Cursor Testing

To test the plugin locally in Cursor before installation from the marketplace:

1. **Symlink to Cursor's Local Plugin Directory**:
   ```bash
   mkdir -p ~/.cursor/plugins/local
   ln -sfn /path/to/infuse-cursor ~/.cursor/plugins/local/infuse
   ```
2. **Reload Cursor**:
   - Open the Command Palette (`Cmd + Shift + P` on macOS / `Ctrl + Shift + P` on Windows/Linux).
   - Run: `Developer: Reload Window`.
3. **Verify Installation**:
   - Navigate to **Cursor Settings > Features > MCP / Plugins**.
   - Verify that `infuse` is recognized and connected to `https://infuse-api.adorbistech.com/mcp`.

---

## Project Status

- **Version**: `0.1.0`
- **Integration**: Cursor Plugin + Remote MCP Server
- **Transport Protocol**: Streamable HTTP (`text/event-stream`, Protocol `2024-11-05`)
- **Validation Status**:
  - [x] Manifest validation (`plugin.json`)
  - [x] MCP configuration schema validation (`mcp.json`)
  - [x] Remote MCP initialize handshake (`200 OK`, `v1.30.0`)
  - [x] Protocol version compatibility (`2024-11-05`)
  - [x] 12-tool surface discovery and structural verification
  - [x] Architectural separation and boundary preservation

---

## Marketplace Submission

- **Marketplace Publishing Portal**: [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish)
- **Plugin Repository**: [github.com/adorbistech/infuse-cursor](https://github.com/adorbistech/infuse-cursor)

---

## Related INFUSE Interfaces

The centralized INFUSE Core provides unified governance and execution intelligence across diverse environments:

- **REST API**: Direct HTTP integration for backend services and custom pipelines.
- **INFUSE SDK**: Native language client libraries for Python and TypeScript/Node.js.
- **Model Context Protocol (MCP)**: Native integration for MCP-enabled clients and autonomous agents.
- **Cursor Plugin**: Tailored IDE adapter for agentic developer workflows.
- **OpenAI / Custom Clients**: Drop-in proxy and gateway surfaces for standard agent frameworks.

---

## License

This project is licensed under the [Apache License, Version 2.0](LICENSE).
