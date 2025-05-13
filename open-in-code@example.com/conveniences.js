/* conveniences.js
 *
 * This file contains convenience functions for the extension
 */

'use strict';

const { Gio, GLib } = imports.gi;
const ByteArray = imports.byteArray;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

/**
 * Execute a command and return its output
 * @param {string[]} argv - Command line arguments
 * @param {string} input - Optional standard input
 * @returns {string} - Command output
 */
function executeCommand(argv, input = null) {
    try {
        let flags = Gio.SubprocessFlags.STDOUT_PIPE;
        
        if (input !== null)
            flags |= Gio.SubprocessFlags.STDIN_PIPE;
            
        const proc = Gio.Subprocess.new(argv, flags);
        
        let stdout;
        if (input !== null) {
            const [, stdoutBytes] = proc.communicate_utf8(input, null);
            stdout = stdoutBytes;
        } else {
            const [, stdoutBytes] = proc.communicate(null);
            stdout = ByteArray.toString(stdoutBytes);
        }
        
        return stdout.trim();
    } catch (e) {
        logError(e);
        return '';
    }
}

/**
 * Get an absolute file path from a URI
 * @param {string} uri - URI to convert
 * @returns {string} - Absolute file path
 */
function uriToPath(uri) {
    if (!uri)
        return null;
        
    const file = Gio.File.new_for_uri(uri);
    return file.get_path();
}

/**
 * Get settings from GSchema
 * @returns {Gio.Settings} - Extension settings
 */
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
