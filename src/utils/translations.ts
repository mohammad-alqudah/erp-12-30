export const translations = {
  common: {
    actions: 'الإجراءات',
    cancel: 'إلغاء',
    save: 'حفظ',
    edit: 'تعديل',
    delete: 'حذف',
    print: 'طباعة',
    export: 'تصدير',
    search: 'بحث',
    loading: 'جارٍ التحميل...',
    success: 'تم بنجاح',
    error: 'حدث خطأ',
    confirm: 'تأكيد',
    next: 'التالي',
    previous: 'السابق'
  },
  products: {
    title: 'المنتجات',
    totalLabel: 'إجمالي المنتجات',
    addProduct: 'إضافة منتج',
    importProducts: 'استيراد المنتجات',
    searchPlaceholder: 'البحث في المنتجات...',
    fields: {
      name: 'الاسم',
      barcode: 'الباركود',
      price: 'السعر',
      quantity: 'الكمية',
      stockQuantity: 'كمية المخزون'
    }
  },
  inventory: {
    title: 'جرد المنتجات',
    totalLabel: 'إجمالي عمليات الجرد',
    openInventory: 'فتح جرد جديد',
    closeInventory: 'إغلاق الجرد',
    searchPlaceholder: 'البحث في عمليات الجرد...',
    fields: {
      name: 'الاسم',
      openedBy: 'تم الفتح بواسطة',
      createdAt: 'تاريخ الإنشاء',
      status: 'الحالة',
      open: 'مفتوح',
      closed: 'مغلق'
    }
  },
  assets: {
    title: 'الأصول الثابتة',
    totalLabel: 'إجمالي الأصول',
    addAsset: 'إضافة أصل',
    printLabel: 'طباعة ملصق',
    searchPlaceholder: 'البحث في الأصول...',
    fields: {
      name: 'الاسم',
      barcode: 'الباركود',
      purchaseDate: 'تاريخ الشراء',
      depreciationRate: 'نسبة الإهلاك',
      quantity: 'الكمية',
      mainCategory: 'التصنيف الرئيسي',
      subCategory: 'التصنيف الفرعي'
    }
  },
  users: {
    title: 'المستخدمين',
    totalLabel: 'إجمالي المستخدمين',
    addUser: 'إضافة مستخدم',
    searchPlaceholder: 'البحث عن المستخدمين...',
    fields: {
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      firstName: 'الاسم الأول',
      lastName: 'الاسم الأخير',
      email: 'البريد الإلكتروني'
    },
    permissions: {
      title: 'الصلاحيات',
      products: 'المنتجات',
      customers: 'العملاء',
      messaging: 'الرسائل',
      inventory: 'المخزون',
      manualScan: 'المسح اليدوي'
    }
  }
};