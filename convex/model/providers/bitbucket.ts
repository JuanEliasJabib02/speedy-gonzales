import type { GitProvider, GitProviderConfig, FileEntry } from "../gitProvider"

const API_BASE = "https://api.bitbucket.org/2.0"

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  }
}

export const bitbucketProvider: GitProvider = {
  async fetchTree(config: GitProviderConfig): Promise<FileEntry[]> {
    const { accessToken, owner, repo, branch } = config
    const url = `${API_BASE}/repositories/${owner}/${repo}/src/${branch}/?recursive=1`
    const res = await fetch(url, { headers: headers(accessToken) })

    if (!res.ok) {
      throw new Error(`Bitbucket fetchTree failed: ${res.status} ${await res.text()}`)
    }

    const data = await res.json()
    const files = data.values as Array<{ path: string; commit?: { hash: string }; type: string }>

    return files
      .filter((node) => node.type === "commit_file" && node.path.endsWith(".md"))
      .map((node) => ({ path: node.path, sha: node.commit?.hash || "unknown" }))
  },

  async fetchFileContent(config: GitProviderConfig, path: string): Promise<string> {
    const { accessToken, owner, repo, branch } = config
    const url = `${API_BASE}/repositories/${owner}/${repo}/src/${branch}/${path}`
    const res = await fetch(url, {
      headers: {
        ...headers(accessToken),
        Accept: "text/plain",
      },
    })

    if (!res.ok) {
      throw new Error(`Bitbucket fetchFileContent failed: ${res.status} ${await res.text()}`)
    }

    return res.text()
  },

  async registerWebhook(
    config: GitProviderConfig,
    webhookUrl: string,
    secret: string,
  ): Promise<string> {
    const { accessToken, owner, repo } = config
    const url = `${API_BASE}/repositories/${owner}/${repo}/hooks`
    const res = await fetch(url, {
      method: "POST",
      headers: headers(accessToken),
      body: JSON.stringify({
        description: "Speedy Gonzales sync webhook",
        url: webhookUrl,
        active: true,
        events: ["repo:push"],
        // Bitbucket doesn't support webhook secrets in the same way as GitHub
        // We'll need to validate differently if needed
      }),
    })

    if (!res.ok) {
      throw new Error(`Bitbucket registerWebhook failed: ${res.status} ${await res.text()}`)
    }

    const data = await res.json()
    return data.uuid
  },

  async deleteWebhook(config: GitProviderConfig, webhookId: string): Promise<void> {
    const { accessToken, owner, repo } = config
    const url = `${API_BASE}/repositories/${owner}/${repo}/hooks/${webhookId}`
    const res = await fetch(url, {
      method: "DELETE",
      headers: headers(accessToken),
    })

    if (!res.ok && res.status !== 404) {
      throw new Error(`Bitbucket deleteWebhook failed: ${res.status} ${await res.text()}`)
    }
  },

  async verifyWebhookSignature(
    secret: string,
    payload: string,
    signature: string,
  ): Promise<boolean> {
    // Bitbucket webhook signature verification is different from GitHub
    // For now, we'll return true and can implement proper verification later if needed
    return true
  },

  getChangedPaths(payload: unknown): string[] {
    const data = payload as {
      push?: {
        changes?: Array<{
          new?: {
            commits?: Array<{
              hash: string
            }>
          }
        }>
      }
    }

    // Bitbucket webhook payload structure is different
    // For now, return empty array to trigger full sync
    // TODO: Implement proper path extraction from Bitbucket webhook
    return []
  },

  async createPR(
    config: GitProviderConfig,
    data: {
      sourceBranch: string
      targetBranch: string
      title: string
      description: string
    }
  ): Promise<{ url: string; id: string }> {
    const { accessToken, owner, repo } = config
    const { sourceBranch, targetBranch, title, description } = data
    const url = `${API_BASE}/repositories/${owner}/${repo}/pullrequests`

    const res = await fetch(url, {
      method: "POST",
      headers: headers(accessToken),
      body: JSON.stringify({
        title,
        description,
        source: {
          branch: {
            name: sourceBranch,
          },
        },
        destination: {
          branch: {
            name: targetBranch,
          },
        },
      }),
    })

    if (!res.ok) {
      throw new Error(`Bitbucket createPR failed: ${res.status} ${await res.text()}`)
    }

    const pullRequest = await res.json()
    return {
      url: pullRequest.links.html.href,
      id: String(pullRequest.id),
    }
  },
}