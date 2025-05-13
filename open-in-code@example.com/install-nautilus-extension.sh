#!/bin/bash

# Installation script for Open in Code Nautilus extension

# Check if python3-nautilus is installed
if ! dpkg -l | grep -q python3-nautilus; then
    echo "The package python3-nautilus is not installed."
    echo "Please install it with: sudo apt-get install python3-nautilus"
    exit 1
fi

# Create Nautilus Python extensions directory if it doesn't exist
NAUTILUS_EXTENSIONS_DIR="$HOME/.local/share/nautilus-python/extensions"
mkdir -p "$NAUTILUS_EXTENSIONS_DIR"

# Copy the extension to the Nautilus extensions directory
cp ./nautilus-open-in-code.py "$NAUTILUS_EXTENSIONS_DIR/"
chmod +x "$NAUTILUS_EXTENSIONS_DIR/nautilus-open-in-code.py"

echo "Nautilus extension installed to $NAUTILUS_EXTENSIONS_DIR"
echo "Please restart Nautilus with: nautilus -q"
echo "Then relaunch Nautilus to see the changes"
