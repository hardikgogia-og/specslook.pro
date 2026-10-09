import app from '../server.ts';

const apiPrefixes = [
  '/products', '/categories', '/orders', '/stores', '/auth', '/admin',
  '/blogs', '/banners', '/coupons', '/reviews', '/health', '/upload'
];

export default function handler(req: any, res: any) {
  if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/uploads') && !req.url.startsWith('/assets')) {
    const clean = req.url.split('?')[0].replace(/\/+$/, '') || '/';
    if (apiPrefixes.some(prefix => clean === prefix || clean.startsWith(prefix + '/'))) {
      req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
    }
  }
  return app(req, res);
}
