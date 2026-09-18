import pilotAviatorImg from '../assets/images/pilot_aviator_1789719151649.jpg';
import polarizedVsTintImg from '../assets/images/polarized_vs_tint_1789719165304.jpg';
import faceShapesImg from '../assets/images/faces_eyewear_1789719179405.jpg';

export const blogImages: Record<string, string> = {
  'blog-01': pilotAviatorImg,
  'blog-02': polarizedVsTintImg,
  'blog-03': faceShapesImg,
  'the-legendary-aviator-style-history': pilotAviatorImg,
  'polarized-vs-non-polarized-eyewear-guide': polarizedVsTintImg,
  'how-to-choose-frames-for-your-face-shape': faceShapesImg,
};

export function getBlogImage(post: { id?: string; slug?: string; imageUrl?: string; image?: string }): string {
  if (post.id && blogImages[post.id]) return blogImages[post.id];
  if (post.slug && blogImages[post.slug]) return blogImages[post.slug];
  return post.imageUrl || post.image || pilotAviatorImg;
}
