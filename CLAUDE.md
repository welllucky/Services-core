# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `pnpm dev` - Start development server with watch mode
- `pnpm build` - Build the application for production
- `pnpm start` - Start production server
- `pnpm start:prod` - Start production server (explicit)

### Testing
- `pnpm test` - Run unit tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:cov` - Run tests with coverage report
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm test:debug` - Run tests in debug mode

### Code Quality
- `pnpm lint` - Run ESLint with auto-fix
- `pnpm format` - Format code with Prettier

### Utilities
- `pnpm debug` - Start in debug mode with watch

## Architecture Overview

This is a NestJS-based helpdesk/service desk application with a modular architecture:

### Module Structure
- **Core Module** (`/core/*`) - Core business logic and public-facing APIs
- **Backoffice Module** (`/backoffice/*`) - Administrative functionality and management APIs
- **System Module** (`/system/*`) - System configuration, logging, and infrastructure

Both Core and Backoffice modules contain identical domain entities but serve different purposes:
- Core: Public-facing user operations
- Backoffice: Administrative operations and management

### Key Domain Entities
- **User** - System users with role-based access
- **Session** - User authentication sessions
- **Ticket** - Help desk tickets/requests
- **Sector** - Organizational departments
- **Position** - User positions/roles within sectors
- **Event** - System events and audit logging

### Database & Configuration
- Uses TypeORM with MySQL (configurable via environment)
- Database auto-synchronization enabled in development
- Environment-based configuration with multiple `.env` file support
- SSL support for database connections via `DB_CA` environment variable

### Authentication & Security
- JWT-based authentication with custom guards
- Role-based access control (RBAC)
- Rate limiting with multiple throttle configurations
- Security middleware for request tracking and response formatting

### Middleware Stack
Applied globally in this order:
1. TrackUserMiddleware - User activity tracking
2. FormatResponseMiddleware - Standardizes API responses
3. LoggerMiddleware - Request/response logging

### Testing Setup
- Jest for unit testing with custom configuration
- E2E testing support
- Coverage reports with path exclusions for entities and configs
- Test path alias mapping (`@/` → `src/`)

### Path Aliases
- `@/` maps to `src/` for cleaner imports throughout the codebase

### Code Organization
- Entities in `/entities/` - TypeORM database entities
- DTOs, interfaces, schemas, and types in `/typing/`
- Repositories in `/repositories/` - Database access layer
- Utilities in `/utils/` - Shared functions, decorators, guards, validators
- Tests co-located with modules in `/tests/` subdirectories