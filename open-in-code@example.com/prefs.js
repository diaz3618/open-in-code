/* preferences.js
 *
 * Preferences dialog for Open in Code extension
 */

'use strict';

const { Adw, Gio, GObject, Gtk } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

// Get the GSchema
function getSettings() {
    const GioSSS = Gio.SettingsSchemaSource;
    let schemaDir = Me.dir.get_child('schemas');
    let schemaSource;
    
    if (schemaDir.query_exists(null)) {
        schemaSource = GioSSS.new_from_directory(
            schemaDir.get_path(),
            GioSSS.get_default(),
            false
        );
    } else {
        schemaSource = GioSSS.get_default();
    }
    
    let schemaObj = schemaSource.lookup(
        'org.gnome.shell.extensions.open-in-code', 
        true
    );
    
    if (!schemaObj) {
        throw new Error('Cannot find schemas');
    }
    
    return new Gio.Settings({ settings_schema: schemaObj });
}

// Preferences page
var OpenInCodePreferencesPage = GObject.registerClass(
class OpenInCodePreferencesPage extends Adw.PreferencesPage {
    _init(settings) {
        super._init({
            title: 'Settings',
            icon_name: 'document-properties-symbolic',
            name: 'OpenInCodePreferencesPage'
        });
        
        this._settings = settings;
        
        // Create a preferences group
        const group = new Adw.PreferencesGroup({
            title: 'General Settings'
        });
        this.add(group);
        
        // Command row
        const commandRow = new Adw.EntryRow({
            title: 'VS Code Command',
            text: this._settings.get_string('command')
        });
        commandRow.connect('changed', entry => {
            this._settings.set_string('command', entry.text);
        });
        
        group.add(commandRow);
    }
});

// Main preferences widget
function fillPreferencesWindow(window) {
    const settings = getSettings();
    const page = new OpenInCodePreferencesPage(settings);
    window.add(page);
}
