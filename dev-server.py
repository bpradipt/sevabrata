#!/usr/bin/env python3
"""
Advanced development server with automatic cache-busting for Sevabrata Foundation website
This version modifies HTML to add timestamp query parameters to JS/CSS files
"""

import http.server
import socketserver
import os
import sys
import time
import re
from urllib.parse import urlparse

class CacheBustingHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add aggressive no-cache headers
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, private')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Last-Modified', time.strftime('%a, %d %b %Y %H:%M:%S GMT', time.gmtime()))
        self.send_header('ETag', f'"{int(time.time())}"')
        super().end_headers()
    
    def do_GET(self):
        """Override GET to modify HTML files with cache-busting timestamps"""
        if self.path == '/' or self.path.endswith('.html'):
            # For HTML files, add cache-busting timestamps to JS/CSS references
            if self.path == '/':
                file_path = 'index.html'
            else:
                file_path = self.path.lstrip('/')
            
            if os.path.exists(file_path):
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Add timestamp to JS and CSS files
                    timestamp = str(int(time.time()))
                    
                    # Replace script src
                    content = re.sub(
                        r'<script src="([^"]+\.js)"',
                        f'<script src="\\1?v={timestamp}"',
                        content
                    )
                    
                    # Replace CSS href
                    content = re.sub(
                        r'<link[^>]+href="([^"]+\.css)"',
                        lambda m: m.group(0).replace(m.group(1), f'{m.group(1)}?v={timestamp}'),
                        content
                    )
                    
                    # Send response
                    self.send_response(200)
                    self.send_header('Content-Type', 'text/html; charset=utf-8')
                    self.send_header('Content-Length', len(content.encode('utf-8')))
                    self.end_headers()
                    self.wfile.write(content.encode('utf-8'))
                    return
                    
                except Exception as e:
                    print(f"Error processing HTML file: {e}")
        
        # For all other files, use default behavior
        super().do_GET()
    
    def log_message(self, format, *args):
        # Enhanced logging with cache-busting indication
        message = format % args
        if '?v=' in self.path:
            print(f"[{self.log_date_time_string()}] 🚫 {message}")
        else:
            print(f"[{self.log_date_time_string()}] {message}")

def run_server(port=8000):
    try:
        # Change to the script's directory
        script_dir = os.path.dirname(os.path.abspath(__file__))
        os.chdir(script_dir)
        
        with socketserver.TCPServer(("", port), CacheBustingHTTPRequestHandler) as httpd:
            print(f"🚀 Advanced Development Server Starting...")
            print(f"📁 Serving directory: {os.getcwd()}")
            print(f"🌐 Server running at: http://localhost:{port}/")
            print(f"🚫 Cache completely disabled with timestamp injection")
            print(f"💡 JS/CSS files will have ?v=timestamp automatically added")
            print(f"⏹️  Press Ctrl+C to stop the server")
            print("-" * 60)
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except OSError as e:
        if e.errno == 48:  # Port already in use
            print(f"❌ Port {port} is already in use. Try a different port:")
            print(f"   python3 dev-server-advanced.py {port + 1}")
        else:
            print(f"❌ Error starting server: {e}")

if __name__ == "__main__":
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("❌ Invalid port number. Using default port 8000.")
    
    run_server(port)