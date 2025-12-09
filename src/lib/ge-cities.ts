// src/lib/ge-cities.ts

export interface CityEntry {
  ka: string;
  en: string;
  ru: string;
}

export const GEORGIAN_CITIES: CityEntry[] = [
  { ka: "თბილისი", en: "Tbilisi", ru: "Тбилиси" },
  { ka: "ბათუმი", en: "Batumi", ru: "Батуми" },
  { ka: "ქუთაისი", en: "Kutaisi", ru: "Кутаиси" },
  { ka: "რუსთავი", en: "Rustavi", ru: "Рустави" },
  { ka: "გორი", en: "Gori", ru: "Гори" },
  { ka: "ზუგდიდი", en: "Zugdidi", ru: "Зугдиди" },
  { ka: "ფოთი", en: "Poti", ru: "Поти" },
  { ka: "ქობულეთი", en: "Kobuleti", ru: "Кобулети" },
  { ka: "ხაშური", en: "Khashuri", ru: "Хашури" },
  { ka: "სამტრედია", en: "Samtredia", ru: "Самтредиа" },
  { ka: "სენაკი", en: "Senaki", ru: "Сенаки" },
  { ka: "ზესტაფონი", en: "Zestaponi", ru: "Зестафони" },
  { ka: "მარნეული", en: "Marneuli", ru: "Марнеули" },
  { ka: "თელავი", en: "Telavi", ru: "Телави" },
  { ka: "ახალციხე", en: "Akhaltsikhe", ru: "Ахалциხе" },
  { ka: "ოზურგეთი", en: "Ozurgeti", ru: "Озуრгети" },
  { ka: "კასპი", en: "Kaspi", ru: "Каспи" },
  { ka: "ჭიათურა", en: "Chiatura", ru: "Чиатура" },
  { ka: "წყალტუბო", en: "Tskaltubo", ru: "Цхалтубо" },
  { ka: "საგარეჯო", en: "Sagarejo", ru: "Сагареджо" },
  { ka: "გარდაბანი", en: "Gardabani", ru: "Гардабани" },
  { ka: "ბორჯომი", en: "Borjomi", ru: "Боржоми" },
  { ka: "ტყიბული", en: "Tkibuli", ru: "Ткибули" },
  { ka: "ხონი", en: "Khoni", ru: "Хони" },
  { ka: "ბოლნისი", en: "Bolnisi", ru: "Болниси" },
  { ka: "ახალქალაქი", en: "Akhalkalaki", ru: "Ахалкалаки" },
  { ka: "გურჯაანი", en: "Gurjaani", ru: "Гурджаани" },
  { ka: "მცხეთა", en: "Mtskheta", ru: "Мцхета" },
  { ka: "ყვარელი", en: "Kvareli", ru: "Кварели" },
  { ka: "საჩხერე", en: "Sachkhere", ru: "Сачхере" },
  { ka: "დუშეთი", en: "Dusheti", ru: "Душети" },
  { ka: "ქარელი", en: "Kareli", ru: "Карели" },
  { ka: "ლაგოდეხი", en: "Lagodekhi", ru: "Лагодехи" },
  { ka: "დედოფლისწყარო", en: "Dedoplistskaro", ru: "Дедоплисцкаро" },
  { ka: "ადიგენი", en: "Adigeni", ru: "Адигени" },
  { ka: "ახმეტა", en: "Akhmeta", ru: "Ахмета" },
  { ka: "ამბროლაური", en: "Ambrolauri", ru: "Амбролаури" },
  { ka: "ასპინძა", en: "Aspindza", ru: "Аспиндза" },
  { ka: "ბაღდათი", en: "Baghdati", ru: "Багдати" },
  { ka: "ჩოხატაური", en: "Chokhatauri", ru: "Чохатаури" },
  { ka: "დმანისი", en: "Dmanisi", ru: "Дманиси" },
  { ka: "ხობი", en: "Khobi", ru: "Хоби" },
  { ka: "ლანჩხუთი", en: "Lanchkhuti", ru: "Ланчхути" },
  { ka: "ლენტეხი", en: "Lentekhi", ru: "Лентехи" },
  { ka: "მარტვილი", en: "Martvili", ru: "Мартвили" },
  { ka: "მესტია", en: "Mestia", ru: "Местиа" },
  { ka: "ნინოწმინდა", en: "Ninotsminda", ru: "Ниноцминда" },
  { ka: "ონი", en: "Oni", ru: "Они" },
  { ka: "სიღნაღი", en: "Signagi", ru: "Сигнахи" },
  { ka: "თერჯოლა", en: "Terjola", ru: "Тержола" },
  { ka: "თეთრიწყარო", en: "Tetritskaro", ru: "Тетрицкаро" },
  { ka: "თიანეთი", en: "Tianeti", ru: "Тианети" },
  { ka: "ცაგერი", en: "Tsageri", ru: "Цагери" },
  { ka: "წალენჯიხა", en: "Tsalenjikha", ru: "Цаленджиха" },
  { ka: "წალკა", en: "Tsalka", ru: "Цалка" },
  { ka: "ვანი", en: "Vani", ru: "Вани" },
  { ka: "აბაშა", en: "Abasha", ru: "Абаша" },
  { ka: "წნორი", en: "Tsnori", ru: "Цнори" },
  { ka: "ვალე", en: "Vale", ru: "Вале" },
  { ka: "ჯვარი", en: "Jvari", ru: "Джвари" }
];

// აბრუნებს ქალაქების სიას არჩეული ენის მიხედვით
export const getCitiesList = (locale: string) => {
  const langKey = (locale === 'en' || locale === 'ru') ? locale : 'ka';
  return GEORGIAN_CITIES.map(city => city[langKey]).sort();
};

// აბრუნებს დეფოლტ ქალაქს (თბილისს) არჩეულ ენაზე
export const getDefaultCity = (locale: string) => {
  const langKey = (locale === 'en' || locale === 'ru') ? locale : 'ka';
  const tbilisi = GEORGIAN_CITIES.find(c => c.en === 'Tbilisi');
  return tbilisi ? tbilisi[langKey] : 'თბილისი';
};

// ამოწმებს არის თუ არა ქალაქი თბილისი (ნებისმიერ ენაზე)
export const isTbilisi = (city: string) => {
  if (!city) return false;
  
  const normalizedInput = city.toLowerCase().trim();
  const tbilisi = GEORGIAN_CITIES.find(c => c.en === 'Tbilisi');
  
  if (!tbilisi) return false;
  
  return (
    normalizedInput === tbilisi.ka.toLowerCase().trim() ||
    normalizedInput === tbilisi.en.toLowerCase().trim() ||
    normalizedInput === tbilisi.ru.toLowerCase().trim()
  );
};