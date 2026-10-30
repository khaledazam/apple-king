/**
 * APPLE KING — DYNAMIC CATEGORY & SUBCATEGORY TAXONOMY
 *
 * Mapped to authoritative ERP database categories:
 * Accessories: charger, cable, earphone, power_bank, case, screen_protector, other
 * Phones: Apple, Samsung, Xiaomi, etc. / new, used, refurbished
 */

export interface SubcategoryItem {
  id: string;
  label: string;
  labelAr: string;
  href: string;
  filterKey: 'brand' | 'condition' | 'category';
  filterValue: string;
  descriptionAr?: string;
}

export interface PrimaryCategory {
  id: 'phones' | 'accessories';
  label: string;
  labelAr: string;
  href: string;
  productType: 'phone' | 'accessory';
  descriptionAr: string;
  subcategories: SubcategoryItem[];
}

export const CATALOG_TAXONOMY: PrimaryCategory[] = [
  {
    id: 'phones',
    label: 'Mobile Phones',
    labelAr: 'الموبايلات والهواتف الذكية',
    href: '/products?productType=phone',
    productType: 'phone',
    descriptionAr: 'تشكيلة مميزة من أحدث هواتف آبل، سامسونج، وشاومي بحالات جديدة وكسر زيرو معتمدة.',
    subcategories: [
      {
        id: 'apple',
        label: 'Apple iPhone',
        labelAr: 'آبل آيفون',
        href: '/products?productType=phone&brand=Apple',
        filterKey: 'brand',
        filterValue: 'Apple',
        descriptionAr: 'سلسلة هواتف iPhone الرائدة بأعلى معايير الجودة والأداء.',
      },
      {
        id: 'samsung',
        label: 'Samsung Galaxy',
        labelAr: 'سامسونج جالاكسي',
        href: '/products?productType=phone&brand=Samsung',
        filterKey: 'brand',
        filterValue: 'Samsung',
        descriptionAr: 'أحدث هواتف سلسلة Galaxy S و Z Fold و A.',
      },
      {
        id: 'xiaomi',
        label: 'Xiaomi',
        labelAr: 'شاومي',
        href: '/products?productType=phone&brand=Xiaomi',
        filterKey: 'brand',
        filterValue: 'Xiaomi',
        descriptionAr: 'قيمة استثنائية ومواصفات قوية مع هواتف شاومي وريدمي.',
      },
      {
        id: 'new_phones',
        label: 'New Devices',
        labelAr: 'أجهزة جديدة متبرشمة',
        href: '/products?productType=phone&condition=new',
        filterKey: 'condition',
        filterValue: 'new',
        descriptionAr: 'أجهزة جديدة أصلية بالعلبة والضمان الكامل.',
      },
      {
        id: 'used_phones',
        label: 'Certified Used',
        labelAr: 'أجهزة مستعملة كسر زيرو',
        href: '/products?productType=phone&condition=used',
        filterKey: 'condition',
        filterValue: 'used',
        descriptionAr: 'أجهزة مفحوصة بدقة وبحالة ممتازة مع ضمان المعاينة.',
      },
    ],
  },
  {
    id: 'accessories',
    label: 'Accessories',
    labelAr: 'الإكسسوارات الأصلية',
    href: '/products?productType=accessory',
    productType: 'accessory',
    descriptionAr: 'شواحن، كابلات، سماعات، جرابات، وبطاريات متنقلة من كبرى العلامات المعتمدة.',
    subcategories: [
      {
        id: 'chargers',
        label: 'Fast Chargers',
        labelAr: 'شواحن ورؤوس شحن سريع',
        href: '/products?productType=accessory&category=charger',
        filterKey: 'category',
        filterValue: 'charger',
        descriptionAr: 'شواحن سريعة معتمدة تدعم تقنيات PD و GaN.',
      },
      {
        id: 'cables',
        label: 'Charging Cables',
        labelAr: 'كابلات ووصلات شحن',
        href: '/products?productType=accessory&category=cable',
        filterKey: 'category',
        filterValue: 'cable',
        descriptionAr: 'كابلات Type-C و Lightning فائقة المتانة وسرعة نقل البيانات.',
      },
      {
        id: 'earphones',
        label: 'Earphones & Headphones',
        labelAr: 'سماعات وهيدفون بلوتوث',
        href: '/products?productType=accessory&category=earphone',
        filterKey: 'category',
        filterValue: 'earphone',
        descriptionAr: 'سماعات لاسلكية وسلكية مع عزل صوت نقي.',
      },
      {
        id: 'power_banks',
        label: 'Power Banks',
        labelAr: 'باور بانك وبطاريات متنقلة',
        href: '/products?productType=accessory&category=power_bank',
        filterKey: 'category',
        filterValue: 'power_bank',
        descriptionAr: 'شواحن متنقلة بسعات مختلفة وأمان فائق.',
      },
      {
        id: 'cases',
        label: 'Protection Cases',
        labelAr: 'جرابات وكفرات حماية',
        href: '/products?productType=accessory&category=case',
        filterKey: 'category',
        filterValue: 'case',
        descriptionAr: 'جرابات أنيقة مقاومة للصدمات والخدوش.',
      },
      {
        id: 'screen_protectors',
        label: 'Screen Protectors',
        labelAr: 'اسكرينات وحماية شاشات',
        href: '/products?productType=accessory&category=screen_protector',
        filterKey: 'category',
        filterValue: 'screen_protector',
        descriptionAr: 'زجاج مقوى عالي الشفافية لحماية الشاشة والكاميرات.',
      },
    ],
  },
];

/**
 * Normalizes an Arabic or English accessory category name to the authoritative schema key.
 */
export function normalizeAccessoryCategory(raw: string): string {
  const clean = raw.trim().toLowerCase();
  const map: Record<string, string> = {
    charger: 'charger',
    chargers: 'charger',
    شاحن: 'charger',
    شواحن: 'charger',
    cable: 'cable',
    cables: 'cable',
    كابل: 'cable',
    كابلات: 'cable',
    earphone: 'earphone',
    earphones: 'earphone',
    سماعة: 'earphone',
    سماعات: 'earphone',
    power_bank: 'power_bank',
    powerbank: 'power_bank',
    'باور بانك': 'power_bank',
    باوربانك: 'power_bank',
    case: 'case',
    cases: 'case',
    جراب: 'case',
    جرابات: 'case',
    screen_protector: 'screen_protector',
    اسكرينة: 'screen_protector',
    اسكرينات: 'screen_protector',
    حماية: 'screen_protector',
  };
  return map[clean] || clean;
}

/** Canonical ERP accessory departments, also used by public navigation. */
export const ACCESSORY_DEPARTMENTS = [
  { value: 'charger', label: 'شواحن' },
  { value: 'case', label: 'جرابات' },
  { value: 'cable', label: 'كابلات' },
  { value: 'earphone', label: 'سماعات' },
  { value: 'power_bank', label: 'باور بانك' },
  { value: 'screen_protector', label: 'حماية الشاشة' },
  { value: 'other', label: 'إكسسوارات أخرى' },
] as const;
