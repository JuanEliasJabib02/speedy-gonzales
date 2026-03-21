// Provider-agnostic git interface — implement one file per provider

export type GitProviderType = "github" | "bitbucket" | "gitlab"

export type GitProviderConfig = {
  provider: GitProviderType
  accessToken: string
  owner: string
  repo: string
  branch: string
}

export type FileEntry = {
  path: string
  sha: string
}

export type GitProvider = {
  fetchTree: (config: GitProviderConfig) => Promise<FileEntry[]>
  fetchFileContent: (config: GitProviderConfig, path: string) => Promise<string>
  registerWebhook: (
    config: GitProviderConfig,
    webhookUrl: string,
    secret: string,
  ) => Promise<string> // returns webhook ID
  deleteWebhook: (config: GitProviderConfig, webhookId: string) => Promise<void>
  verifyWebhookSignature: (
    secret: string,
    payload: string,
    signature: string,
  ) => Promise<boolean>
  getChangedPaths: (payload: unknown) => string[]
}
