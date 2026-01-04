'use client';

interface ProductOptionsProps {
  attributes: {
    name: string;
    label?: string;
    options?: string[];
  }[];
  selectedOptions: Record<string, string>;
  onChange: (attributeName: string, value: string) => void;
}

export default function ProductOptions({ attributes, selectedOptions, onChange }: ProductOptionsProps) {
  if (!attributes || attributes.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 mb-6">
      {attributes.map((attr) => (
        <div key={attr.name}>
          <h4 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            {attr.label || attr.name}: <span className="text-brand-DEFAULT">{selectedOptions[attr.name]}</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {attr.options?.map((option) => {
              const isSelected = selectedOptions[attr.name] === option;
              // ვამოწმებთ არის თუ არა ფერის ატრიბუტი (ფერის სვოტჩებისთვის)
              const isColor = attr.name.toLowerCase().includes('color') || attr.name.includes('feri');

              return (
                <button
                  key={option}
                  onClick={() => onChange(attr.name, option)}
                  className={`
                    transition-all duration-200 cursor-pointer
                    ${isColor 
                        ? `w-8 h-8 rounded-full border-2 ${isSelected ? 'border-brand-DEFAULT ring-2 ring-brand-light ring-offset-1' : 'border-gray-200 hover:border-gray-300'}`
                        : `px-4 py-2 text-sm border rounded-lg ${isSelected ? 'border-brand-DEFAULT bg-brand-DEFAULT text-white shadow-md' : 'border-gray-200 text-gray-700 hover:border-brand-DEFAULT hover:bg-gray-50'}`
                    }
                  `}
                  style={isColor ? { backgroundColor: option } : {}} // აქ შეგიძლიათ colorMap გამოიყენოთ თუ გინდათ
                  title={option}
                >
                  {!isColor && option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}