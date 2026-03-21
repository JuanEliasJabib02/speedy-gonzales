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
  onActiveFileChange?: (file: { path: string; content: string } | null) => void
}

export function CodeView({ owner, repo, defaultBranch = "main", onActiveFileChange }: CodeViewProps) {
  const [selectedFile, setSelectedFile] = useState<{ path: string; sha: string } | null>(null)
  const [branch, setBranch] = useState(defaultBranch)

  const handleFileSelect = (path: string, sha: string) => {
    setSelectedFile({ path, sha })
    // content will be loaded by FileViewer; we notify with null content initially
    onActiveFileChange?.({ path, content: "" })
  }

  const handleFileContentLoaded = (path: string, content: string) => {
    onActiveFileChange?.({ path, content })
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* File tree — left panel */}
      <div className="w-64 shrink-0 overflow-y-auto border-r border-border scrollbar-thin">
        <FileTree
          owner={owner}
          repo={repo}
          branch={branch}
          selectedFile={selectedFile?.path ?? undefined}
          onFileSelect={handleFileSelect}
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
            onContentLoaded={(_, content) => handleFileContentLoaded(selectedFile.path, content)}
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
