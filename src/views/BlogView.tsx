import React from 'react';
import { Calendar, User, Clock, ArrowLeft, ArrowRight, Tag, Share2 } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { BlogPost } from '../types.ts';

export const BlogView: React.FC = () => {
  const { blogs, viewParams, navigateTo, showToast } = useStore();

  const selectedSlug = viewParams.slug;
  const activePost = selectedSlug ? blogs.find(b => b.slug === selectedSlug) : null;

  // Single Blog Post Reader View
  if (activePost) {
    return (
      <div className="bg-white min-h-screen pb-24">
        {/* Article Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-b border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
          <button
            onClick={() => navigateTo('blog')}
            className="flex items-center gap-1.5 text-neutral-800 hover:text-red-600 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Journal</span>
          </button>
          <span className="text-red-600 font-bold uppercase">{activePost.category}</span>
        </div>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          {/* Article Header */}
          <div className="space-y-4 text-center">
            <span className="bg-neutral-100 text-neutral-800 text-[11px] font-extrabold uppercase px-3 py-1 tracking-widest rounded-xs">
              {activePost.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-neutral-900 tracking-tight leading-tight">
              {activePost.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-xs text-neutral-500 pt-2">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {activePost.author} ({activePost.authorRole})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(activePost.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {activePost.readTime}
              </span>
            </div>
          </div>

          {/* Hero Article Image */}
          <div className="mt-8 aspect-16/9 bg-neutral-100 rounded-xs overflow-hidden border border-neutral-200 shadow-sm">
            <img
              src={activePost.imageUrl}
              alt={activePost.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Body */}
          <div className="mt-10 text-neutral-700 leading-relaxed text-sm sm:text-base space-y-6">
            <p className="font-semibold text-lg text-neutral-900 leading-relaxed border-l-2 border-red-600 pl-4 italic">
              {activePost.excerpt}
            </p>

            <div className="space-y-4 pt-4 text-neutral-700 whitespace-pre-line leading-relaxed">
              {activePost.content}
            </div>
          </div>

          {/* Tags */}
          {activePost.tags && (
            <div className="mt-10 pt-6 border-t border-neutral-200 flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-neutral-400" />
              {activePost.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-neutral-100 text-neutral-800 text-xs px-2.5 py-1 rounded-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Back Button */}
          <div className="mt-12 pt-6 border-t border-neutral-200 flex items-center justify-between">
            <button
              onClick={() => navigateTo('blog')}
              className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-red-600 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>More Articles</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('Article link copied to clipboard');
              }}
              className="text-xs font-bold text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Article</span>
            </button>
          </div>
        </article>
      </div>
    );
  }

  // Blog Directory Listing View
  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="bg-neutral-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 text-center">
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-extrabold text-red-600 uppercase tracking-widest">
            THE EDITORIAL ARCHIVE
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Specslook Eyewear Journal
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2">
            Dispatches on silhouette styling, facial proportion aesthetics, and optical lens innovations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post) => (
            <article
              key={post.id}
              onClick={() => navigateTo('blog-post', { slug: post.slug })}
              className="group bg-white border border-neutral-200 rounded-xs overflow-hidden shadow-xs hover:border-neutral-900 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="aspect-16/10 bg-neutral-100 overflow-hidden relative">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-neutral-950/90 text-white text-[10px] font-extrabold px-2.5 py-0.5 uppercase tracking-wider backdrop-blur-xs">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 space-y-2.5">
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-medium">
                    <span>{new Date(post.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h2 className="font-black text-lg text-neutral-900 group-hover:text-red-600 transition-colors leading-snug">
                    {post.title}
                  </h2>

                  <p className="text-xs text-neutral-500 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs font-bold text-neutral-900">
                <span className="text-[11px] text-neutral-500 font-normal">By {post.author}</span>
                <span className="group-hover:text-red-600 group-hover:translate-x-1 transition-all flex items-center gap-1">
                  Read Journal &rarr;
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
