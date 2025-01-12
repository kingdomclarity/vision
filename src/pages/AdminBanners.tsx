import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Layout, Plus, Edit2, Trash2, Upload, X, AlertCircle } from 'lucide-react';
import { uploadFile } from '../lib/upload';

type Banner = {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  link: string;
  category?: string;
  start_date: string;
  end_date: string;
  priority: number;
  is_active: boolean;
};

const categories = [
  'Home',
  'Music',
  'Movies',
  'Sports',
  'Comedy',
  'News',
  'Podcasts',
  'Lifestyle',
  'Inspiration',
  'Arts',
  'Kids',
  'Live'
];

export function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    loadBanners();
  }, []);

  async function loadBanners() {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('priority', { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error('Error loading banners:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setError('');
    } else {
      setError('Please select a valid image file');
    }
  };

  async function handleSaveBanner(e: React.FormEvent) {
    e.preventDefault();
    if (!editingBanner?.title || !editingBanner?.link) {
      setError('Please fill in all required fields');
      return;
    }

    setUploading(true);
    setError('');

    try {
      let imageUrl = editingBanner.image_url;

      if (imageFile) {
        const path = `banners/${Date.now()}-${imageFile.name}`;
        imageUrl = await uploadFile(imageFile, 'content', path, () => {});
      }

      const bannerData = {
        ...editingBanner,
        image_url: imageUrl,
        priority: editingBanner.priority || 0,
        is_active: editingBanner.is_active ?? true
      };

      const { error } = await supabase
        .from('banners')
        .upsert(bannerData);

      if (error) throw error;

      await loadBanners();
      setEditingBanner(null);
      setImageFile(null);
    } catch (error: any) {
      console.error('Error saving banner:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteBanner(id: string) {
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Layout className="h-8 w-8 text-gold-500" />
          <h1 className="text-3xl font-medium">Featured Banners</h1>
        </div>
        <button
          onClick={() => setEditingBanner({})}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600"
        >
          <Plus className="h-5 w-5" />
          <span>Add Banner</span>
        </button>
      </div>

      <div className="space-y-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-start gap-6">
              <div className="w-64 aspect-[2000/700] rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium mb-2">{banner.title}</h3>
                <p className="text-gray-600 mb-4">{banner.subtitle}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Priority: {banner.priority}</span>
                  <span>•</span>
                  <span>Category: {banner.category || 'All'}</span>
                  <span>•</span>
                  <span>
                    {new Date(banner.start_date).toLocaleDateString()} - 
                    {new Date(banner.end_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingBanner(banner)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteBanner(banner.id)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Banner Edit Modal */}
      {editingBanner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-medium">
                {editingBanner.id ? 'Edit Banner' : 'New Banner'}
              </h2>
              <button
                onClick={() => {
                  setEditingBanner(null);
                  setImageFile(null);
                  setError('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image
                  <span className="text-gray-500 ml-1">
                    (Recommended: 2000x700 pixels)
                  </span>
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl aspect-[2000/700] overflow-hidden cursor-pointer hover:border-gold-500 transition-colors"
                >
                  {(imageFile || editingBanner.image_url) ? (
                    <img
                      src={imageFile ? URL.createObjectURL(imageFile) : editingBanner.image_url}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <div className="text-gray-500">Click to upload banner image</div>
                      <div className="text-sm text-gray-400">2000x700 pixels recommended</div>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              {/* Banner Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingBanner.title || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={editingBanner.subtitle || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link
                  </label>
                  <input
                    type="text"
                    value={editingBanner.link || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, link: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={editingBanner.category || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                  >
                    <option value="">All Pages</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <input
                    type="number"
                    value={editingBanner.priority || 0}
                    onChange={(e) => setEditingBanner({ ...editingBanner, priority: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={editingBanner.start_date?.split('T')[0] || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, start_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={editingBanner.end_date?.split('T')[0] || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, end_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingBanner.is_active ?? true}
                      onChange={(e) => setEditingBanner({ ...editingBanner, is_active: e.target.checked })}
                      className="w-4 h-4 text-gold-500 border-gray-300 rounded focus:ring-gold-500"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBanner(null);
                    setImageFile(null);
                    setError('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 bg-gold-500 text-white rounded-lg font-medium hover:bg-gold-600 disabled:opacity-50"
                >
                  {uploading ? 'Saving...' : 'Save Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}