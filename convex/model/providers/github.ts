import type { GitProvider, GitProviderConfig, FileEntry } from "../gitProvider"

const API_BASE = "https://api.github.com"

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  }
}

export const githubProvider: GitProvider = {
  async fetchTree(config: GitProviderConfig): Promise<FileEntry[]> {
    const { accessToken, owner, repo, branch } = config
    const url = `${API_BASE}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
    const res = await fetch(url, { headers: headers(accessToken) })

    if (!res.ok) {
      throw new Error(`GitHub fetchTree failed: ${res.status} ${await res.text()}`)
    }

    const data = await res.json()
    const tree = data.tree as Array<{ path: string; sha: string; type: string }>

    return tree
      .filter((node) => node.type === "blob" && node.path.endsWith(".md"))
      .map((node) => ({ path: node.path, sha: node.sha }))
  },

  async fetchFileContent(config: GitProviderConfig, path: string): Promise<string> {
    const { accessToken, owner, repo, branch } = config
    const url = `${API_BASE}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`
    const res = await fetch(url, {
      headers: {
        ...headers(accessToken),
        Accept: "application/vnd.github.raw+json",
      },
    })

    if (!res.ok) {
      throw new Error(`GitHub fetchFileContent failed: ${res.status} ${await res.text()}`)
    }

    return res.text()
  },

  async registerWebhook(
    config: GitProviderConfig,
    webhookUrl: string,
    secret: string,
  ): Promise<string> {
    const { accessToken, owner, repo } = config
    const url = `${API_BASE}/repos/${owner}/${repo}/hooks`
    const res = await fetch(url, {
      method: "POST",
      headers: headers(accessToken),
      body: JSON.stringify({
        name: "web",
        active: true,
        events: ["push"],
        config: {
          url: webhookUrl,
          content_type: "json",
          secret,
        },
      }),
    })

    if (!res.ok) {
      throw new Error(`GitHub registerWebhook failed: ${res.status} ${await res.text()}`)
    }

    const data = await res.json()
    return String(data.id)
  },

  async deleteWebhook(config: GitProviderConfig, webhookId: string): Promise<void> {
    const { accessToken, owner, repo } = config
    const url = `${API_BASE}/repos/${owner}/${repo}/hooks/${webhookId}`
    const res = await fetch(url, {
      method: "DELETE",
      headers: headers(accessToken),
    })

    if (!res.ok && res.status !== 404) {
      throw new Error(`GitHub deleteWebhook failed: ${res.status} ${await res.text()}`)
    }
  },

  async verifyWebhookSignature(
    secret: string,
    payload: string,
    signature: string,
  ): Promise<boolean> {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    )
    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload))
    const computed = `sha256=${Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("")}`
    return computed === signature
  },

  getChangedPaths(payload: unknown): string[] {
    const data = payload as {
      commits?: Array<{
        added?: string[]
        modified?: string[]
        removed?: string[]
      }>
    }

    if (!data.commits) return []

    const paths = new Set<string>()
    for (const commit of data.commits) {
      for (const path of commit.added ?? []) paths.add(path)
      for (const path of commit.modified ?? []) paths.add(path)
      for (const path of commit.removed ?? []) paths.add(path)
    }
    return Array.from(paths)
  },
}
