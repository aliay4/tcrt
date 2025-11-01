'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface MediaItem {
  id: string;
  file_name: string;
  file_path: string;
  mime_type: string;
  media_type: 'image' | 'video';
  is_primary: boolean;
  sort_order: number;
}

interface MediaDisplayProps {
  productId?: string;
  mediaUrl?: string;
  alt?: string;
  showPrimaryOnly?: boolean;
  className?: string;
  isThumbnail?: boolean; // Thumbnail modu - video oynatılmasın
}

export default function MediaDisplay({ 
  productId, 
  mediaUrl,
  alt = '',
  showPrimaryOnly = false, 
  className = '',
  isThumbnail = false
}: MediaDisplayProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // Medya dosyalarını yükle
  const loadMedia = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('product_media')
        .select('*')
        .eq('product_id', productId)
        .order('is_primary', { ascending: false })
        .order('sort_order', { ascending: true });

      if (error) throw error;

      const media = showPrimaryOnly 
        ? data?.filter(item => item.is_primary) || []
        : data || [];

      setMediaItems(media);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Component mount olduğunda medya yükle
  useEffect(() => {
    if (productId) {
      loadMedia();
    } else {
      setLoading(false);
    }
  }, [productId]);

  // Medya URL'si oluştur
  const getMediaUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('product-media')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  // Primary medyayı ayarla
  const setPrimaryMedia = async (mediaId: string) => {
    try {
      // Önce tüm medyaları primary olmaktan çıkar
      await supabase
        .from('product_media')
        .update({ is_primary: false })
        .eq('product_id', productId);

      // Seçilen medyayı primary yap
      const { error } = await supabase
        .from('product_media')
        .update({ is_primary: true })
        .eq('id', mediaId);

      if (error) throw error;

      // Listeyi yenile
      loadMedia();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Medya sil
  const deleteMedia = async (mediaId: string, filePath: string) => {
    try {
      // Storage'dan sil
      const { error: storageError } = await supabase.storage
        .from('product-media')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Database'den sil
      const { error: dbError } = await supabase
        .from('product_media')
        .delete()
        .eq('id', mediaId);

      if (dbError) throw dbError;

      // Listeyi yenile
      loadMedia();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Basit URL gösterimi için
  if (mediaUrl) {
    // URL'nin video olup olmadığını kontrol et
    const isVideo = mediaUrl.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv)(\?|$)/i) || 
                    mediaUrl.includes('video') ||
                    mediaUrl.includes('video/');
    
    if (isVideo) {
      // Thumbnail modunda video oynatılmasın, sadece ilk frame gösterilsin
      if (isThumbnail) {
        return (
          <div className={`relative ${className}`}>
            <video
              src={mediaUrl}
              className="w-full h-full object-cover pointer-events-none"
              preload="metadata"
              muted
              onError={(e) => {
                (e.target as HTMLVideoElement).style.display = 'none';
              }}
            />
            {/* Video ikonu overlay - pointer-events-none ile tıklama button'a geçer */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 pointer-events-none">
              <svg className="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>
        );
      }
      
      // Ana görünümde tam video player
      return (
        <video
          src={mediaUrl}
          className={className}
          controls
          onError={(e) => {
            (e.target as HTMLVideoElement).style.display = 'none';
          }}
        >
          Tarayıcınız video oynatmayı desteklemiyor.
        </video>
      );
    }
    
    return (
      <img 
        src={mediaUrl} 
        alt={alt}
        className={className}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-500 p-4 ${className}`}>
        <p>Medya yüklenirken hata oluştu: {error}</p>
        <button 
          onClick={loadMedia}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  if (mediaItems.length === 0) {
    return (
      <div className={`text-gray-500 p-8 text-center ${className}`}>
        <div className="text-4xl mb-2">📷</div>
        <p>Henüz medya dosyası yüklenmemiş</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Ana Medya Görseli */}
      {mediaItems.length > 0 && (
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden aspect-square border border-gray-200">
            {mediaItems[0].media_type === 'image' ? (
              <img
                src={getMediaUrl(mediaItems[0].file_path)}
                alt={mediaItems[0].file_name}
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSelectedMedia(mediaItems[0])}
              />
            ) : (
              <video
                src={getMediaUrl(mediaItems[0].file_path)}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setSelectedMedia(mediaItems[0])}
                controls={false}
              />
            )}
          </div>
        </div>
      )}

      {/* Medya Thumbnail Grid */}
      {mediaItems.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {mediaItems.map((item) => (
            <div key={item.id} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {item.media_type === 'image' ? (
                  <img
                    src={getMediaUrl(item.file_path)}
                    alt={item.file_name}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setSelectedMedia(item)}
                  />
                ) : (
                  <video
                    src={getMediaUrl(item.file_path)}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setSelectedMedia(item)}
                    controls={false}
                  />
                )}
              </div>

              {/* Primary Badge */}
              {item.is_primary && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Ana Resim
                </div>
              )}

              {/* Media Type Badge */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {item.media_type === 'image' ? '🖼️' : '🎥'}
              </div>

              {/* Action Buttons */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedMedia(item)}
                    className="bg-white text-black px-3 py-1 rounded text-sm hover:bg-gray-100"
                  >
                    👁️ Görüntüle
                  </button>
                  {!item.is_primary && (
                    <button
                      onClick={() => setPrimaryMedia(item.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      ⭐ Ana Yap
                    </button>
                  )}
                  <button
                    onClick={() => deleteMedia(item.id, item.file_path)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    🗑️ Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Full Size View */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded-full hover:bg-gray-100 z-10"
            >
              ✕
            </button>
            
            <div className="bg-white rounded-lg overflow-hidden">
              {selectedMedia.media_type === 'image' ? (
                <img
                  src={getMediaUrl(selectedMedia.file_path)}
                  alt={selectedMedia.file_name}
                  className="max-w-full max-h-[80vh] object-contain"
                />
              ) : (
                <video
                  src={getMediaUrl(selectedMedia.file_path)}
                  className="max-w-full max-h-[80vh]"
                  controls
                  autoPlay
                />
              )}
            </div>
            
            <div className="mt-2 text-center text-white">
              <p className="text-sm">{selectedMedia.file_name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
