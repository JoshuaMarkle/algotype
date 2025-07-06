#!/bin/bash

ERROR_FILE="logs/format_errors.txt"

if [[ ! -f "$ERROR_FILE" ]]; then
  echo "❌ Error file not found: $ERROR_FILE"
  exit 1
fi

while IFS= read -r file_path; do
  if [[ -f "$file_path" ]]; then
    echo "🔧 Opening: $file_path"
    nvim "$file_path"
  else
    echo "⚠️ Skipping (file not found): $file_path"
  fi
done < "$ERROR_FILE"

echo "✅
