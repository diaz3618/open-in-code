#!/bin/bash

# Installation script for Open in Code FileManager Action

# Create the FileManager Actions directory if it doesn't exist
FILEMANAGER_DIR="$HOME/.local/share/file-manager/actions"
mkdir -p "$FILEMANAGER_DIR"

# Copy the action file to the FileManager Actions directory
cp ./open-in-code.desktop "$FILEMANAGER_DIR/"

echo "FileManager Action installed to $FILEMANAGER_DIR"
echo "You may need to restart your file manager to see the changes"
echo "For Nautilus: nautilus -q"
