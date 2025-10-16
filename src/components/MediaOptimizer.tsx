'use client';

import { useState } from 'react';

interface MediaOptimizerProps {
  file: File;
  onOptimized: (optimizedFile: File) => void;
  onError: (error: string) => void;
}

export default function MediaOptimizer({ file, onOptimized, onError }: MediaOptimizerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const optimizeImage = async (imageFile: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Yeni boyutları hesapla (resimler için maksimum 1920x1080)
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

        // Çiz ve sıkıştır
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], imageFile.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(optimizedFile);
            } else {
              reject(new Error('Resim optimize edilemedi'));
            }
          },
          'image/jpeg',
          0.85 // 85% quality
        );
      };

      img.onerror = () => reject(new Error('Resim yüklenemedi'));
      img.src = URL.createObjectURL(imageFile);
    });
  };

  const createThumbnail = async (imageFile: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Küçük resim boyutu
        const thumbnailSize = 300;
        let { width, height } = img;

        // Küçük resim boyutlarını hesapla
        if (width > height) {
          height = (height * thumbnailSize) / width;
          width = thumbnailSize;
        } else {
          width = (width * thumbnailSize) / height;
          height = thumbnailSize;
        }

        canvas.width = thumbnailSize;
        canvas.height = thumbnailSize;

        // Küçük resim çiz
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const thumbnailFile = new File([blob], `thumb_${imageFile.name}`, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(thumbnailFile);
            } else {
              reject(new Error('Küçük resim oluşturulamadı'));
            }
          },
          'image/jpeg',
          0.8 // 80% quality for thumbnail
        );
      };

      img.onerror = () => reject(new Error('Küçük resim için resim yüklenemedi'));
      img.src = URL.createObjectURL(imageFile);
    });
  };

  const processMedia = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      let optimizedFile = file;
      let thumbnailFile: File | null = null;

      // Resimleri işle
      if (file.type.startsWith('image/')) {
        setProgress(25);
        optimizedFile = await optimizeImage(file);
        setProgress(50);
        thumbnailFile = await createThumbnail(file);
        setProgress(75);
      }

      setProgress(100);
      onOptimized(optimizedFile);
      
      // If we have a thumbnail, we could upload it separately
      if (thumbnailFile) {
        console.log('Küçük resim oluşturuldu:', thumbnailFile.name);
      }

    } catch (error: any) {
      onError(error.message || 'Medya optimize edilemedi');
    } finally {
      setIsProcessing(false);
    }
  };

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bayt';
    const k = 1024;
    const sizes = ['Bayt', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-900">Medya Optimizasyonu</h4>
          <span className="text-sm text-gray-500">
            {getFileSize(file.size)}
          </span>
        </div>
        
        <div className="text-sm text-gray-600 mb-3">
          <p>Dosya: {file.name}</p>
          <p>Tür: {file.type}</p>
        </div>

        {isProcessing && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">Medya optimize ediliyor...</p>
          </div>
        )}

        {!isProcessing && (
          <button
            onClick={processMedia}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium"
          >
            Medyayı Optimize Et
          </button>
        )}
      </div>
    </div>
  );
}
