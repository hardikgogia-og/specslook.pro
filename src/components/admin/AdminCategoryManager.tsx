import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Tag, Check, X, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Category } from '../../types.ts';
import { useStore } from '../../context/StoreContext.tsx';

interface AdminCategoryManagerProps {
  categories: Category[];
  onRefresh?: () => void;
}

const CATEGORY_IMAGE_PRESETS = [
  { label: 'Attachments & Clip-ons', url: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Luxury Sunglasses', url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Eyeglasses & Optical', url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Polarized Collection', url: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Aviators & Pilots', url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=80' }
];

export const AdminCategoryManager: React.FC<AdminCategoryManagerProps> = ({ categories, onRefresh }) => {
  const { addCategory, updateCategory, deleteCategory, showToast } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    itemCount: 0,
    featured: true
  });

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: CATEGORY_IMAGE_PRESETS[0].url,
      itemCount: 0,
      featured: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image || '',
      itemCount: cat.itemCount || 0,
      featured: cat.featured ?? true
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData(prev => ({
      ...prev,
      name,
      slug: editingCategory ? prev.slug : slug
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: formData.name.trim(),
          slug: formData.slug.trim() || formData.name.toLowerCase().replace(/\s+/g, '-'),
          description: formData.description.trim(),
          image: formData.image.trim() || CATEGORY_IMAGE_PRESETS[0].url,
          itemCount: Number(formData.itemCount) || 0,
          featured: formData.featured
        });
        showToast(`Category "${formData.name}" updated successfully!`, 'success');
      } else {
        await addCategory({
          name: formData.name.trim(),
          slug: formData.slug.trim() || formData.name.toLowerCase().replace(/\s+/g, '-'),
          description: formData.description.trim(),
          image: formData.image.trim() || CATEGORY_IMAGE_PRESETS[0].url,
          itemCount: Number(formData.itemCount) || 0,
          featured: formData.featured
        });
        showToast(`New category "${formData.name}" created and synced to store!`, 'success');
      }
      setIsModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      showToast('Failed to save category. Check network.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteCategory(id);
      showToast(`Category "${name}" deleted`, 'info');
      setDeleteConfirmId(null);
      if (onRefresh) onRefresh();
    } catch {
      showToast('Error deleting category', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-red-600" />
            <h3 className="font-black text-sm uppercase tracking-wider text-neutral-900">
              Product Categories ({categories.length})
            </h3>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Add new eyewear collections, manage navigation filters, and synchronize with the store database.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white border border-neutral-200 rounded-xs overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            {/* Image Preview */}
            <div className="relative h-36 bg-neutral-100 overflow-hidden group">
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3">
                <div>
                  <span className="text-[10px] font-mono uppercase bg-white/20 backdrop-blur-xs text-white px-2 py-0.5 rounded-xs">
                    /{cat.slug}
                  </span>
                  <h4 className="font-extrabold text-sm text-white uppercase mt-1">
                    {cat.name}
                  </h4>
                </div>
              </div>

              {cat.featured && (
                <span className="absolute top-2 right-2 text-[9px] font-black uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-xs shadow-xs">
                  Featured
                </span>
              )}
            </div>

            {/* Content & Details */}
            <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
              <p className="text-xs text-neutral-600 line-clamp-2">
                {cat.description || 'No description provided.'}
              </p>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-medium">
                  Items: <strong className="text-neutral-900">{cat.itemCount || 0}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xs transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(cat.id)}
                    className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Confirm Delete Banner */}
            {deleteConfirmId === cat.id && (
              <div className="bg-red-50 p-3 border-t border-red-200 text-xs flex items-center justify-between animate-in fade-in">
                <span className="text-red-800 font-semibold">Delete category?</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="bg-red-600 text-white px-2 py-1 text-[11px] font-bold uppercase rounded-xs hover:bg-red-700 cursor-pointer"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="text-neutral-600 hover:text-neutral-900 text-[11px] font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-xs shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-neutral-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-red-500" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Attachments, Rimless Glasses, Computer Eyewear"
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  URL Slug (Auto-generated or custom) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="e.g. attachments"
                  className="w-full text-xs p-2.5 font-mono border border-neutral-300 rounded-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Versatile 6-in-1 and 2-in-1 magnetic sunglass attachment eyewear."
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                />
              </div>

              {/* Cover Image URL */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Cover Image URL</span>
                  <ImageIcon className="w-3.5 h-3.5 text-neutral-500" />
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                />

                {/* Preset Suggestions */}
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 font-semibold">Or pick a curated luxury image:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORY_IMAGE_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: p.url })}
                        className={`text-[10px] px-2 py-1 rounded-xs border transition-colors cursor-pointer ${
                          formData.image === p.url
                            ? 'bg-red-600 text-white border-red-600 font-bold'
                            : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                {formData.image && (
                  <div className="h-24 w-full bg-neutral-100 rounded-xs overflow-hidden border border-neutral-200 mt-2">
                    <img
                      src={formData.image}
                      alt="Category Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => ((e.target as any).src = CATEGORY_IMAGE_PRESETS[0].url)}
                    />
                  </div>
                )}
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="cat-featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-red-600 accent-red-600 rounded cursor-pointer"
                />
                <label htmlFor="cat-featured" className="text-xs font-bold text-neutral-800 cursor-pointer">
                  Feature in Homepage category slider & top navigation
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs text-neutral-600 hover:text-neutral-900 px-4 py-2 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-neutral-400 text-white text-xs font-bold px-5 py-2 uppercase tracking-wider flex items-center gap-1.5 rounded-xs transition-colors cursor-pointer shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
