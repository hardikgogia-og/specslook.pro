import { dbService } from '../src/server/db.ts';
import { generateMerchantFeedXml } from '../src/server/merchantFeed.ts';

export default function handler(req: any, res: any) {
  try {
    const products = dbService.getProducts();
    const xml = generateMerchantFeedXml(products);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=1800, stale-while-revalidate=3600');
    return res.status(200).send(xml);
  } catch (err: any) {
    console.error('Error generating Google Merchant feed on Vercel:', err);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(500).send('Error generating Google Merchant feed: ' + (err?.message || ''));
  }
}
