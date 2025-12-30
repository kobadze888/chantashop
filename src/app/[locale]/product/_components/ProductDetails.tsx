'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, FileText, Truck, ShieldCheck } from 'lucide-react';
import { Product, Variation } from '@/types';
import ProductOptions from './ProductOptions';
import AddToCartButton from './AddToCartButton';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  
  // ✅ ვარიაციების მართვისთვის დამატებული State
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // ✅ არჩეული ვარიაციის პოვნა SKU-ს და მარაგის წამოსაღებად
  const selectedVariation = useMemo(() => {
    if (!product.variations?.nodes) return null;
    
    return product.variations.nodes.find((variation) => {
      return variation.attributes?.nodes.every((attr) => {
        // ვამოწმებთ ემთხვევა თუ არა არჩეული ოფცია ვარიაციის ატრიბუტს
        return selectedOptions[attr.name] === attr.value || 
               selectedOptions[attr.name] === attr.terms?.nodes[0]?.name;
      });
    });
  }, [product.variations, selectedOptions]);

  // ✅ მონაცემები კალათისთვის: თუ ვარიაცია არჩეულია, ვიღებთ მის მონაცემებს, თუ არა - მთავარი პროდუქტისას
  const cartProductData = {
    id: selectedVariation ? selectedVariation.databaseId : product.databaseId,
    name: product.name + (selectedVariation ? ` - ${selectedVariation.name}` : ''),
    price: selectedVariation ? selectedVariation.price : product.price,
    image: selectedVariation?.image?.sourceUrl || product.image.sourceUrl,
    slug: product.slug,
    sku: selectedVariation ? selectedVariation.sku : product.sku, // 👈 მნიშვნელოვანია გლობალური მარაგისთვის
    stockQuantity: selectedVariation ? selectedVariation.stockQuantity : product.stockQuantity, // 👈 მარაგის რაოდენობა
    selectedOptions: selectedOptions,
    quantity: 1 // საწყისი რაოდენობა დასამატებლად
  };

  const toggle = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  // ატრიბუტების მომზადება ProductOptions-ისთვის
  const productAttributes = product.attributes?.nodes.map(attr => ({
    name: attr.name,
    label: attr.label,
    options: attr.options || attr.terms?.nodes.map(t => t.name) || []
  })) || [];

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [name]: value }));
  };

  const sections = [
    {
      id: 'full_desc',
      title: 'სრული აღწერა',
      icon: FileText,
      content: (
        <div 
          className="prose prose-sm text-gray-600 leading-relaxed max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description || '<p>დამატებითი აღწერა არ არის.</p>' }} 
        />
      )
    },
    {
      id: 'shipping',
      title: 'მიწოდება და გარანტია',
      icon: Truck,
      content: (
        <div className="text-sm text-gray-600 space-y-4">
          <div className="flex gap-3">
             <Truck className="w-5 h-5 text-brand-DEFAULT flex-shrink-0" />
             <div>
                <p className="font-bold text-brand-dark mb-1">უფასო მიწოდება</p>
                <p>200₾-ის ზემოთ შეკვეთებზე მთელი საქართველოს მასშტაბით.</p>
             </div>
          </div>
          <div className="flex gap-3">
             <ShieldCheck className="w-5 h-5 text-brand-DEFAULT flex-shrink-0" />
             <div>
                <p className="font-bold text-brand-dark mb-1">ხარისხის გარანტია</p>
                <p>ჩვენთან შეძენილ ყველა ნივთზე მოქმედებს 1 წლიანი ქარხნული გარანტია.</p>
             </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="mt-4 flex flex-col gap-6">
      {/* ✅ ვარიაციების ასარჩევი ღილაკები */}
      {productAttributes.length > 0 && (
        <ProductOptions 
          attributes={productAttributes} 
          selectedOptions={selectedOptions} 
          onChange={handleOptionChange} 
        />
      )}

      {/* ✅ კალათაში დამატების ღილაკი აქტუალური SKU-თ და მარაგით */}
      <AddToCartButton 
        product={cartProductData}
        stockStatus={selectedVariation ? selectedVariation.stockStatus : product.stockStatus}
      />

      {/* სექციები (აღწერა, მიწოდება) */}
      <div className="mt-4">
        {sections.map((section) => (
          <div key={section.id} className="border-b border-gray-100 last:border-0">
            <button 
              onClick={() => toggle(section.id)}
              className="w-full py-5 flex items-center justify-between group hover:text-brand-DEFAULT transition-colors"
            >
              <div className="flex items-center gap-3">
                <section.icon className={`w-4 h-4 ${openSection === section.id ? 'text-brand-DEFAULT' : 'text-gray-400'}`} />
                <span className="font-bold text-brand-dark uppercase tracking-widest text-xs group-hover:text-brand-DEFAULT transition-colors">
                  {section.title}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 text-gray-400 ${openSection === section.id ? 'rotate-180' : ''}`} />
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openSection === section.id ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="pl-7 text-gray-600">
                {section.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}