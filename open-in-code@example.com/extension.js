/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

const { Gio, GLib } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const ByteArray = imports.byteArray;

// File manager interface identifier
const FileManagerInterface = `
<node>
  <interface name="org.freedesktop.FileManager1">
    <method name="ShowItems">
      <arg type="as" name="uris" direction="in"/>
      <arg type="s" name="startup_id" direction="in"/>
    </method>
    <method name="ShowItemProperties">
      <arg type="as" name="uris" direction="in"/>
      <arg type="s" name="startup_id" direction="in"/>
    </method>
  </interface>
</node>`;

// Nautilus extension interface identifier
const NautilusExtensionIface = `
<node>
  <interface name="org.gnome.Nautilus.FileOperationProvider">
    <method name="AddFiles">
      <arg type="as" name="uri_list" direction="in"/>
    </method>
  </interface>
</node>`;

class Extension {
    constructor() {
        this._dbusConnection = null;
        this._dbusProxy = null;
        this._fileManagerProxy = null;
        this._menuItems = [];
    }

    enable() {
        this._connectDBus();
    }

    disable() {
        this._disconnectDBus();
    }

    _connectDBus() {
        try {
            // Connect to session DBus
            this._dbusConnection = Gio.DBus.session;

            // Create a proxy for Nautilus D-Bus interface
            this._dbusProxy = Gio.DBusProxy.new_sync(
                this._dbusConnection,
                Gio.DBusProxyFlags.NONE,
                null,
                'org.gnome.Nautilus',
                '/org/gnome/Nautilus/FileOperationProvider',
                'org.gnome.Nautilus.FileOperationProvider',
                null
            );

            // Get FileManager1 proxy
            this._fileManagerProxy = Gio.DBusProxy.new_sync(
                this._dbusConnection,
                Gio.DBusProxyFlags.NONE,
                null,
                'org.freedesktop.FileManager1',
                '/org/freedesktop/FileManager1',
                'org.freedesktop.FileManager1',
                null
            );

            // Watch for context menu creation
            this._installMenuProviderProxy();
        } catch (e) {
            logError(e, 'Failed to connect to D-Bus');
        }
    }

    _disconnectDBus() {
        // Clean up D-Bus connections
        this._dbusConnection = null;
        this._dbusProxy = null;
        this._fileManagerProxy = null;
    }

    _installMenuProviderProxy() {
        try {
            // Watch for signal when Nautilus asks for context menu items
            this._dbusConnection.signal_subscribe(
                'org.gnome.Nautilus',
                'org.gnome.Nautilus.MenuProvider',
                'ItemsAdded',
                '/org/gnome/Nautilus/MenuProvider',
                null,
                Gio.DBusSignalFlags.NONE,
                this._onItemsAdded.bind(this)
            );

            // Register as a menu provider
            this._dbusConnection.call_sync(
                'org.gnome.Nautilus',
                '/org/gnome/Nautilus/MenuProvider',
                'org.gnome.Nautilus.MenuProvider',
                'RegisterProvider',
                new GLib.Variant('(s)', [Me.uuid]),
                null,
                Gio.DBusCallFlags.NONE,
                -1,
                null
            );
        } catch (e) {
            logError(e, 'Failed to install menu provider');
        }
    }

    _onItemsAdded(connection, sender, path, iface, signal, params) {
        try {
            // Extract selected items from signal parameters
            const [items] = params.deep_unpack();
            
            // Only add menu item for directories
            for (let i = 0; i < items.length; i++) {
                const uri = items[i];
                const file = Gio.File.new_for_uri(uri);
                const info = file.query_info('standard::type', Gio.FileQueryInfoFlags.NONE, null);
                
                if (info.get_file_type() === Gio.FileType.DIRECTORY) {
                    // Add our menu item
                    this._addOpenInCodeMenuItem(uri);
                    break;
                }
            }
        } catch (e) {
            logError(e, 'Failed to handle items added signal');
        }
    }

    _addOpenInCodeMenuItem(uri) {
        try {
            // Create menu item
            const menuId = `open-in-code-${GLib.uuid_string_random()}`;
            
            // Register the menu item with Nautilus
            this._dbusConnection.call_sync(
                'org.gnome.Nautilus',
                '/org/gnome/Nautilus/MenuProvider',
                'org.gnome.Nautilus.MenuProvider',
                'AddMenuItem',
                new GLib.Variant('(ssa{sv})', [
                    menuId,
                    'Open in Code',
                    {
                        'icon-name': new GLib.Variant('s', 'visual-studio-code'),
                        'uri': new GLib.Variant('s', uri),
                    }
                ]),
                null,
                Gio.DBusCallFlags.NONE,
                -1,
                null
            );

            // Store menu item ID for cleanup
            this._menuItems.push(menuId);

            // Connect to menu item activation
            this._dbusConnection.signal_subscribe(
                'org.gnome.Nautilus',
                'org.gnome.Nautilus.MenuProvider',
                'MenuItemActivated',
                '/org/gnome/Nautilus/MenuProvider',
                menuId,
                Gio.DBusSignalFlags.NONE,
                (conn, sender, path, iface, signal, params) => {
                    this._openInCode(uri);
                }
            );
        } catch (e) {
            logError(e, 'Failed to add menu item');
        }
    }

    _openInCode(uri) {
        try {
            // Convert URI to file path
            const file = Gio.File.new_for_uri(uri);
            const path = file.get_path();

            if (path) {
                // Launch VS Code with the folder path
                const process = new Gio.Subprocess({
                    argv: ['code', path],
                    flags: Gio.SubprocessFlags.NONE
                });
                process.init(null);
            }
        } catch (e) {
            logError(e, 'Failed to open in VS Code');
        }
    }
}

function init() {
    return new Extension();
}
