#!/bin/bash

# Installation script for Open in Code GNOME extension

EXTENSION_UUID="open-in-code@example.com"
EXTENSION_DIR="$HOME/.local/share/gnome-shell/extensions/$EXTENSION_UUID"

# Create extension directory
mkdir -p "$EXTENSION_DIR"

# Copy extension files
cp -r ./* "$EXTENSION_DIR/"

# Compile schemas
cd "$EXTENSION_DIR" 
glib-compile-schemas schemas/

echo "Extension installed to $EXTENSION_DIR"
echo "You can now enable it using Extensions app or gnome-extensions-app"
echo "You may need to restart GNOME Shell (Alt+F2, type 'r', and press Enter)"
