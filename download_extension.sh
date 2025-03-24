#!/bin/bash

# Script to download and extract the BrowserTools Chrome extension

echo "Downloading BrowserTools MCP Chrome Extension..."

# Create a temporary directory
TEMP_DIR="$(mktemp -d)"
cd "$TEMP_DIR"

# Download the latest release of BrowserTools MCP Chrome Extension
curl -L -o browsertools.zip https://github.com/AgentDeskAI/browser-tools-mcp/releases/download/v1.2.0/BrowserToolsMCP-ChromeExtension-v1.2.0.zip

echo "Extracting extension..."
unzip browsertools.zip -d browsertools_extension

echo ""
echo "=================================================="
echo "✅ Download complete!"
echo "The extension has been downloaded to: $TEMP_DIR/browsertools_extension"
echo ""
echo "To install the extension in Chrome:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode' (toggle in top right)"
echo "3. Click 'Load unpacked' and select the folder: $TEMP_DIR/browsertools_extension"
echo "4. Once installed, open Chrome DevTools to use BrowserTools"
echo "==================================================" 