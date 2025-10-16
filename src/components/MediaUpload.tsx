'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import MediaOptimizer from './MediaOptimizer';

interface MediaUploadProps {
  productId: string;
  onUploadComplete?: (media: any) => void;
  onUpload?: (mediaUrl: string) => void;
  onUploadError?: (error: string) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error' | 'optimizing';
  error?: string;
  optimizedFile?: File;
}

export default function MediaUpload({ 
  productId, 
  onUploadComplete, 
  onUpload,
  onUploadError,
  accept = "image/*,video/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  className = ""
}: MediaUploadProps) {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      // Dosya boyutu kontrolü
      if (file.size > maxSize) {
        onUploadError?.(`Dosya boyutu çok büyük. Maksimum ${Math.round(maxSize / 1024 / 1024)}MB olmalı.`);
        return false;
      }

      // Accept filtresi kontrolü
      if (accept && accept !== "*") {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const isAccepted = acceptedTypes.some(type => {
          if (type.endsWith('/*')) {
            return file.type.startsWith(type.slice(0, -1));
          }
          return file.type === type;
        });
        
        if (!isAccepted) {
          onUploadError?.(`Dosya türü desteklenmiyor. Kabul edilen türler: ${accept}`);
          return false;
        }
      }

      const isValidImage = file.type.startsWith('image/') && 
        ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type);
      const isValidVideo = file.type.startsWith('video/') && 
        ['video/mp4', 'video/webm', 'video/quicktime'].includes(file.type);
      
      return isValidImage || isValidVideo;
    });

    if (validFiles.length !== fileArray.length) {
      onUploadError?.('Bazı dosyalar desteklenmiyor. Sadece JPG, PNG, GIF, WebP (resim) ve MP4, WebM, QuickTime (video) dosyaları desteklenir.');
    }

    validFiles.forEach(file => {
      uploadFile(file);
    });
  };

  const uploadFile = async (file: File) => {
    const fileId = Math.random().toString(36).substr(2, 9);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${fileId}.${fileExtension}`;
    
    // Kategori için özel path
    const isCategory = productId === 'category';
    const filePath = isCategory ? `categories/${fileName}` : `products/${productId}/${fileName}`;

    // Upload progress'i başlat
    const uploadProgress: UploadProgress = {
      file,
      progress: 0,
      status: 'uploading'
    };

    setUploads(prev => [...prev, uploadProgress]);

    try {
      let fileToUpload = file;
      
      // Resimleri optimize et
      if (file.type.startsWith('image/')) {
        setUploads(prev => 
          prev.map(upload => 
            upload.file === file 
              ? { ...upload, status: 'optimizing' }
              : upload
          )
        );

        // Basit optimizasyon - çok büyükse boyutunu küçült
        if (file.size > 5 * 1024 * 1024) { // 5MB
          fileToUpload = await optimizeImage(file);
        }
      }

      // Supabase Storage'a yükle (kategoriler için de product-media bucket'ını kullan)
      const { data, error } = await supabase.storage
        .from('product-media')
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Public URL'yi al
      const publicUrl = supabase.storage
        .from('product-media')
        .getPublicUrl(filePath).data.publicUrl;

      // Kategori için veritabanı işlemlerini atla
      if (isCategory) {
        // Yüklemeyi tamamlandı olarak işaretle
        setUploads(prev => 
          prev.map(upload => 
            upload.file === file 
              ? { ...upload, progress: 100, status: 'completed' }
              : upload
          )
        );

        // Callback'leri çağır
        onUploadComplete?.({ publicUrl, filePath });
        onUpload?.(publicUrl);
        return;
      }

      // Ürün için veritabanı işlemleri
      const mediaType = file.type.startsWith('image/') ? 'image' : 'video';
      
      const { data: mediaData, error: mediaError } = await supabase
        .from('product_media')
        .insert({
          product_id: productId,
          file_name: file.name,
          file_path: filePath,
          file_size: fileToUpload.size,
          mime_type: fileToUpload.type,
          media_type: mediaType,
          is_primary: false
        })
        .select()
        .single();

      if (mediaError) throw mediaError;

      // Mevcut ürünün images dizisini al
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('images')
        .eq('id', productId)
        .single();

      if (productError) throw productError;

      // Yeni resim URL'sini images dizisine ekle
      const currentImages = productData.images || [];
      const updatedImages = [...currentImages, publicUrl];

      // Products tablosunu güncelle
      const { error: updateError } = await supabase
        .from('products')
        .update({ images: updatedImages })
        .eq('id', productId);

      if (updateError) throw updateError;

      // Yüklemeyi tamamlandı olarak işaretle
      setUploads(prev => 
        prev.map(upload => 
          upload.file === file 
            ? { ...upload, progress: 100, status: 'completed' }
            : upload
        )
      );

      // Callback'leri çağır
      onUploadComplete?.(mediaData);
      onUpload?.(publicUrl);

    } catch (error: any) {
      console.error('Yükleme hatası:', error);
      
      setUploads(prev => 
        prev.map(upload => 
          upload.file === file 
            ? { 
                ...upload, 
                status: 'error', 
                error: error.message || 'Yükleme hatası'
              }
            : upload
        )
      );

      onUploadError?.(error.message || 'Dosya yüklenirken hata oluştu');
    }
  };

  const optimizeImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Yeni boyutları hesapla (maksimum 1920x1080)
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(optimizedFile);
            } else {
              reject(new Error('Resim optimize edilemedi'));
            }
          },
          'image/jpeg',
          0.85
        );
      };

      img.onerror = () => reject(new Error('Resim yüklenemedi'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const removeUpload = (file: File) => {
    setUploads(prev => prev.filter(upload => upload.file !== file));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return '🖼️';
    } else if (file.type.startsWith('video/')) {
      return '🎥';
    }
    return '📄';
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="space-y-2">
          <div className="text-4xl">📁</div>
          <p className="text-lg font-medium">Medya dosyalarını buraya sürükleyin</p>
          <p className="text-sm text-gray-500">
            veya dosya seçmek için tıklayın
          </p>
          <p className="text-xs text-gray-400">
            Desteklenen formatlar: JPG, PNG, GIF, WebP (resim), MP4, WebM, QuickTime (video)
          </p>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-medium">Yüklenen Dosyalar:</h4>
          {uploads.map((upload, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">{getFileIcon(upload.file)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{upload.file.name}</p>
                <p className="text-xs text-gray-500">
                  {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                {upload.status === 'uploading' && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                )}
                {upload.status === 'optimizing' && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-yellow-500 h-2 rounded-full animate-pulse" />
                  </div>
                )}
                {upload.status === 'error' && (
                  <p className="text-xs text-red-500 mt-1">{upload.error}</p>
                )}
                {upload.status === 'completed' && (
                  <p className="text-xs text-green-500 mt-1">✅ Yüklendi</p>
                )}
              </div>
              <button
                onClick={() => removeUpload(upload.file)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
