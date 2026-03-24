#!/bin/bash
# One-time migration: push all .md plans to Convex endpoints
# Run from repo root

set -e

API_BASE="https://necessary-fish-66.convex.site"
API_KEY="G2cxJfUs41TS5tUYyGvQ6OT2cN7CfuAOOgRm+vVbMG8="
REPO_OWNER="JuanEliasJabib02"
REPO_NAME="speedy-gonzales"
AUTH_HEADER="Authorization: Bearer $API_KEY"

SUCCESS=0
FAIL=0
SKIP=0

echo "=== Migrating plans to Convex ==="

# Migrate epics
for epic_dir in plans/features/*/; do
  epic_slug=$(basename "$epic_dir")
  context_file="$epic_dir/_context.md"
  
  if [ ! -f "$context_file" ]; then
    echo "⚠️  Skip $epic_slug (no _context.md)"
    SKIP=$((SKIP + 1))
    continue
  fi
  
  # Extract title from first # heading
  title=$(grep -m1 "^# " "$context_file" | sed 's/^# //')
  if [ -z "$title" ]; then
    title="$epic_slug"
  fi
  
  content=$(cat "$context_file")
  epic_path="plans/features/$epic_slug"
  
  # Create epic in Convex
  response=$(curl -s -X POST "$API_BASE/create-epic" \
    -H "Content-Type: application/json" \
    -H "$AUTH_HEADER" \
    -d "$(jq -n \
      --arg owner "$REPO_OWNER" \
      --arg name "$REPO_NAME" \
      --arg title "$title" \
      --arg content "$content" \
      --arg path "$epic_path" \
      '{repoOwner: $owner, repoName: $name, title: $title, content: $content, path: $path}')" 2>/dev/null)
  
  if echo "$response" | grep -q '"ok":true\|already exists'; then
    echo "✅ Epic: $epic_slug"
    SUCCESS=$((SUCCESS + 1))
  else
    echo "❌ Epic: $epic_slug — $response"
    FAIL=$((FAIL + 1))
  fi
  
  # Migrate tickets in this epic
  for ticket_file in "$epic_dir"*.md; do
    ticket_name=$(basename "$ticket_file")
    [ "$ticket_name" = "_context.md" ] && continue
    
    ticket_slug="${ticket_name%.md}"
    ticket_title=$(grep -m1 "^# " "$ticket_file" | sed 's/^# //')
    if [ -z "$ticket_title" ]; then
      ticket_title="$ticket_slug"
    fi
    
    ticket_content=$(cat "$ticket_file")
    ticket_path="plans/features/$epic_slug/$ticket_name"
    
    response=$(curl -s -X POST "$API_BASE/create-ticket" \
      -H "Content-Type: application/json" \
      -H "$AUTH_HEADER" \
      -d "$(jq -n \
        --arg owner "$REPO_OWNER" \
        --arg name "$REPO_NAME" \
        --arg epicPath "$epic_path" \
        --arg title "$ticket_title" \
        --arg content "$ticket_content" \
        --arg path "$ticket_path" \
        '{repoOwner: $owner, repoName: $name, epicPath: $epicPath, title: $title, content: $content, path: $path}')" 2>/dev/null)
    
    if echo "$response" | grep -q '"ok":true\|already exists'; then
      echo "  ✅ Ticket: $ticket_slug"
      SUCCESS=$((SUCCESS + 1))
    else
      echo "  ❌ Ticket: $ticket_slug — $response"
      FAIL=$((FAIL + 1))
    fi
  done
done

echo ""
echo "=== Migration complete ==="
echo "Success: $SUCCESS | Failed: $FAIL | Skipped: $SKIP"
