import fs from 'fs';
import path from 'path';

export default function handler(req: any, res: any) {
  // Return HTTP 410 Gone with noindex headers to permanently purge legacy WordPress spam from Google's index
  res.statusCode = 410;
  if (typeof res.status === 'function') {
    res.status(410);
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');

  // Try to load pre-rendered 404/410 template from disk
  try {
    const dist404 = path.join(process.cwd(), 'dist', '404.html');
    const pub404 = path.join(process.cwd(), 'public', '404.html');
    const targetFile = fs.existsSync(dist404) ? dist404 : (fs.existsSync(pub404) ? pub404 : null);
    if (targetFile) {
      let content = fs.readFileSync(targetFile, 'utf8');
      content = content
        .replace(/<title>[\s\S]*?<\/title>/i, '<title>410 Gone - Page Permanently Removed | Specslook</title>')
        .replace(/Page Not Found/g, 'Resource Permanently Removed (410)');
      return res.end(content);
    }
  } catch (err) {
    console.warn('Error reading 404 template in legacy-handler:', err);
  }

  return res.end(`<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>410 Gone - Resource Permanently Removed | Specslook</title>
  <meta name="robots" content="noindex, nofollow, noarchive" />
</head>
<body style="font-family: sans-serif; text-align: center; padding: 40px;">
  <h1>410 Gone</h1>
  <p>The requested legacy page has been permanently removed.</p>
  <p><a href="https://www.specslook.com/">Return to Specslook Official Store</a></p>
</body>
</html>`);
}
