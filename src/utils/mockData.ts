// Existing mock data...

export const mockAssets = [
  {
    id: '1',
    barcode: 'AST001',
    name: 'جهاز كمبيوتر مكتبي',
    purchase_date: '2024-01-15',
    depreciation_rate: 20,
    quantity: 5,
    main_category_name: 'أجهزة إلكترونية',
    sub_category_name: 'أجهزة كمبيوتر'
  },
  {
    id: '2',
    barcode: 'AST002',
    name: 'طابعة ليزر',
    purchase_date: '2024-02-01',
    depreciation_rate: 15,
    quantity: 3,
    main_category_name: 'أجهزة إلكترونية',
    sub_category_name: 'طابعات'
  },
  {
    id: '3',
    barcode: 'AST003',
    name: 'مكتب خشبي',
    purchase_date: '2024-01-20',
    depreciation_rate: 10,
    quantity: 10,
    main_category_name: 'أثاث',
    sub_category_name: 'مكاتب'
  }
];

export const mockCategories = [
  {
    id: '1',
    name: 'أجهزة إلكترونية',
    sub_categories: [
      { id: '1-1', name: 'أجهزة كمبيوتر' },
      { id: '1-2', name: 'طابعات' },
      { id: '1-3', name: 'شاشات' }
    ]
  },
  {
    id: '2',
    name: 'أثاث',
    sub_categories: [
      { id: '2-1', name: 'مكاتب' },
      { id: '2-2', name: 'كراسي' },
      { id: '2-3', name: 'خزائن' }
    ]
  },
  {
    id: '3',
    name: 'معدات',
    sub_categories: [
      { id: '3-1', name: 'أدوات كهربائية' },
      { id: '3-2', name: 'أدوات يدوية' }
    ]
  }
];