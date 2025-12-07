import { Instagram, Facebook } from 'lucide-react';
import { Link } from '@/navigation';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white pt-24 pb-12 md:rounded-t-[3rem] mt-auto relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-DEFAULT via-purple-500 to-brand-DEFAULT"></div>
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                <div className="space-y-6">
                    <span className="font-serif text-2xl font-black tracking-tighter italic">Chanta<span className="text-brand-DEFAULT not-italic font-sans">Shop</span>.</span>
                    <p className="text-white/60 text-sm leading-relaxed max-w-xs">პრემიუმ ხარისხის ჩანთები და აქსესუარები. შექმნილია მათთვის, ვინც აფასებს დეტალებს.</p>
                </div>
                <div>
                    <h5 className="font-bold mb-8 text-lg font-serif">ნავიგაცია</h5>
                    <ul className="text-sm text-white/60 space-y-4">
                        <li><Link href="/" className="hover:text-white transition flex items-center gap-2"><span className="w-1 h-1 bg-brand-DEFAULT rounded-full"></span> მთავარი</Link></li>
                        <li><Link href="/collection" className="hover:text-white transition flex items-center gap-2"><span className="w-1 h-1 bg-brand-DEFAULT rounded-full"></span> კოლექცია</Link></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold mb-8 text-lg font-serif">დახმარება</h5>
                    <ul className="text-sm text-white/60 space-y-4">
                        <li className="hover:text-white transition cursor-pointer">მიწოდების პირობები</li>
                        <li className="hover:text-white transition cursor-pointer">დაბრუნების პოლიტიკა</li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold mb-8 text-lg font-serif">გამოგვყევით</h5>
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-brand-DEFAULT hover:border-brand-DEFAULT transition group"><Instagram className="w-5 h-5 group-hover:scale-110 transition" /></div>
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-brand-DEFAULT hover:border-brand-DEFAULT transition group"><Facebook className="w-5 h-5 group-hover:scale-110 transition" /></div>
                    </div>
                </div>
            </div>
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 gap-4">
                <span>&copy; 2025 ChantaShop. ყველა უფლება დაცულია.</span>
            </div>
        </div>
    </footer>
  );
}