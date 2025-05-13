# Open in Code Extension

A simple extension that adds an "Open in Code" option to the right-click context menu for folders in the GNOME Files (Nautilus) file manager. This allows you to quickly open folders in Visual Studio Code, similar to typing `code .` in the terminal.

## Features

- Adds "Open in Code" option to the context menu for folders
- Opens the selected folder in Visual Studio Code
- Multiple installation options depending on your preference and system

## Requirements

- GNOME Files (Nautilus) or any other file manager
- Visual Studio Code (installed and available in PATH as `code`)

## Installation

This extension offers three installation methods:

### Method 1: Nautilus Python Extension

This method works well with recent versions of GNOME Files (Nautilus):

1. Install the python3-nautilus package if not already installed:
   ```
   sudo apt install python3-nautilus
   ```
   (For Fedora/RHEL-based systems: `sudo dnf install nautilus-python`)

2. Run the installation script:
   ```
   ./install-nautilus-extension.sh
   ```

3. Restart Nautilus:
   ```
   nautilus -q
   ```

### Method 2: FileManager Action (Universal)

This method works with most file managers including Nautilus, Nemo, Caja, and Thunar:

1. Run the installation script:
   ```
   ./install-filemanager-action.sh
   ```

2. Restart your file manager (for Nautilus, use `nautilus -q`)

### Method 3: GNOME Shell Extension

For users who prefer a full GNOME Shell extension:

1. Make sure you're using GNOME Shell 40 or later
2. Run the installation script:
   ```
   ./install.sh
   ```
3. Restart GNOME Shell (press Alt+F2, type 'r', and press Enter)
4. Enable the extension using the Extensions app or `gnome-extensions-app`

## Usage

1. Right-click on any folder in GNOME Files (Nautilus)
2. Select "Open in Code" from the context menu
3. The folder will open in Visual Studio Code

## Configuration

### For GNOME Shell Extension

You can customize the command used to open VS Code through the extension preferences:

1. Open the Extensions app or run `gnome-extensions-app`
2. Find "Open in Code" and click the settings icon
3. Modify the VS Code command as needed (e.g., change it to a specific version of VS Code)

### For Nautilus Python Extension

To customize the command, simply edit the Nautilus Python extension file:

```
~/.local/share/nautilus-python/extensions/nautilus-open-in-code.py
```

Change the line that contains `subprocess.Popen(['code', path])` to use your preferred command.

## Troubleshooting

### The menu item doesn't appear

- Make sure you've restarted Nautilus after installing the extension with `nautilus -q`
- For the GNOME Shell extension, ensure it's enabled in the Extensions app
- Check that the python3-nautilus package is installed (for Nautilus Python method)

### VS Code doesn't open

- Make sure VS Code is installed and accessible via the `code` command
- Try running `code` from the terminal to see if it works
- For the Nautilus Python extension, check if there are any error messages by starting Nautilus from the terminal

## License

This extension is licensed under the GNU General Public License v2.0.