"use client"

import { useState } from "react"
import { FileTree } from "./FileTree"
import { FileViewer } from "./FileViewer"

type CodeViewProps = {
  projectId: string
  epicId: string
  owner: string
  repo: string
  defaultBranch?: string
}

export function CodeView({ owner, repo, defaultBranch = "main" }: CodeViewProps) {
  const [selectedFile, setSelectedFile] = useState<{ path: string; sha: string } | null>(null)
  const [branch, setBranch] = useState(defaultBranch)

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* File tree — left panel */}
      <div className="w-64 shrink-0 overflow-y-auto border-r border-border scrollbar-thin">
        <FileTree
          owner={owner}
          repo={repo}
          branch={branch}
          selectedFile={selectedFile?.path ?? null}
          onFileSelect={(path, sha) => setSelectedFile({ path, sha })}
          onBranchChange={setBranch}
        />
      </div>

      {/* File viewer — right panel */}
      <div className="flex flex-1 overflow-hidden">
        {selectedFile ? (
          <FileViewer
            owner={owner}
            repo={repo}
            path={selectedFile.path}
            ref={branch}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Select a file to view
          </div>
        )}
      </div>
    </div>
  )
}
