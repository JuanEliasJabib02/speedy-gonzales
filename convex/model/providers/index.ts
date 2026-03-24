import type { GitProvider, GitProviderType } from "../gitProvider"
import { githubProvider } from "./github"
import { bitbucketProvider } from "./bitbucket"

const providers: Record<string, GitProvider> = {
  github: githubProvider,
  bitbucket: bitbucketProvider,
}

export function getGitProvider(type: GitProviderType): GitProvider {
  const provider = providers[type]
  if (!provider) {
    throw new Error(`Git provider "${type}" is not implemented`)
  }
  return provider
}
