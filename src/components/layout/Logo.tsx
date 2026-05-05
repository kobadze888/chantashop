'use client';

// ვიყენებთ ფარდობით მისამართს კომპილაციის შეცდომის თავიდან ასაცილებლად
import { Link } from '../../navigation';

interface LogoProps {
  onClick?: () => void;
  className?: string;
  variant?: 'dark' | 'light'; // დამატებულია ვარიანტი: შავი ან თეთრი
}

const Logo = ({ onClick, className = "", variant = "dark" }: LogoProps) => {
  // განვიხილავთ "dark" ვარიანტს როგორც ნაგულისხმევს (შავი ტექსტით)
  // ხოლო "light" ვარიანტს ფუტერისთვის (თეთრი ტექსტით)
  const shopTextColor = variant === 'light' ? 'text-white' : 'text-black';

  return (
    <>
      {/* ვტვირთავთ შრიფტს პირდაპირ კომპონენტში მაქსიმალური თავსებადობისთვის */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,900;1,6..96,900&display=swap');
        
        .logo-font {
          font-family: 'Bodoni Moda', serif !important;
        }
      ` }} />
      
      <Link 
        href="/" 
        onClick={onClick} 
        className={`cursor-pointer flex items-baseline select-none no-underline logo-font ${className}`}
      >
          {/* Chanta - ვარდისფერი (#db2777) */}
          <span className="text-2xl md:text-3xl font-black text-[#db2777] tracking-tighter leading-none">
              Chanta
          </span>
          
          {/* Shop - ფერი იცვლება variant-ის მიხედვით */}
          <span 
            className={`font-bodoni text-2xl md:text-3xl font-black italic tracking-tighter leading-none ${shopTextColor}`}
            style={{ marginLeft: '-0.15em' }}
          >
              Shop
          </span> 

          {/* .ge - ვარდისფერი (#db2777) */}
          <span 
            className="font-sans text-[10px] md:text-xs font-black text-[#db2777] leading-none"
            style={{ marginLeft: '0px' }}
          >
              .ge
          </span>
      </Link>
    </>
  );
};

export default Logo;