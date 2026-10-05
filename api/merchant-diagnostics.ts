import { dbService } from '../src/server/db.ts';
import { getMerchantDiagnostics } from '../src/server/merchantFeed.ts';

export default function handler(req: any, res: any) {
  try {
    const products = dbService.getProducts();
    const diagnostics = getMerchantDiagnostics(products);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    return res.status(200).json(diagnostics);
  } catch (err: any) {
    console.error('Error generating diagnostics on Vercel:', err);
    return res.status(500).json({ error: 'Failed to generate diagnostics: ' + (err?.message || '') });
  }
}
