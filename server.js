#!/usr/bin/env node
/**
 * Local dev server that mirrors the vercel.json route table.
 * Pure Node, zero dependencies. Run with: npm run serve
 */
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;
const PORT = process.env.PORT || 8080;
const routes = JSON.parse(fs.readFileSync(path.join(ROOT, "vercel.json"), "utf8")).routes;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".pdf": "application/pdf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".otf": "font/otf",
};

function decodePath(urlPath) {
  try {
    return decodeURIComponent(urlPath);
  } catch {
    return urlPath;
  }
}

function resolveStatic(urlPath) {
  const file = path.join(ROOT, decodePath(urlPath));
  if (!file.startsWith(ROOT)) return null;
  if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  const index = path.join(file, "index.html");
  if (fs.existsSync(index)) return index;
  return null;
}

function serve(res, status, file) {
  const ext = path.extname(file).toLowerCase();
  res.writeHead(status, { "Content-Type": MIME[ext] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer((req, res) => {
  const urlPath = req.url.split("?")[0];

  for (const route of routes) {
    if (route.handle === "filesystem") {
      const file = resolveStatic(urlPath);
      if (file) return serve(res, 200, file);
      continue;
    }
    const match = new RegExp(`^${route.src}$`).exec(urlPath);
    if (!match) continue;

    const dest = route.dest.replace(/\$(\d+)/g, (_, n) => match[Number(n)] || "");
    const file = resolveStatic(dest);
    if (!file) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("404 Not Found");
    }
    return serve(res, route.status || 200, file);
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("404 Not Found");
});

server.listen(PORT, () => {
  console.log(`Amorosos Amaneceres — local (mirrors vercel.json)`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`  http://localhost:${PORT}/en`);
});
