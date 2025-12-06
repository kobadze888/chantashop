import { useLocale } from 'next-intl';
import { Link } from '@/navigation';
import { getMenu } from '@/lib/api';

// Define the Menu item structure
interface MenuItem {
    id: string;
    label: string;
    uri: string;
    connectedObject: {
        __typename: string;
        slug: string;
    } | null;
}

interface MenuDynamicProps {
    location: "PRIMARY_MENU" | "MOBILE_MENU"; // Menu location in WP
    mobileClose?: () => void; // Function to close mobile menu
}

// Server Component to fetch the menu data
export default async function MenuDynamic({ location, mobileClose }: MenuDynamicProps) {
    const locale = useLocale();
    // Fetch menu data from WP, filtered by language
    const menuItems: MenuItem[] = await getMenu(location, locale);

    if (!menuItems || menuItems.length === 0) {
        return (
            <div className={`text-sm ${location === 'MOBILE_MENU' ? 'text-mocha-medium' : 'text-mocha-dark/70'}`}>
                მენიუ არ არის კონფიგურირებული WP-ში.
            </div>
        );
    }

    return (
        <>
            {menuItems.map((item) => {
                let href = item.uri;
                
                // Construct internal Next.js/next-intl path from connected object slugs
                if (item.connectedObject?.slug) {
                    switch (item.connectedObject.__typename) {
                        case 'Page':
                            href = `/${item.connectedObject.slug}`;
                            break;
                        case 'ProductCategory':
                            href = `/shop/${item.connectedObject.slug}`;
                            break;
                        default:
                            // Fallback to URI for external links or custom links
                            href = item.uri;
                            break;
                    }
                }

                // Mobile menu layout
                if (location === 'MOBILE_MENU') {
                    return (
                        <Link 
                            key={item.id} 
                            href={href} 
                            className="block border-b border-mocha-medium/30 pb-2 hover:text-mocha-DEFAULT transition"
                            onClick={mobileClose}
                        >
                            {item.label}
                        </Link>
                    );
                }

                // Desktop Menu layout
                return (
                    <Link 
                        key={item.id} 
                        href={href} 
                        className="hover:text-mocha-DEFAULT transition duration-300"
                    >
                        {item.label}
                    </Link>
                );
            })}
        </>
    );
}