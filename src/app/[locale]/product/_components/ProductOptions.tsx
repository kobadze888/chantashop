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
          <h4 className="text-sm font-bold text-mocha-dark mb-2 uppercase tracking-wide">
            {attr.label || attr.name}: <span className="text-mocha-DEFAULT">{selectedOptions[attr.name]}</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {attr.options?.map((option) => {
              const isSelected = selectedOptions[attr.name] === option;
              return (
                <button
                  key={option}
                  onClick={() => onChange(attr.name, option)}
                  className={`px-4 py-2 text-sm border rounded-lg transition-all duration-200 ${
                    isSelected
                      ? 'border-mocha-DEFAULT bg-mocha-DEFAULT text-white shadow-md'
                      : 'border-mocha-medium/50 text-mocha-dark hover:border-mocha-DEFAULT hover:bg-mocha-light'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}