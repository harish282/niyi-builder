#!/usr/bin/env bash
#
# Package Niyi Builder for WordPress.
# Always runs `npm run build` first, then copies runtime files (no symlink deploy).
# Excludes tests, dev tooling, git metadata, and Node/TypeScript sources.
# Ships readme.txt and license.txt (required for WordPress.org).
#
# Runtime tree staged (whitelist):
#   niyi-builder.php, bootstrap/, config/, includes/, resources/, assets/,
#   build/, blocks/, languages/, readme.txt, license.txt,
#   docs/LAYOUT_SCHEMA_V0.md, docs/EDITOR_INTEGRATION.md, docs/schemas/
#
# Usage (from repo root):
#   npm run release
#     Build + write ./build/niyi-builder-x.y.z.zip
#   npm run release:dev
#     Build + copy runtime files to wp-content/plugins/niyi-builder
#   bash scripts/build-release-zip.sh dev
#   bash scripts/build-release-zip.sh prod
#   bash scripts/build-release-zip.sh prod /path/to/output-dir
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

root_realpath() {
  (cd "$ROOT" && pwd -P)
}

is_source_repo() {
  local path="$1"
  local root_real path_real

  root_real="$(root_realpath)"
  path_real="$(cd "$path" && pwd -P 2>/dev/null)" || return 1

  [[ "$path_real" == "$root_real" ]]
}

run_build() {
  if ! command -v npm >/dev/null 2>&1 || [[ ! -f "$ROOT/package.json" ]]; then
    echo "error: npm and package.json are required to build" >&2
    exit 1
  fi

  echo "Running npm run build ..."
  (cd "$ROOT" && npm run build)
  verify_built_assets
}

verify_built_assets() {
  local manifest="$ROOT/build/manifest.json"
  local missing=0
  local css_rel

  if [[ ! -f "$ROOT/build/admin.js" ]]; then
    echo "error: missing build/admin.js" >&2
    missing=1
  fi

  if [[ ! -f "$manifest" ]]; then
    echo "error: missing build/manifest.json" >&2
    missing=1
  fi

  if ! compgen -G "$ROOT/build/assets/*.css" > /dev/null && ! compgen -G "$ROOT/build/*.css" > /dev/null; then
    echo "error: missing build/assets/*.css bundle" >&2
    missing=1
  fi

  if [[ -f "$manifest" ]] && command -v php >/dev/null 2>&1; then
    while IFS= read -r css_rel; do
      [[ -z "$css_rel" ]] && continue
      if [[ ! -f "$ROOT/build/$css_rel" ]]; then
        echo "error: manifest references missing stylesheet build/$css_rel" >&2
        missing=1
      fi
    done < <(php -r '
      $manifest = json_decode(file_get_contents($argv[1]), true);
      if (!is_array($manifest)) { exit(0); }
      foreach ($manifest as $entry) {
        if (!is_array($entry) || empty($entry["css"]) || !is_array($entry["css"])) {
          continue;
        }
        foreach ($entry["css"] as $css) {
          if (is_string($css) && $css !== "") {
            echo $css, PHP_EOL;
          }
        }
      }
    ' "$manifest")
  fi

  if [[ "$missing" -ne 0 ]]; then
    return 1
  fi

  return 0
}

# Replace symlink or previous deploy with an empty directory ready for copy.
prepare_deploy_destination() {
  local dest="$1"

  # Remove symlink first (pwd -P would otherwise resolve to the source repo).
  if [[ -L "$dest" ]]; then
    echo "Removing symlink at $dest"
    rm "$dest"
  fi

  if [[ -e "$dest" ]] && is_source_repo "$dest"; then
    echo "error: deploy destination is the source repo ($dest); refusing to overwrite" >&2
    exit 1
  fi

  if [[ -e "$dest" ]]; then
    echo "Removing previous deploy at $dest"
    rm -rf "$dest"
  fi

  mkdir -p "$dest"
}

# WordPress.org readme Stable tag should match the plugin header version.
sync_readme_version() {
  local dest="$1"
  local readme="$dest/readme.txt"

  if [[ ! -f "$readme" ]]; then
    return 0
  fi

  sed -i "s/^Stable tag: .*/Stable tag: $VERSION/" "$readme"
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
    if [[ "$rel" == "license.txt" && -e "$ROOT/LICENSE" ]]; then
      echo "warning: license.txt missing; copying LICENSE as fallback" >&2
      cp -a "$ROOT/LICENSE" "$dest/license.txt"
      return 0
    fi
    echo "error: required release file missing: $rel" >&2
    exit 1
  fi
  cp -a "$ROOT/$rel" "$dest/"
}

verify_runtime_files() {
  local dest="$1"
  local missing=0
  local required_files=(
    "niyi-builder.php"
    "bootstrap/constants.php"
    "config/plugin.php"
    "includes/Plugin.php"
    "includes/Admin/PostEditorIntegration.php"
    "includes/Admin/BuilderPageRenderer.php"
    "includes/Admin/AdminAssetRegistrar.php"
    "resources/views/builder-app.php"
    "assets/admin.css"
    "assets/gutenberg-bridge.js"
    "assets/gutenberg-bridge.css"
    "build/admin.js"
    "build/manifest.json"
    "readme.txt"
    "license.txt"
  )

  for rel in "${required_files[@]}"; do
    if [[ ! -e "$dest/$rel" ]]; then
      echo "error: staged release missing required file: $rel" >&2
      missing=1
    fi
  done

  if [[ "$missing" -ne 0 ]]; then
    exit 1
  fi
}

stage_plugin_to() {
  local dest="$1"

  copy_if_exists "$dest" "niyi-builder.php"
  copy_if_exists "$dest" "bootstrap"
  copy_if_exists "$dest" "config"
  copy_if_exists "$dest" "includes"
  copy_if_exists "$dest" "resources"
  copy_if_exists "$dest" "assets"
  copy_if_exists "$dest" "build"
  copy_if_exists "$dest" "blocks"
  copy_if_exists "$dest" "languages"
  for doc in \
    docs/LAYOUT_SCHEMA_V0.md \
    docs/EDITOR_INTEGRATION.md \
    docs/schemas/layout-v0.schema.json
  do
    if [[ -f "$ROOT/$doc" ]]; then
      mkdir -p "$dest/$(dirname "$doc")"
      cp -a "$ROOT/$doc" "$dest/$doc"
    fi
  done

  # Required for WordPress.org (readme parser, GPL distribution). Only readme.txt at plugin root (Plugin Check).
  copy_required "$dest" "readme.txt"
  copy_required "$dest" "license.txt"

  sync_readme_version "$dest"

  # Production bundles only — drop source maps if present.
  find "$dest/build" -name '*.map' -delete 2>/dev/null || true

  # Drop dev-only paths that must not ship.
  rm -rf \
    "$dest/admin" \
    "$dest/packages" \
    "$dest/node_modules" \
    "$dest/scripts" \
    "$dest/docs/EXECUTION_PLAN.md" \
    "$dest/docs/STACKS_USED.txt" \
    2>/dev/null || true

  verify_runtime_files "$dest"
}

run_build

if [[ "$MODE" == "dev" ]]; then
  DEV_DEST="$(cd "$ROOT/../../plugins" && pwd)/$PLUGIN_SLUG"
  mkdir -p "$(dirname "$DEV_DEST")"
  prepare_deploy_destination "$DEV_DEST"
  stage_plugin_to "$DEV_DEST"
  echo "Deployed to $DEV_DEST (version $VERSION)"
  exit 0
fi

STAGE="$(mktemp -d "${TMPDIR:-/tmp}/niyi-builder-release.XXXXXX")"
trap 'rm -rf "$STAGE"' EXIT

DEST="$STAGE/$PLUGIN_SLUG"
mkdir -p "$DEST"
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
