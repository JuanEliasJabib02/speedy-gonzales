// Extracts owner and repo name from a GitHub URL
// Handles: github.com/owner/repo, https://github.com/owner/repo, git@github.com:owner/repo.git

type RepoInfo = {
  owner: string
  repo: string
}

export function parseRepoUrl(url: string): RepoInfo {
  // Remove trailing .git
  const cleaned = url.replace(/\.git$/, "").trim()

  // Try SSH format: git@github.com:owner/repo
  const sshMatch = cleaned.match(/git@[\w.-]+:([^/]+)\/(.+)/)
  if (sshMatch) {
    return { owner: sshMatch[1], repo: sshMatch[2] }
  }

  // Try HTTPS or bare format: (https://)?github.com/owner/repo
  const httpMatch = cleaned.match(/(?:https?:\/\/)?[\w.-]+\/([^/]+)\/([^/]+)/)
  if (httpMatch) {
    return { owner: httpMatch[1], repo: httpMatch[2] }
  }

  throw new Error(`Cannot parse repo URL: ${url}`)
}
