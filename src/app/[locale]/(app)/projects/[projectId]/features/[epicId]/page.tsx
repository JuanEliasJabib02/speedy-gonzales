"use client"

import { useParams } from "next/navigation"
import { FeatureLayout } from "./_components/FeatureLayout"

export default function FeaturePage() {
  const { projectId, epicId } = useParams<{ projectId: string; epicId: string }>()

  return <FeatureLayout projectId={projectId} epicId={epicId} />
}
