"use client"

import { useState, useCallback } from "react"
import { Copy, Check } from "lucide-react"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-white/10"
    >
      {copied ? (
        <>
          <Check className="size-3" />
          Copied
        </>
      ) : (
        <>
          <Copy className="size-3" />
          Copy
        </>
      )}
    </button>
  )
}

export function CodeBlock({ language, code }: { language: string; code: string }) {
  const trimmedCode = code.replace(/\n$/, "")

  return (
    <div className="relative my-2 overflow-hidden rounded-md">
      {language && (
        <div className="bg-[#1e1e1e] px-3 py-1 text-xs text-muted-foreground border-b border-white/10">
          {language}
        </div>
      )}
      <CopyButton text={trimmedCode} />
      <SyntaxHighlighter
        language={language || "text"}
        style={vscDarkPlus}
        customStyle={{ margin: 0, borderRadius: language ? "0 0 0.375rem 0.375rem" : "0.375rem", fontSize: "0.8125rem" }}
      >
        {trimmedCode}
      </SyntaxHighlighter>
    </div>
  )
}

export const baseMarkdownComponents: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "")
    const codeString = String(children).replace(/\n$/, "")

    if (match) {
      return <CodeBlock language={match[1]} code={codeString} />
    }

    return (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    )
  },
  pre({ children }) {
    return <>{children}</>
  },
  a({ href, children }) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">
        {children}
      </a>
    )
  },
}

type MarkdownContentProps = {
  content: string
  components?: Components
  className?: string
}

export function MarkdownContent({ content, components, className }: MarkdownContentProps) {
  const merged = components ? { ...baseMarkdownComponents, ...components } : baseMarkdownComponents

  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={merged}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
