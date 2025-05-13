#!/usr/bin/python3

import gi
import os
import subprocess
import urllib.parse

gi.require_version('Nautilus', '4.0')
from gi.repository import Nautilus, GObject, Gio

class OpenInCodeExtension(GObject.GObject, Nautilus.MenuProvider):
    def __init__(self):
        pass

    def get_file_items(self, files):
        """
        Returns menu items for regular files
        """
        # Only add menu item if there's a single directory selected
        if len(files) != 1:
            return []
            
        file = files[0]
        if file.is_directory():
            menu_item = Nautilus.MenuItem(
                name='OpenInCodeExtension::open_folder_in_code',
                label='Open in Code',
                tip='Open this folder in Visual Studio Code'
            )
            menu_item.connect('activate', self._open_in_code_callback, file)
            return [menu_item]
        
        return []

    def get_background_items(self, folder):
        """
        Returns menu items for the folder background
        """
        # Add menu item for folder backgrounds
        menu_item = Nautilus.MenuItem(
            name='OpenInCodeExtension::open_background_in_code',
            label='Open in Code',
            tip='Open this folder in Visual Studio Code'
        )
        menu_item.connect('activate', self._open_in_code_callback, folder)
        
        return [menu_item]

    def _open_in_code_callback(self, menu, file):
        """
        Opens the folder in Visual Studio Code
        """
        path = self._get_path_from_uri(file.get_uri())
        if path:
            try:
                subprocess.Popen(['code', path])
            except Exception as e:
                print(f"Error opening VS Code: {e}")

    def _get_path_from_uri(self, uri):
        """
        Converts a URI to a file path
        """
        if uri.startswith('file://'):
            # Use proper URL decoding to handle spaces and special characters
            return urllib.parse.unquote(uri[7:])
        return None
