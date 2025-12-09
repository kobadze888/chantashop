// src/lib/utils.ts

/**
 * WooCommerce-ის API-დან მიღებული ფასის სტრიქონის დამუშავება.
 * ფასი მოაქვს მთელ რიცხვამდე (თუ ათწილადი .00-ია) და ამატებს ვალუტის სიმბოლოს.
 * @param priceString - ფასი, რომელიც შეიძლება შეიცავდეს ვალუტის სიმბოლოს (მაგ. "$45.00" ან "45.00")
 * @returns დამუშავებული ფასის სტრიქონი (მაგ. "45 ₾")
 */
export const formatPrice = (priceString: string | undefined | null): string => {
  if (!priceString) return '0 ₾';

  // 1. ვპოულობთ ყველა ციფრს და წერტილს
  const matches = priceString.match(/(\d+\.?\d*)/g);
  if (!matches || matches.length === 0) return '0 ₾';
  
  // 2. ვიღებთ უმცირეს ფასს (Variable Products-ისთვის)
  const priceValue = Math.min(...matches.map(p => parseFloat(p)));
  
  // 3. ვამოწმებთ, არის თუ არა რიცხვი მთელი (მაგ. 45.00)
  if (priceValue % 1 === 0) {
    return `${Math.floor(priceValue)} ₾`;
  }
  
  // 4. თუ არის ათწილადი, ვტოვებთ ორ ათწილადს.
  return `${priceValue.toFixed(2)} ₾`;
};

/**
 * ფასის პარსინგი რიცხვად ფილტრაციისთვის (CatalogClient-ში გამოიყენება)
 */
export const parsePrice = (priceString: string | undefined | null): number => {
  if (!priceString) return 0;
  const matches = priceString.match(/(\d+\.?\d*)/g);
  if (!matches || matches.length === 0) return 0;
  const prices = matches.map(p => parseFloat(p));
  return Math.min(...prices);
};