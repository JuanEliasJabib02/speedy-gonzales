# Performance: Indexes & Query Optimization

**Status:** todo
**Priority:** medium

## Overview

`getActiveLoopProjects` and `getAllActiveProjects` do full table scans filtering in memory. At scale this is a performance bottleneck. Adding proper indexes and optimizing queries fixes this.

Addresses audit findings #11, #12.

## Still needs

- [ ] Add `autonomousLoop` index to projects table
- [ ] Optimize `getActiveLoopProjects` to use index instead of full scan
