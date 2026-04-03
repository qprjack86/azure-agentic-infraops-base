#!/usr/bin/env bash
set -euo pipefail

REPO="${GITHUB_REPOSITORY:-}"

if [[ -z "$REPO" ]]; then
  if command -v gh >/dev/null 2>&1; then
    REPO="$(gh repo view --json nameWithOwner --jq '.nameWithOwner')"
  fi
fi

if [[ -z "$REPO" ]]; then
  echo "Unable to determine repository. Set GITHUB_REPOSITORY=owner/repo and retry."
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required. Install it and authenticate with 'gh auth login'."
  exit 1
fi

gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "/repos/${REPO}/branches/main/protection" \
  --input .github/branch-protection.main.json

echo "Applied branch protection for ${REPO} (main)."
