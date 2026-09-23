import sl1StoreImg from '../assets/images/sl1_store.jpg';
import sl2StoreImg from '../assets/images/sl2_store.jpg';
import sl3StoreImg from '../assets/images/sl3_store.jpg';
import sl4StoreImg from '../assets/images/sl4_store.jpg';
import sl5StoreImg from '../assets/images/sl5_store.jpg';
import { StoreLocation } from '../types.ts';

export { sl1StoreImg, sl2StoreImg, sl3StoreImg, sl4StoreImg, sl5StoreImg };

export const storeImages: Record<string, string> = {
  'store-sl1': sl1StoreImg,
  'store-sl2': sl2StoreImg,
  'store-sl3': sl3StoreImg,
  'store-sl4': sl4StoreImg,
  'store-sl5': sl5StoreImg,
  'sl1': sl1StoreImg,
  'sl2': sl2StoreImg,
  'sl3': sl3StoreImg,
  'sl4': sl4StoreImg,
  'sl5': sl5StoreImg,
  'specslook sl1': sl1StoreImg,
  'specslook sl2': sl2StoreImg,
  'specslook sl3': sl3StoreImg,
  'specslook sl4': sl4StoreImg,
  'specslook sl5': sl5StoreImg,
};

export function getStoreImage(store: Partial<StoreLocation> | null | undefined): string {
  if (!store) return sl1StoreImg;

  if (store.id) {
    const idKey = store.id.toLowerCase();
    if (storeImages[idKey]) return storeImages[idKey];
  }

  if (store.name) {
    const nameKey = store.name.toLowerCase();
    for (const [key, img] of Object.entries(storeImages)) {
      if (nameKey.includes(key)) {
        return img;
      }
    }
  }

  return (store as any).image || (store as any).imageUrl || sl1StoreImg;
}
