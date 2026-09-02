const CLOUDINARY_URL = process.env.CLOUDINARY_URL || '';
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || 'payment_proofs';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadPaymentProof(
  file: File,
  orderId: string
): Promise<UploadResult> {
  if (!CLOUDINARY_URL) {
    return {
      success: false,
      error: 'Cloudinary no está configurado. Use el enlace de pago directo.',
    };
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', `payment-proofs/${orderId}`);
  formData.append('resource_type', 'auto');

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error?.message || 'Error al subir el comprobante',
      };
    }

    const data = await response.json();
    return {
      success: true,
      url: data.secure_url,
    };
  } catch {
    return {
      success: false,
      error: 'Error de red al subir el comprobante',
    };
  }
}

export function getCloudinaryUrl(publicId: string): string {
  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
}
