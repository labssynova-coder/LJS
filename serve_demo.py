import http.server
import os
import functools

os.chdir(os.path.dirname(__file__) or '.')

class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # Serve /admin/ from admin/ directory
        if path.startswith('/admin'):
            path = path.replace('/admin', '/admin', 1)
            return os.path.join(os.getcwd(), path)
        # Serve everything else from public/
        if path == '/':
            path = '/index.html'
        return os.path.join(os.getcwd(), 'public', path.lstrip('/'))

    def do_GET(self):
        f = self.send_head()
        if f:
            try:
                self.copyfile(f, self.wfile)
            finally:
                f.close()

server = http.server.HTTPServer(('localhost', 8888), Handler)
print(f"Storefront: http://localhost:8888/")
print(f"Admin:      http://localhost:8888/admin/")
print("Press Ctrl+C to stop")
try:
    server.serve_forever()
except KeyboardInterrupt:
    server.shutdown()