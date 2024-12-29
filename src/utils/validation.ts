export const validateRequired = (value: any): string | undefined => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return 'هذا الحقل مطلوب';
  }
};

export const validateEmail = (email: string): string | undefined => {
  if (!email) return;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'البريد الإلكتروني غير صالح';
  }
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) return;
  if (password.length < 8) {
    return 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
  }
};

export const validateBarcode = (barcode: string): string | undefined => {
  if (!barcode) return;
  if (!/^[A-Za-z0-9]+$/.test(barcode)) {
    return 'الباركود يجب أن يحتوي على أرقام وحروف فقط';
  }
};