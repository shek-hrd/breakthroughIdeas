#!/usr/bin/env python3
"""
Simple HTTP server for testing JavaScript fixes
"""
import http.server
import socketserver
import webbrowser
import threading
import time
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers to allow cross-origin requests during testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def start_server():
    """Start the HTTP server"""
    try:
        # Change to the current directory
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
        
        # Create server
        handler = MyHTTPRequestHandler
        httpd = socketserver.TCPServer(("", PORT), handler)
        
        print(f"🚀 HTTP Server started successfully!")
        print(f"📁 Serving files from: {os.getcwd()}")
        print(f"🌐 Server running on:")
        print(f"   • Local: http://localhost:{PORT}")
        print(f"   • Network: http://0.0.0.0:{PORT}")
        print(f"")
        print(f"🧪 Test your JavaScript fixes:")
        print(f"   • Test page: http://localhost:{PORT}/test.html")
        print(f"   • Main page: http://localhost:{PORT}/index.htm")
        print(f"")
        print(f"⚠️  Press Ctrl+C to stop the server")
        print(f"─" * 50)
        
        # Open browser automatically after a short delay
        def open_browser():
            time.sleep(1.5)
            webbrowser.open(f'http://localhost:{PORT}/test.html')
        
        browser_thread = threading.Thread(target=open_browser)
        browser_thread.daemon = True
        browser_thread.start()
        
        # Start serving
        httpd.serve_forever()
        
    except KeyboardInterrupt:
        print(f"\n🛑 Server stopped by user")
        httpd.shutdown()
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {PORT} is already in use. Try a different port.")
            print(f"   Run: python server.py <port_number>")
        else:
            print(f"❌ Error starting server: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    import sys
    
    # Allow custom port from command line
    if len(sys.argv) > 1:
        try:
            PORT = int(sys.argv[1])
        except ValueError:
            print("❌ Port must be a number")
            sys.exit(1)
    
    start_server()