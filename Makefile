.PHONY: dev electron-smoke check test typecheck lint format docs deploy help

dev: ## Install dependencies, validate, and start the extracted Electron app
	@echo "Installing root dependencies..."
	@pnpm install
	@echo "Installing deobfuscation skill dependencies..."
	@cd .agents/skills/deobfuscate-javascript && bun install
	@pnpm run docs:check
	@pnpm run electron:dev

electron-smoke: ## Validate and smoke-test the extracted Electron app launch
	@pnpm run electron:smoke

check: ## Run all quality checks
	@pnpm run check

test: ## Run deobfuscation skill tests
	@pnpm run test

typecheck: ## Run TypeScript type check on the deobfuscation skill
	@pnpm run typecheck

lint: ## Run linter
	@pnpm run lint

format: ## Run formatter
	@pnpm run format

docs: ## Validate documentation structure
	@pnpm run docs:check

deploy: ## Deploy the project
	@echo "See docs/operations/deployment.md for deployment options"

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-12s %s\n", $$1, $$2}'
