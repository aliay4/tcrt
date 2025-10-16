// Error handling utilities

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleApiError = (error: any): AppError => {
  console.error('API Error:', error);

  // Network errors
  if (!navigator.onLine) {
    return new AppError('İnternet bağlantınızı kontrol edin', 0);
  }

  // Supabase errors
  if (error?.code) {
    switch (error.code) {
      case 'PGRST116':
        return new AppError('Kayıt bulunamadı', 404);
      case '23505':
        return new AppError('Bu kayıt zaten mevcut', 409);
      case '23503':
        return new AppError('Bu kayıt başka kayıtlarla ilişkili', 409);
      case '42501':
        return new AppError('Bu işlem için yetkiniz yok', 403);
      default:
        return new AppError(error.message || 'Veritabanı hatası', 500);
    }
  }

  // Generic errors
  if (error instanceof AppError) {
    return error;
  }

  if (error.message) {
    return new AppError(error.message, 500);
  }

  return new AppError('Beklenmeyen bir hata oluştu', 500);
};

export const getErrorMessage = (error: any): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error?.message) {
    return error.message;
  }

  return 'Beklenmeyen bir hata oluştu';
};

export const isNetworkError = (error: any): boolean => {
  return error?.code === 'NETWORK_ERROR' || 
         error?.message?.includes('fetch') ||
         !navigator.onLine;
};

export const isAuthError = (error: any): boolean => {
  return error?.statusCode === 401 || 
         error?.statusCode === 403 ||
         error?.message?.includes('auth');
};
