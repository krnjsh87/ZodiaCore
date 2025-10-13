# development-rules.md

1. Architecture & Design
⦁	Develop the complete engine first before frontend work.
⦁	Always follow DB-first, code-after approach.
⦁	Adopt API-first design: define and document APIs before implementation.
⦁	Create and manage proper microservices for each logical unit.
⦁	Ensure service independence in microservices (no shared DB, avoid tight coupling).
⦁	Implement failure isolation and resilience (circuit breakers, retries).
⦁	Support scalability and load balancing (Kubernetes auto-scaling).
⦁	Incorporate performance optimization in backend before frontend integration.
⦁	Version APIs consistently for backward compatibility.
⦁	Prioritize data management and validation early for consistency.
⦁	Plan for parallel development using API stubs after backend completion.
⦁	Always plan for DB migrations with rollback strategies.
⦁	Support graceful deprecation of APIs.
⦁	Implement multi-agent collaboration protocols (A2A/MCP) for secure agent interoperability.
⦁	Use agentic design patterns (e.g., hierarchical supervisor–worker) for structured reasoning and task delegation.
2. Coding Standards & Best Practices
⦁	Always add proper comments (block or inline) in all files.
⦁	Create centralized files for:
⦁	API endpoints
⦁	Variables, constants
⦁	Messages, validations, alerts
⦁	Adhere to DRY (Don’t Repeat Yourself) and YAGNI (You Aren’t Gonna Need It) principles.
⦁	Avoid inline CSS as much as possible.
⦁	Do not rely on third-party/inbuilt libraries unless absolutely necessary.
⦁	Promote readability, resilience, and reuse (3Rs) in code.
⦁	Define a standardized error handling strategy (structured error objects, consistent codes).
⦁	Use LLMs to detect redundant or suboptimal code and propose optimizations.
3. Documentation
⦁	For each feature/module, create a README explaining usage, technical details, and dependencies.
⦁	Maintain architecture overviews and technical documentation beyond README files.
⦁	Document agent capabilities, limitations, and oversight boundaries.
⦁	Ensure documentation includes ethical considerations when handling sensitive data (privacy, fairness).
4. Testing & Quality
⦁	Conduct regular code reviews for all changes.
⦁	Implement comprehensive testing with at least 80% coverage.
⦁	Integrate early validation & verification (V&V) of system behavior.
⦁	Use contract testing to ensure frontend and backend stay aligned.
⦁	Address technical debt proactively during development.
⦁	Define evaluation benchmarks to measure agent performance, autonomy, and safety.
5. Security
⦁	Apply security-first principles from the start.
⦁	Enforce least privilege access, input validation, and secure API design.
⦁	Never hardcode secrets; use a secrets manager (Vault, AWS Secrets, etc.).
⦁	Integrate dependency vulnerability scans into CI/CD.
⦁	Apply AI-specific threat modeling (prompt injection, data poisoning, adversarial inputs).
⦁	Ensure regulatory compliance (e.g., data privacy in sensitive domains).
6. DevOps & Process
⦁	Use Docker and Kubernetes effectively.
⦁	Use version control with branching strategies and semantic versioning.
⦁	Automate CI/CD pipelines (build, test, deploy).
⦁	Ensure every commit runs linting, tests, and security scans before merging.
⦁	Maintain a lock file or manifest for dependencies.
⦁	Align with DevOps goals: faster feedback and continuous improvement.
⦁	Track metrics like velocity, business value, and defect rate.
⦁	Encourage agile practices for large-scale projects.
⦁	Provide a great developer experience with clear tools and processes.
⦁	Pilot with guardrails and escalation paths (AI agent must escalate uncertain cases to humans).
7. Observability & Monitoring
⦁	Expose health check endpoints for all microservices.
⦁	Implement centralized logging with correlation IDs for tracing requests.
⦁	Add metrics (Prometheus/Grafana compatible) for latency, throughput, errors.
⦁	Enable continuous monitoring and anomaly detection.
⦁	Regularly update agents based on performance data and emerging trends.
8. Configuration & Resource Management
⦁	Store all configuration in environment variables (12-factor app principle).
⦁	Optimize for resource efficiency (CPU, memory, storage).
⦁	Regularly monitor cost implications of scaling infrastructure.