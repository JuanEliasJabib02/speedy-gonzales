# Security: Endpoint Hardening

**Status:** todo
**Priority:** high

## Overview

Several HTTP endpoints are unprotected or weakly protected: the GitHub webhook accepts unsigned payloads when no secret is configured, the autonomous loop endpoints are public when `LOOP_API_KEY` is unset, and `updateStatus` accepts arbitrary string values. This feature locks down all HTTP endpoints.

Addresses audit findings #5, #6, #7, #24.

## Still needs

- [ ] Require webhook signature verification always (block if no secret)
- [ ] Require `LOOP_API_KEY` always on autonomous loop endpoints
- [ ] Add status value validation to all status update paths
