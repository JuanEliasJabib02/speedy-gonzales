/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as analytics from "../analytics.js";
import type * as auth from "../auth.js";
import type * as crons from "../crons.js";
import type * as epics from "../epics.js";
import type * as errors from "../errors.js";
import type * as files from "../files.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as lib_epicStatusEngine from "../lib/epicStatusEngine.js";
import type * as lib_planParser from "../lib/planParser.js";
import type * as loopCycles from "../loopCycles.js";
import type * as model_gitProvider from "../model/gitProvider.js";
import type * as model_groupFiles from "../model/groupFiles.js";
import type * as model_parseRepoUrl from "../model/parseRepoUrl.js";
import type * as model_providers_bitbucket from "../model/providers/bitbucket.js";
import type * as model_providers_github from "../model/providers/github.js";
import type * as model_providers_index from "../model/providers/index.js";
import type * as projects from "../projects.js";
import type * as schema_epics from "../schema/epics.js";
import type * as schema_loopCycles from "../schema/loopCycles.js";
import type * as schema_projects from "../schema/projects.js";
import type * as schema_tickets from "../schema/tickets.js";
import type * as schema_users from "../schema/users.js";
import type * as tickets from "../tickets.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  auth: typeof auth;
  crons: typeof crons;
  epics: typeof epics;
  errors: typeof errors;
  files: typeof files;
  helpers: typeof helpers;
  http: typeof http;
  "lib/epicStatusEngine": typeof lib_epicStatusEngine;
  "lib/planParser": typeof lib_planParser;
  loopCycles: typeof loopCycles;
  "model/gitProvider": typeof model_gitProvider;
  "model/groupFiles": typeof model_groupFiles;
  "model/parseRepoUrl": typeof model_parseRepoUrl;
  "model/providers/bitbucket": typeof model_providers_bitbucket;
  "model/providers/github": typeof model_providers_github;
  "model/providers/index": typeof model_providers_index;
  projects: typeof projects;
  "schema/epics": typeof schema_epics;
  "schema/loopCycles": typeof schema_loopCycles;
  "schema/projects": typeof schema_projects;
  "schema/tickets": typeof schema_tickets;
  "schema/users": typeof schema_users;
  tickets: typeof tickets;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
