#!/usr/bin/env bash
#
# Package Niyi Builder for WordPress.
# Excludes tests, dev tooling, git metadata, and Node/TypeScript sources.
# Ships readme.txt and license.txt (required for WordPress.org).
#
# Usage (from repo root):
#   bash scripts/build-release-zip.sh dev
#     Copy runtime files to ../plugins/niyi-builder (local WordPress plugins dir).
#   bash scripts/build-release-zip.sh prod
#     Build a distribution zip in ./build (default).
#   bash scripts/build-release-zip.sh prod /path/to/output-dir
#     Build zip in a custom output directory.
#
# Legacy (prod with custom output dir, mode omitted):
#   bash scripts/build-release-zip.sh /path/to/output-dir
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLUGIN_SLUG="niyi-builder"
MAIN_FILE="$ROOT/niyi-builder.php"

MODE="prod"
OUT_DIR="$ROOT/build"

if [[ $# -ge 1 ]]; then
  case "$1" in
    dev|prod)
      MODE="$1"
      if [[ "$MODE" == "prod" && $# -ge 2 ]]; then
        OUT_DIR="$2"
      fi
      ;;
    *)
      MODE="prod"
      OUT_DIR="$1"
      ;;
  esac
fi

if [[ ! -f "$MAIN_FILE" ]]; then
  echo "error: expected $MAIN_FILE" >&2
  exit 1
fi

# Read "Version: x.y.z" from the plugin file header (first match).
VERSION="$(
  grep -E '^[[:space:]]*\*[[:space:]]*Version:[[:space:]]*' "$MAIN_FILE" \
    | head -n1 \
    | sed -E 's/^[[:space:]]*\*[[:space:]]*Version:[[:space:]]*//;s/[[:space:]]+$//'
)"
if [[ -z "$VERSION" ]]; then
  echo "error: could not parse Version from $MAIN_FILE" >&2
  exit 1
fi

ensure_built() {
  if [[ -f "$ROOT/build/manifest.json" ]]; then
    return 0
  fi

  if command -v npm >/dev/null 2>&1 && [[ -f "$ROOT/package.json" ]]; then
    echo "Running npm run build ..."
    (cd "$ROOT" && npm run build)
  fi

  if [[ ! -f "$ROOT/build/manifest.json" ]]; then
    echo "error: build/manifest.json missing; run npm run build" >&2
    exit 1
  fi
}

# Whitelist: only paths required at runtime (plus operator docs).
copy_if_exists() {
  local dest="$1"
  local rel="$2"
  if [[ -e "$ROOT/$rel" ]]; then
    cp -a "$ROOT/$rel" "$dest/"
  else
    echo "warning: missing optional path $rel" >&2
  fi
}

# WordPress.org and directory reviewers expect these at the plugin root.
copy_required() {
  local dest="$1"
  local rel="$2"
  if [[ ! -e "$ROOT/$rel" ]]; then
    echo "error: required release file missing: $rel" >&2
    exit 1
  fi
  cp -a "$ROOT/$rel" "$dest/"
}

stage_plugin_to() {
  local dest="$1"
  mkdir -p "$dest"

  copy_if_exists "$dest" "niyi-builder.php"
  copy_if_exists "$dest" "bootstrap"
  copy_if_exists "$dest" "config"
  copy_if_exists "$dest" "includes"
  copy_if_exists "$dest" "resources"
  copy_if_exists "$dest" "assets"
  copy_if_exists "$dest" "build"
  copy_if_exists "$dest" "blocks"
  copy_if_exists "$dest" "languages"
  for doc in docs/LAYOUT_SCHEMA_V0.md docs/schemas/layout-v0.schema.json; do
    if [[ -f "$ROOT/$doc" ]]; then
      mkdir -p "$dest/$(dirname "$doc")"
      cp -a "$ROOT/$doc" "$dest/$doc"
    fi
  done

  # Required for WordPress.org (readme parser, GPL distribution). Only readme.txt at plugin root (Plugin Check).
  copy_required "$dest" "readme.txt"
  copy_required "$dest" "license.txt"

  # Drop legacy paths removed from source (cp -a does not delete stale deploy files).
  rm -rf \
    "$dest/admin" \
    "$dest/packages" \
    "$dest/node_modules" \
    "$dest/scripts" \
    "$dest/docs/EXECUTION_PLAN.md" \
    "$dest/docs/STACKS_USED.txt" \
    2>/dev/null || true
}

ensure_built

if [[ "$MODE" == "dev" ]]; then
  DEV_DEST="$(cd "$ROOT/../../plugins" && pwd)/$PLUGIN_SLUG"
  mkdir -p "$(dirname "$DEV_DEST")"
  stage_plugin_to "$DEV_DEST"
  echo "Deployed to $DEV_DEST (version $VERSION)"
  exit 0
fi

STAGE="$(mktemp -d "${TMPDIR:-/tmp}/niyi-builder-release.XXXXXX")"
trap 'rm -rf "$STAGE"' EXIT

DEST="$STAGE/$PLUGIN_SLUG"
stage_plugin_to "$DEST"

mkdir -p "$OUT_DIR"
ZIP_NAME="${PLUGIN_SLUG}-${VERSION}.zip"
ZIP_PATH="$OUT_DIR/$ZIP_NAME"

rm -f "$ZIP_PATH"
(
  cd "$STAGE"
  zip -r -q "$ZIP_PATH" "$PLUGIN_SLUG"
)

FILES_IN_ZIP="$(unzip -l "$ZIP_PATH" | awk '/ files$/ {print $(NF-1)}')"
echo "Built $ZIP_PATH ($(du -h "$ZIP_PATH" | cut -f1))"
echo "Files in archive: ${FILES_IN_ZIP}"
