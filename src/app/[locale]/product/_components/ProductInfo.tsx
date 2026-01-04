'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from '@/navigation';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import {
    Heart, AlertCircle, Minus, Plus,
    Ruler, Box, Layers, Tag, Info,
    Truck, Check, CreditCard, Eye, Landmark, Star, Camera,
    ChevronDown, ChevronUp
} from 'lucide-react';
import { Product, CartItem } from '@/types';
import AddToCartButton from './AddToCartButton';
import ProductGallery from './ProductGallery';
import { useTranslations } from 'next-intl';

// Logo Components (TBC, BOG, Visa, Mastercard) 

const LogoBOG = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="37.69 58.13 166.59 136.12"
        className="h-6 md:h-8 w-auto"
        fill="none"
    >
        <g clipPath="url(#clip0_1077_9347)">
            <path d="M202.945 99.4716L185.655 119.742V157.432C185.655 177.732 169.145 194.252 148.845 194.252H86.3652C74.5852 194.252 64.0852 188.692 57.3452 180.042C56.1152 180.232 54.8152 180.332 53.4252 180.332C48.9452 180.332 37.6952 177.292 37.6952 170.112C37.6952 166.762 40.4252 164.042 43.7752 164.042C44.7952 164.042 45.6352 164.282 46.3252 164.552C46.3252 164.552 49.5552 165.802 49.5552 163.712V94.9516C49.5452 74.6516 66.0652 58.1316 86.3552 58.1316H148.835C184.035 58.1316 196.145 83.0116 203.675 94.0616C204.795 95.7016 204.215 97.9716 202.935 99.4816" fill="white" />
            <path d="M197.185 94.5616C194.625 91.0016 187.865 81.2616 183.385 77.6316C179.625 74.6316 175.215 72.4916 169.685 72.8416C160.125 73.4516 152.195 81.4916 147.165 87.4916C143.255 92.1416 131.295 99.5716 118.525 102.942C108.875 105.482 97.9952 104.192 89.3652 103.572C84.5952 103.232 80.2152 102.882 76.4552 103.072C62.8952 103.752 54.8152 113.702 55.1352 125.222C55.4652 136.922 63.5052 147.562 63.5052 158.542C63.5052 167.152 56.5052 170.952 51.6752 170.952C45.9052 170.952 45.5252 168.602 43.7652 168.602C43.0552 168.602 42.2252 169.192 42.2252 170.132C42.2252 173.042 49.3552 175.812 53.4052 175.812C64.2252 175.812 68.7252 168.092 68.7252 168.092C68.7252 168.092 71.4752 176.092 82.1452 176.092C90.6452 176.092 94.3252 172.022 94.3252 168.632C94.3252 165.942 93.0552 164.952 91.9352 163.672C82.9652 155.312 79.8752 149.472 81.3852 143.742C82.9252 137.892 89.0852 134.012 93.7852 134.082C93.7852 134.082 87.3152 137.692 85.9552 144.262C84.5552 151.002 91.8252 157.552 93.7252 158.262C93.7252 158.262 95.6452 158.262 96.1852 158.212C100.985 157.782 102.525 155.522 102.525 153.312C102.525 150.142 98.8152 150.362 98.8152 145.152C98.8152 141.212 100.995 139.922 102.925 139.922C105.005 139.922 112.885 140.682 122.435 141.662C125.625 141.982 133.575 145.062 133.575 157.412V161.852C133.575 169.382 136.605 178.692 149.915 178.692C158.955 178.692 164.025 173.652 164.025 170.012C164.025 167.632 161.945 166.592 160.915 165.162C157.905 160.942 159.385 155.072 159.385 155.072H159.445C160.715 155.482 162.165 155.722 163.865 155.722C170.525 155.722 173.655 153.082 173.655 149.922C173.655 146.232 168.665 146.252 168.145 143.002C167.495 138.952 168.575 121.022 175.545 111.112L181.055 113.592C181.875 113.962 182.845 113.742 183.415 113.052L197.095 97.0316C197.675 96.3316 197.715 95.3316 197.185 94.5816" fill="#FF6022" />
            <path d="M68.5752 134.142C65.9052 131.472 64.2552 127.782 64.2552 123.722C64.2552 115.582 71.5252 107.812 79.6652 107.762C87.9352 107.712 99.6452 109.852 110.195 108.962C112.795 121.322 121.725 129.672 129.235 135.142C124.975 133.632 111.315 123.632 103.625 119.372C91.3852 112.582 78.7752 111.232 72.3252 117.172C66.7752 122.282 67.5452 129.842 68.5752 134.132" fill="white" />
            <path d="M155.635 150.282V150.232C155.635 150.232 148.665 156.862 151.855 168.902C149.915 170.792 145.465 170.072 143.555 169.782C144.795 171.362 154.355 174.842 157.735 169.092C151.215 164.042 155.495 151.132 155.635 150.292" fill="white" />
            <path d="M183.435 88.7416C182.975 91.2816 180.125 92.9016 177.055 92.3416C173.985 91.7816 171.885 89.2716 172.355 86.7316C172.815 84.1816 175.665 82.5716 178.745 83.1316C181.795 83.6816 183.905 86.2016 183.435 88.7416Z" fill="white" />
            <path d="M170.675 110.042C158.535 109.322 149.725 102.102 147.245 95.8216C146.675 94.3816 147.555 93.4016 148.425 93.0016C149.285 92.6116 150.725 92.8516 151.265 94.2416C154.685 102.982 161.615 107.482 170.675 110.052" fill="white" />
            <path d="M166.415 119.872C149.895 119.422 140.995 112.842 136.395 103.212C135.905 102.192 136.185 100.892 137.465 100.322C138.745 99.7516 139.875 100.322 140.305 101.412C144.535 112.172 155.755 118.472 166.415 119.872Z" fill="white" />
            <path d="M124.055 108.622C130.575 124.132 145.125 131.262 163.335 130.282C146.525 129.002 133.585 121.242 128.045 107.062C127.525 105.722 126.415 105.392 125.395 105.712C124.365 106.022 123.435 107.172 124.055 108.632" fill="white" />
            <path d="M188.025 89.3116C188.025 89.3116 188.215 95.2916 181.375 98.3116C174.585 101.312 168.755 96.8816 168.465 96.6616C168.035 96.3416 167.765 95.8316 167.765 95.2616C167.765 94.2916 168.545 93.5116 169.515 93.5116C169.965 93.5116 170.375 93.6816 170.685 93.9516C171.005 94.2416 174.765 98.0616 180.965 96.5516C187.155 95.0316 188.045 89.3216 188.045 89.3216" fill="white" />
            <path d="M167.715 85.8215C167.595 86.6515 166.875 87.3015 166.005 87.3015C165.045 87.3015 164.275 86.5315 164.275 85.5715C164.275 85.4015 164.305 85.2315 164.345 85.0815C164.485 84.6115 166.195 79.0515 172.445 77.6015C178.565 76.1815 182.625 79.2415 182.625 79.2415C182.625 79.2415 178.135 76.7115 172.975 79.0515C168.775 80.8715 167.785 85.2915 167.705 85.8315" fill="white" />
        </g>
        <defs>
            <clipPath id="clip0_1077_9347">
                <rect width="166.59" height="136.12" fill="white" transform="translate(37.6952 58.1316)" />
            </clipPath>
        </defs>
    </svg>
);

const LogoTBC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 105.8 93.2" className="h-6 md:h-8 w-auto">
        <style type="text/css">
            {`.st0{fill:#00A3E0;stroke:#FFFFFF;stroke-width:0.5;stroke-miterlimit:10;}`}
        </style>
        <path className="st0" d="M98.6,93.2H7.4c-4,0-5.2-0.9,1.8-3.2C19.3,86.4,33,79.5,48.3,67.5c3.6-2.8,5.8-3.6,10.9-2.5 c16.4,4.5,31.6,14,40.9,20.8c4.1,3,4.9,4.2,4.2,5.7c-0.4,0.9-1.8,1.5-5.9,1.5" />
        <path className="st0" d="M53.6,0.1c1.2-0.5,2.6,0.8,4,3.3c0.7,1.2,45.2,78.3,46.7,80.8c3.2,5.4,1,3.7-3.1,0.4c-8.2-7-21.9-16-40.2-23.3 c-4.8-2-5.9-3.7-7.2-7.8C49.2,36,50.2,16.8,51.5,5.4C51.9,2.4,52.4,0.7,53.6,0.1" />
        <path className="st0" d="M1.5,84.6C14.2,62.7,46.7,6.5,48.2,3.8c4.1-7,2.1-0.2,1.6,2.7c-1.9,10.6-3,27.3-0.3,46.6c0.7,5,0,6.9-3.3,10.7 C33.3,76.5,16,85.2,5.7,89.7c-3,1.3-4.6,1.2-5.2,0.4C-0.3,89.3-0.2,87.7,1.5,84.6" />
    </svg>
);

const LogoMastercard = () => (
    <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" className="h-6 md:h-8 w-auto" aria-labelledby="pi-master">
        <title id="pi-master">Mastercard</title>
        <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path>
        <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path>
        <circle fill="#EB001B" cx="15" cy="12" r="7"></circle>
        <circle fill="#F79E1B" cx="23" cy="12" r="7"></circle>
        <path fill="#FF5F00" d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"></path>
    </svg>
);

const LogoVisa = () => (
    <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" className="h-6 md:h-8 w-auto" aria-labelledby="pi-visa">
        <title id="pi-visa">Visa</title>
        <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path>
        <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path>
        <path d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z" fill="#142688"></path>
    </svg>
);

interface ProductInfoProps {
    product: Product;
    locale?: string;
}

const getAttributeIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('zoma') || lowerName.includes('size') || lowerName.includes('სიმაღლე') || lowerName.includes('სიგანე')) return <Ruler className="w-4 h-4 text-brand-DEFAULT" />;
    if (lowerName.includes('masala') || lowerName.includes('material')) return <Layers className="w-4 h-4 text-brand-DEFAULT" />;
    if (lowerName.includes('sku') || lowerName.includes('kodi')) return <Tag className="w-4 h-4 text-brand-DEFAULT" />;
    if (lowerName.includes('xarisxi') || lowerName.includes('quality')) return <Check className="w-4 h-4 text-brand-DEFAULT" />;
    return <Box className="w-4 h-4 text-brand-DEFAULT" />;
};

// ✅ ლექსიკონი: სლაგი -> ლამაზი სახელი (ინგლისური, რუსული და ქართული სლაგები)
const slugToNameMap: Record<string, string> = {
    // English
    'red-en': 'Red', 'black-en': 'Black', 'white-en': 'White', 'blue-en': 'Blue',
    'green-en': 'Green', 'yellow-en': 'Yellow', 'grey-en': 'Grey', 'pink-en': 'Pink',
    'purple-en': 'Purple', 'brown-en': 'Brown', 'beige-en': 'Beige', 'orange-en': 'Orange',
    'silver-en': 'Silver', 'gold-en': 'Gold', 'nude-en': 'Nude', 'cream-en': 'Cream',
    'light-blue-en': 'Light Blue', 'dark-blue-en': 'Dark Blue',

    // Russian
    'chernyj-ru': 'Черный', 'belyj-ru': 'Белый', 'sinij-ru': 'Синий', 'krasnyj-ru': 'Красный',
    'zelenyj-ru': 'Зеленый', 'zheltyj-ru': 'Желтый', 'seryj-ru': 'Серый', 'rozovyj-ru': 'Розовый',
    'fioletovyj-ru': 'Фиолетовый', 'korichnevyj-ru': 'Коричневый', 'bezhevyj-ru': 'Бежевый',
    'oranzhevyj-ru': 'Оранжевый', 'serebristyj-ru': 'Серебристый', 'zolotistyj-ru': 'Золотистый',
    'telesnyj-ru': 'Телесный', 'temno-sinij-ru': 'Темно-синий', 'goluboj-ru': 'Голубой',

    // ✅ Georgian (Transliterated slugs -> Georgian script)
    'shavi': 'შავი',
    'tetri': 'თეთრი',
    'lurji': 'ლურჯი',
    'tsiteli': 'წითელი',
    'beji': 'ბეჟი',
    'yavisferi': 'ყავისფერი', // თქვენი კონკრეტული ქეისი
    'vardisferi': 'ვარდისფერი',
    'mwvane': 'მწვანე',
    'stafilosferi': 'ნარინჯისფერი',
    'yviteli': 'ყვითელი',
    'rcuxi': 'რუხი',
    'nacrisferi': 'ნაცრისფერი',
    'cisferi': 'ცისფერი',
    'muqi_lurji': 'მუქი ლურჯი',
    'vercxlisferi': 'ვერცხლისფერი',
    'oqrosferi': 'ოქროსფერი',
    'iasamnisferi': 'იასამნისფერი',
    'kanisferi': 'ხორცისფერი',
};

// ✅ დამხმარე ფუნქცია: ფერის "გასუფთავება"
const formatColorName = (slug: string) => {
    if (!slug) return '';
    // 1. ჯერ ვეძებთ ლექსიკონში (yavisferi -> ყავისფერი)
    if (slugToNameMap[slug]) return slugToNameMap[slug];

    // 2. თუ სლაგი შეიცავს -en, -ru ან -ge-ს, ვასუფთავებთ
    if (slug.includes('-en') || slug.includes('-ru') || slug.includes('-ge')) {
        let clean = slug.replace(/-en|-ru|-ge/g, '');
        clean = clean.replace(/-/g, ' ').replace(/_/g, ' ');
        return clean.charAt(0).toUpperCase() + clean.slice(1);
    }

    // 3. თუ არაფერი ემთხვევა, ვაბრუნებთ ორიგინალს
    return slug;
};

export default function ProductInfo({ product, locale = 'ka' }: ProductInfoProps) {
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [mounted, setMounted] = useState(false);
    const [isDescOpen, setIsDescOpen] = useState(false);
    const t = useTranslations('Product');

    const router = useRouter();
    const addItem = useCartStore((state) => state.addItem);
    const { toggleItem, isInWishlist } = useWishlistStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    const attributes = product.attributes?.nodes || [];

    const colorAttribute = attributes.find(attr =>
        attr.name.toLowerCase().includes('color') ||
        attr.name.toLowerCase().includes('pa_color') ||
        attr.name.includes('ფერი')
    );

    // ✅ 1. ფერების ოფციების მომზადება
    // ვტოვებთ სლაგს VALUE-ში, რომ ფუნქციონალმა იმუშაოს!
    const colorOptions = useMemo(() => {
        if (!colorAttribute) return [];
        if (colorAttribute.terms?.nodes?.length) {
            return colorAttribute.terms.nodes.map(term => ({
                name: term.name,
                slug: term.slug,
                value: term.slug // <--- ეს არ შემიცვლია, რადგან თქვით რომ ლოგიკა მუშაობს
            }));
        }
        return colorAttribute.options?.map(opt => ({
            name: opt,
            slug: opt,
            value: opt
        })) || [];
    }, [colorAttribute]);

    // ✅ 2. საწყისი ინიციალიზაცია
    useEffect(() => {
        if (colorOptions.length > 0 && !selectedColor) {
            setSelectedColor(colorOptions[0].value);
        }
    }, [colorOptions, selectedColor]);

    const technicalAttributes = attributes.filter(attr => attr !== colorAttribute);

    // ✅ 3. ვარიაციის პოვნა (ორიგინალი ლოგიკა)
    const selectedVariation = useMemo(() => {
        if (!product.variations || !selectedColor) return null;
        return product.variations.nodes.find((variation) => {
            return variation.attributes?.nodes.some(attr =>
                (attr.name.includes('color') || attr.name.includes('ფერი')) && attr.value === selectedColor
            );
        });
    }, [product.variations, selectedColor]);

    // ✅ 4. Display-სთვის სახელის "გალამაზება"
    const displayColorName = useMemo(() => {
        if (!selectedColor) return null;

        const option = colorOptions.find(c => c.value === selectedColor);

        // აქ ხდება მაგია: formatColorName გადააქცევს "yavisferi"-ს "ყავისფერი"-დ
        if (option) {
            return formatColorName(selectedColor);
        }
        return selectedColor;
    }, [colorOptions, selectedColor]);

    const safeSelectedColorName = displayColorName || undefined;

    const displayPrice = selectedVariation?.price || product.price;
    const regularPrice = selectedVariation?.regularPrice || product.regularPrice;
    const isSale = selectedVariation?.salePrice || product.salePrice;
    const displayImage = selectedVariation?.image?.sourceUrl || product.image?.sourceUrl || '/placeholder.jpg';
    const displayStock = selectedVariation?.stockStatus || product.stockStatus;
    const displayStockQuantity = selectedVariation?.stockQuantity || product.stockQuantity;

    const displaySku = selectedVariation
        ? (selectedVariation.sku || undefined)
        : product.sku;

    const isProductOutOfStock = displayStock !== 'IN_STOCK' || (displayStockQuantity !== undefined && displayStockQuantity === 0);

    useEffect(() => {
        if (isProductOutOfStock) {
            setQuantity(0);
        } else {
            if (quantity === 0) setQuantity(1);
        }
    }, [isProductOutOfStock, quantity]);

    useEffect(() => {
        if (displayStockQuantity !== undefined && displayStockQuantity > 0 && quantity > displayStockQuantity) {
            setQuantity(displayStockQuantity);
        }
    }, [displayStockQuantity, quantity]);

    // კალათისთვისაც ლამაზი სახელი გავატანოთ
    const finalSelectedOptions: Record<string, string> | undefined = safeSelectedColorName
        ? { Color: safeSelectedColorName }
        : undefined;

    const itemBase: Omit<CartItem, 'quantity'> = {
        id: selectedVariation ? selectedVariation.databaseId : product.databaseId,
        name: selectedVariation
            ? `${product.name}${safeSelectedColorName ? ` - ${safeSelectedColorName}` : ''}`
            : product.name,
        price: displayPrice || '0 ₾',
        image: displayImage || '/placeholder.jpg',
        slug: product.slug,
        stockQuantity: displayStockQuantity,
        selectedOptions: finalSelectedOptions,
        sku: displaySku,
    };

    const cartDataForButton = { ...itemBase, quantity };

    const isValidSelection = !product.variations || !!selectedVariation;
    const isBuyNowDisabled = !isValidSelection || isProductOutOfStock || quantity === 0;

    const handleBuyNow = () => {
        if (!isBuyNowDisabled) {
            for (let i = 0; i < quantity; i++) {
                addItem(itemBase);
            }
            router.push('/checkout');
        }
    };

    const handleWishlist = () => {
        toggleItem({
            id: product.databaseId,
            name: product.name,
            price: product.price || '0 ₾',
            salePrice: product.salePrice,
            regularPrice: product.regularPrice,
            image: product.image?.sourceUrl || '/placeholder.jpg',
            slug: product.slug,
            stockQuantity: product.stockQuantity
        });
    };

    const isLiked = mounted ? isInWishlist(product.databaseId) : false;

    // ფერების რუკა (ფონისთვის)
    const colorMap: Record<string, string> = {
        'shavi': '#000000', 'black-en': '#000000', 'chernyj-ru': '#000000', 'შავი': '#000000',
        'tetri': '#FFFFFF', 'white-en': '#FFFFFF', 'belyj-ru': '#FFFFFF', 'თეთრი': '#FFFFFF',
        'lurji': '#2563EB', 'blue-en': '#2563EB', 'sinij-ru': '#2563EB', 'ლურჯი': '#2563EB',
        'tsiteli': '#DC2626', 'red-en': '#DC2626', 'krasnyj-ru': '#DC2626', 'წითელი': '#DC2626',
        'beji': '#F5F5DC', 'beige-en': '#F5F5DC', 'bezhevyj-ru': '#F5F5DC', 'bejevi': '#F5F5DC', 'ბეჟი': '#F5F5DC',
        'cream-en': '#FFFDD0',
        'yavisferi': '#8B4513', 'brown-en': '#8B4513', 'korichnevyj-ru': '#8B4513', 'ყავისფერი': '#8B4513',
        'vardisferi': '#DB2777', 'pink-en': '#DB2777', 'rozovyj-ru': '#DB2777', 'ვარდისფერი': '#DB2777',
        'mwvane': '#16A34A', 'green-en': '#16A34A', 'zelenyj-ru': '#16A34A', 'მწვანე': '#16A34A',
        'stafilosferi': '#F97316', 'orange-en': '#F97316', 'oranzhevyj-ru': '#F97316', 'ნარინჯისფერი': '#F97316',
        'yviteli': '#FACC15', 'yellow-en': '#FACC15', 'zheltyj-ru': '#FACC15', 'ყვითელი': '#FACC15',
        'rcuxi': '#9CA3AF', 'nacrisferi': '#9CA3AF', 'grey-en': '#9CA3AF', 'seryj-ru': '#9CA3AF', 'რუხი': '#9CA3AF',
        'cisferi': '#60A5FA', 'light-blue-en': '#60A5FA', 'goluboj-ru': '#60A5FA', 'ცისფერი': '#60A5FA',
        'muqi_lurji': '#1E3A8A', 'dark-blue-en': '#1E3A8A', 'temno-sinij-ru': '#1E3A8A', 'მუქი ლურჯი': '#1E3A8A',
        'vercxlisferi': '#C0C0C0', 'silver-en': '#C0C0C0', 'serebristyj-ru': '#C0C0C0',
        'oqrosferi': '#FFD700', 'gold-en': '#FFD700', 'zolotistyj-ru': '#FFD700',
        'iasamnisferi': '#A855F7', 'purple-en': '#A855F7', 'fioletovyj-ru': '#A855F7',
        'kanisferi': '#FFE4C4', 'nude-en': '#FFE4C4', 'telesnyj-ru': '#FFE4C4',
        'vardisferi_(pradas_stili)': '#DB2777', 'ვარდისფერი (პრადა)': '#DB2777'
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 animate-fade-in pb-10">

            <div className="lg:col-span-6 h-min lg:sticky lg:top-32 z-10">
                <ProductGallery
                    mainImage={displayImage}
                    gallery={product.galleryImages?.nodes.map(img => img.sourceUrl) || []}
                    alt={product.name}
                />
            </div>

            <div className="lg:col-span-6 flex flex-col py-2">

                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-brand-dark transition cursor-pointer">
                            {product.productCategories?.nodes[0]?.name || 'Collection'}
                        </span>
                        {displaySku && (
                            <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider">
                                SKU: {displaySku}
                            </span>
                        )}
                    </div>

                    {isProductOutOfStock ? (
                        <span className="flex items-center gap-1.5 text-red-500 text-[10px] font-bold uppercase bg-red-50 px-2 py-1 rounded-full">
                            <AlertCircle className="w-3 h-3" /> {t('outOfStock')}
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 text-green-600 text-[10px] font-bold uppercase bg-green-50 px-2 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> {t('inStock')}
                        </span>
                    )}
                </div>

                <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark leading-tight mb-3 tracking-tight">
                    {product.name}
                </h1>

                <div className="flex items-center gap-2 mb-6">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                </div>

                <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{t('priceLabel')}</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl lg:text-3xl font-serif font-black text-brand-dark">
                                {displayPrice?.includes('₾') ? displayPrice : `${displayPrice} ₾`}
                            </span>
                            {regularPrice && isSale && (
                                <span className="text-xs text-gray-400 line-through decoration-red-400 decoration-1">
                                    {regularPrice}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {!isProductOutOfStock && (
                            <button
                                onClick={handleBuyNow}
                                disabled={isBuyNowDisabled}
                                className="flex-1 sm:flex-none bg-black text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-brand-DEFAULT transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap h-12 cursor-pointer"
                            >
                                <CreditCard className="w-4 h-4" /> {t('buyNow')}
                            </button>
                        )}

                        <button
                            onClick={handleWishlist}
                            className={`h-12 w-12 flex items-center justify-center border rounded-xl transition shadow-sm group active:scale-90 cursor-pointer ${isLiked
                                    ? 'bg-red-50 border-red-200 text-red-500'
                                    : 'bg-white border-gray-200 hover:border-red-200 hover:text-red-500'
                                }`}
                        >
                            <Heart className={`w-5 h-5 group-hover:scale-110 transition-transform ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                </div>

                {colorOptions.length > 0 && (
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                                {/* ✅ აქ გამოჩნდება გასუფთავებული სახელი (მაგ. yavisferi -> ყავისფერი) */}
                                {t('color')}: <span className="text-gray-500 font-normal capitalize">{displayColorName}</span>
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {colorOptions.map((option) => {
                                const isSelected = selectedColor === option.value;
                                const bg = colorMap[option.slug.toLowerCase().replace(/\s+/g, '_')] || '#E5E7EB';
                                // Tooltip-ისთვისაც გავასუფთაოთ
                                const tooltipName = formatColorName(option.value);

                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => setSelectedColor(option.value)}
                                        className={`
                                    w-10 h-10 rounded-full shadow-sm transition-all duration-300 relative cursor-pointer
                                    ${isSelected
                                                ? 'ring-2 ring-offset-2 ring-brand-dark scale-110'
                                                : 'hover:scale-105 border border-gray-200'
                                            }
                                `}
                                        style={{ backgroundColor: bg }}
                                        title={tooltipName}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="flex gap-3 mb-8 pb-4">
                    <div className="flex items-center bg-white rounded-xl h-14 border border-gray-200 w-32 shadow-sm">
                        <button
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            disabled={isProductOutOfStock || quantity <= 1}
                            className="w-10 h-full flex items-center justify-center hover:text-brand-DEFAULT transition active:scale-90 text-gray-400 cursor-pointer disabled:opacity-50"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="flex-1 text-center font-bold text-lg text-brand-dark">
                            {isProductOutOfStock ? 0 : (quantity || 1)}
                        </span>
                        <button
                            onClick={() => setQuantity(q => q + 1)}
                            disabled={isProductOutOfStock || (displayStockQuantity !== undefined && quantity >= displayStockQuantity)}
                            className="w-10 h-full flex items-center justify-center hover:text-brand-DEFAULT transition active:scale-90 text-gray-400 cursor-pointer disabled:opacity-50"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1">
                        <AddToCartButton
                            product={cartDataForButton}
                            stockStatus={displayStock}
                            disabled={!isValidSelection}
                        />
                    </div>
                </div>

                {/* Payment Blocks */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-8">
                    <div className="col-span-2 border border-brand-light bg-brand-light/30 rounded-2xl p-2 md:p-3 flex flex-col items-center text-center justify-center transition-all hover:shadow-md hover:border-brand-medium h-full min-h-[110px]">
                        <span className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">{t('Payment.onlineTitle')}</span>
                        <div className="flex items-center justify-center gap-4 mb-2">
                            <LogoBOG />
                            <LogoTBC />
                            <LogoVisa />
                            <LogoMastercard />
                        </div>
                        <div className="text-[8px] md:text-[9px] text-brand-DEFAULT font-bold bg-white px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                            {t('Payment.onlineTime')}
                        </div>
                    </div>

                    <div className="col-span-1 border border-gray-100 bg-gray-50 rounded-2xl p-2 md:p-3 flex flex-col items-center text-center justify-center transition-all hover:shadow-md hover:border-gray-200 h-full min-h-[110px]">
                        <span className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">გადარიცხვა</span>
                        <div className="mb-2 text-gray-600">
                            <Landmark className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="text-[8px] md:text-[9px] text-gray-500 font-medium leading-tight">
                            გადახდა საბანკო<br />გადარიცხვით
                        </div>
                    </div>

                    <div className="col-span-1 border border-gray-100 bg-gray-50 rounded-2xl p-2 md:p-3 flex flex-col items-center text-center justify-center transition-all hover:shadow-md hover:border-gray-200 cursor-default h-full min-h-[110px]">
                        <span className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">რეალური ფოტოები</span>
                        <div className="mb-2 text-brand-DEFAULT">
                            <Camera className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="text-[8px] md:text-[9px] text-gray-500 font-medium leading-tight">
                            პროდუქცია 100%-ით<br />შეესაბამება ფოტოებს
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 my-6"></div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-brand-light transition-colors">
                            <div className="bg-brand-light text-brand-DEFAULT p-3 rounded-full flex-shrink-0"><Truck className="w-5 h-5" /></div>
                            <div>
                                <h4 className="font-bold text-brand-dark text-sm mb-1">{t('Services.deliveryTitle')}</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    {t('Services.deliveryDesc')}<br />
                                    <span className="text-brand-DEFAULT font-bold">{t('Services.freeShipping')}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-100 transition-colors">
                            <div className="bg-blue-50 text-blue-600 p-3 rounded-full flex-shrink-0"><Eye className="w-5 h-5" /></div>
                            <div>
                                <h4 className="font-bold text-brand-dark text-sm mb-1">{t('Services.checkTitle')}</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    {t('Services.checkDesc')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {technicalAttributes.length > 0 && (
                        <div className="bg-white rounded-2xl p-1">
                            <h4 className="font-bold text-brand-dark mb-4 text-xs uppercase tracking-widest flex items-center gap-2 opacity-60">
                                <Layers className="w-4 h-4" /> დეტალური მახასიათებლები
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                {technicalAttributes.map((attr) => {
                                    const label = attr.label || attr.name;
                                    const value = attr.terms?.nodes?.length
                                        ? attr.terms.nodes.map(t => t.name).join(', ')
                                        : attr.options?.join(', ');

                                    return (
                                        <div key={attr.name} className="bg-gray-50 border border-gray-100 p-3 rounded-xl flex items-start gap-3">
                                            <div className="text-brand-DEFAULT">{getAttributeIcon(attr.name)}</div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[10px] text-gray-400 font-bold uppercase truncate" title={label}>{label}</span>
                                                <span className="text-sm font-bold text-brand-dark truncate">{value}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                        <button
                            onClick={() => setIsDescOpen(!isDescOpen)}
                            className="w-full p-5 flex items-center justify-between font-bold text-brand-dark text-sm uppercase tracking-widest hover:bg-gray-100/50 transition-colors"
                        >
                            <span className="flex items-center gap-2"><Info className="w-4 h-4 opacity-60" /> პროდუქტის აღწერა</span>
                            {isDescOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {isDescOpen && (
                            <div
                                className="px-5 pb-5 text-gray-600 text-sm leading-relaxed animate-slide-down"
                                dangerouslySetInnerHTML={{ __html: product.shortDescription || 'აღწერა არ არის.' }}
                            />
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}