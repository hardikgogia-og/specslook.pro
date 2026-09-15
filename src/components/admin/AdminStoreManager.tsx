import React, { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, Phone, Mail, Clock, Check, X, Image as ImageIcon } from 'lucide-react';
import { StoreLocation } from '../../types.ts';
import { useStore } from '../../context/StoreContext.tsx';

interface AdminStoreManagerProps {
  stores: StoreLocation[];
  onRefresh?: () => void;
}

const STORE_IMAGE_PRESETS = [
  { label: 'Flagship Lounge (DLF)', url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Heritage Boutique (CP)', url: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Mall Experience Center', url: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Modern Studio (Khan Mkt)', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80' }
];

export const AdminStoreManager: React.FC<AdminStoreManagerProps> = ({ stores, onRefresh }) => {
  const { addStore, updateStore, deleteStore, showToast } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreLocation | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    timings: 'Mon - Sun: 10:30 AM - 09:30 PM',
    features: 'Zeiss 3D Digital Eye Examination, On-Site Express Glazing Lab, Ultrasonic Deep Frame Cleansing, Bespoke Custom Fitting',
    image: STORE_IMAGE_PRESETS[0].url,
    mapEmbedUrl: ''
  });

  const handleOpenAdd = () => {
    setEditingStore(null);
    setFormData({
      name: '',
      city: 'New Delhi',
      address: '',
      phone: '+91 83688 53448',
      email: 'care@specslook.com',
      timings: 'Mon - Sun: 10:30 AM - 09:30 PM',
      features: 'Zeiss 3D Digital Eye Examination, On-Site Express Glazing Lab, Ultrasonic Deep Frame Cleansing, Bespoke Custom Fitting',
      image: STORE_IMAGE_PRESETS[0].url,
      mapEmbedUrl: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (store: StoreLocation) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      city: store.city || '',
      address: store.address || '',
      phone: store.phone || '',
      email: store.email || '',
      timings: store.timings || 'Mon - Sun: 10:30 AM - 09:30 PM',
      features: Array.isArray(store.features) ? store.features.join(', ') : '',
      image: store.image || STORE_IMAGE_PRESETS[0].url,
      mapEmbedUrl: store.mapEmbedUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      showToast('Store name and address are required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const featuresArray = formData.features
        .split(',')
        .map(f => f.trim())
        .filter(Boolean);

      if (editingStore) {
        await updateStore(editingStore.id, {
          name: formData.name.trim(),
          city: formData.city.trim(),
          address: formData.address.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          timings: formData.timings.trim(),
          features: featuresArray,
          image: formData.image.trim() || STORE_IMAGE_PRESETS[0].url,
          mapEmbedUrl: formData.mapEmbedUrl.trim() || undefined
        });
        showToast(`Store "${formData.name}" updated successfully!`, 'success');
      } else {
        await addStore({
          name: formData.name.trim(),
          city: formData.city.trim(),
          address: formData.address.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          timings: formData.timings.trim(),
          features: featuresArray,
          image: formData.image.trim() || STORE_IMAGE_PRESETS[0].url,
          mapEmbedUrl: formData.mapEmbedUrl.trim() || undefined
        });
        showToast(`New store "${formData.name}" created and synced to database!`, 'success');
      }
      setIsModalOpen(false);
      if (onRefresh) onRefresh();
    } catch {
      showToast('Failed to save store location. Check network.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteStore(id);
      showToast(`Store "${name}" removed`, 'info');
      setDeleteConfirmId(null);
      if (onRefresh) onRefresh();
    } catch {
      showToast('Error deleting store', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            <h3 className="font-black text-sm uppercase tracking-wider text-neutral-900">
              Specslook Boutiques & Store Locations ({stores.length})
            </h3>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage physical optical flagship stores, optometrist exam studios, and customer contact details.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Store</span>
        </button>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-white border border-neutral-200 rounded-xs overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            {/* Boutique Image Preview */}
            <div className="relative h-44 bg-neutral-100 overflow-hidden group">
              <img
                src={store.image || STORE_IMAGE_PRESETS[0].url}
                alt={store.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end p-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-xs shadow-xs">
                    {store.city}
                  </span>
                  <h4 className="font-black text-sm text-white uppercase mt-1.5 leading-snug">
                    {store.name}
                  </h4>
                </div>
              </div>
            </div>

            {/* Store Information */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs text-neutral-700">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{store.address}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <a href={`tel:${store.phone}`} className="hover:text-red-600 font-mono font-medium">
                    {store.phone}
                  </a>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <a href={`mailto:${store.email}`} className="hover:text-red-600 font-medium truncate">
                    {store.email}
                  </a>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="text-[11px] font-medium">{store.timings}</span>
                </div>

                {/* Features Tags */}
                {store.features && store.features.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1">
                    {store.features.slice(0, 3).map((f, i) => (
                      <span key={i} className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-xs">
                        {f}
                      </span>
                    ))}
                    {store.features.length > 3 && (
                      <span className="text-[10px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded-xs">
                        +{store.features.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-400 uppercase">
                  ID: {store.id}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(store)}
                    className="flex items-center gap-1 text-xs font-bold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded-xs transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(store.id)}
                    className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-xs transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Delete Confirmation */}
            {deleteConfirmId === store.id && (
              <div className="bg-red-50 p-3 border-t border-red-200 text-xs flex items-center justify-between animate-in fade-in">
                <span className="text-red-800 font-semibold">Delete this store location?</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(store.id, store.name)}
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

      {/* Add / Edit Store Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-xs shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-neutral-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">
                  {editingStore ? 'Edit Store Location' : 'Add New Store Location'}
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
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    Store Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. SPECSLOOK SL6 - Ambience Mall"
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Gurugram, New Delhi, Noida"
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Full Street Address & Landmark *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Ground Floor, Ambience Mall, NH-8, Gurugram, Haryana - 122002"
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 83688 53448"
                    className="w-full text-xs p-2.5 font-mono border border-neutral-300 rounded-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="store.ambience@specslook.com"
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Store Timings
                </label>
                <input
                  type="text"
                  value={formData.timings}
                  onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
                  placeholder="Mon - Sun: 10:30 AM - 09:30 PM"
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Amenities & Services (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Zeiss Eye Exam, 30-min Express Glazing, Ultrasonic Cleaning"
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                />
              </div>

              {/* Boutique Image URL */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Store Photo URL</span>
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
                  <span className="text-[10px] text-neutral-500 font-semibold">Or pick a boutique style photo:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {STORE_IMAGE_PRESETS.map((p, idx) => (
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
                  <div className="h-28 w-full bg-neutral-100 rounded-xs overflow-hidden border border-neutral-200 mt-2">
                    <img
                      src={formData.image}
                      alt="Store Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => ((e.target as any).src = STORE_IMAGE_PRESETS[0].url)}
                    />
                  </div>
                )}
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
                  <span>{isSaving ? 'Saving...' : editingStore ? 'Update Store' : 'Create Store'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
