export interface KeywordOption {
  id: string;
  name: string;
  tag: string;
  description: string;
  imageUrl: string;
  fallbackColor: string;
}

export const HERO_MOODBOARD_IMAGES = [
  {
    url: "/src/assets/images/travel_mood_ocean_1794379153949.jpg",
    caption: "제주 해안도로",
    tag: "coastal walk",
    aspect: "tall",
  },
  {
    url: "/src/assets/images/travel_mood_alley_1794379154303.jpg",
    caption: "교토 전통 골목길",
    tag: "hidden alley",
    aspect: "normal",
  },
  {
    url: "/src/assets/images/travel_mood_europe_1794379154453.jpg",
    caption: "남유럽 노천 카페",
    tag: "golden hour",
    aspect: "normal",
  },
  {
    url: "/src/assets/images/travel_mood_cafe_1794379155048.jpg",
    caption: "여행자 아침 카페",
    tag: "morning coffee",
    aspect: "tall",
  },
];

export const TRAVEL_KEYWORDS: KeywordOption[] = [
  {
    id: "gourmet",
    name: "맛집",
    tag: "#맛집",
    description: "로컬 숨은 식당 & 미식 탐방",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    fallbackColor: "#E2DCD5",
  },
  {
    id: "cafe",
    name: "카페",
    tag: "#카페",
    description: "감성 인테리어 & 핸드드립 커피",
    imageUrl: "/src/assets/images/travel_mood_cafe_1794379155048.jpg",
    fallbackColor: "#DFD8D0",
  },
  {
    id: "shopping",
    name: "쇼핑",
    tag: "#쇼핑",
    description: "편집숍, 빈티지 마켓 & 기념품",
    imageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=400&q=80",
    fallbackColor: "#DED6CE",
  },
  {
    id: "history",
    name: "유적지",
    tag: "#유적지",
    description: "세계문화유산 & 고즈넉한 옛 거리",
    imageUrl: "/src/assets/images/travel_mood_alley_1794379154303.jpg",
    fallbackColor: "#D9D2CA",
  },
  {
    id: "healing",
    name: "힐링",
    tag: "#힐링",
    description: "숲길 산책과 조용한 휴식",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
    fallbackColor: "#D0D9D4",
  },
  {
    id: "nature",
    name: "자연",
    tag: "#자연",
    description: "에메랄드 바다 & 초록빛 능선",
    imageUrl: "/src/assets/images/travel_mood_ocean_1794379153949.jpg",
    fallbackColor: "#CCD8CE",
  },
  {
    id: "activity",
    name: "액티비티",
    tag: "#액티비티",
    description: "서핑, 트레킹 & 익스트림 스포츠",
    imageUrl: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=400&q=80",
    fallbackColor: "#D9D4C7",
  },
  {
    id: "nightview",
    name: "야경",
    tag: "#야경",
    description: "도시의 불빛 & 환상적인 전망대",
    imageUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=400&q=80",
    fallbackColor: "#2C3539",
  },
  {
    id: "photospot",
    name: "사진명소",
    tag: "#사진명소",
    description: "인생샷을 남길 수 있는 뷰포인트",
    imageUrl: "/src/assets/images/travel_mood_europe_1794379154453.jpg",
    fallbackColor: "#E0D7D0",
  },
  {
    id: "hotspring",
    name: "온천",
    tag: "#온천",
    description: "노천탕 & 피로를 녹이는 스파",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80",
    fallbackColor: "#DED6CF",
  },
  {
    id: "relaxation",
    name: "휴양",
    tag: "#휴양",
    description: "풀빌라와 프라이빗 비치",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80",
    fallbackColor: "#D8E0DA",
  },
  {
    id: "themepark",
    name: "테마파크",
    tag: "#테마파크",
    description: "유니버설, 디즈니 & 어트랙션",
    imageUrl: "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=400&q=80",
    fallbackColor: "#E4DCD0",
  },
  {
    id: "localexperience",
    name: "현지체험",
    tag: "#현지체험",
    description: "쿠킹클래스, 공예 & 로컬 투어",
    imageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=400&q=80",
    fallbackColor: "#DCD5CD",
  },
];

export const TRAVEL_PURPOSES = [
  "가족여행",
  "커플여행",
  "우정여행",
  "혼자여행",
  "출장+여행",
  "기념일",
  "신혼여행",
];

export const DOMESTIC_REGIONS = [
  "서울특별시",
  "제주특별자치도",
  "부산광역시",
  "강원특별자치도 (강릉/속초)",
  "전라남도 (여수/순천)",
  "전북특별자치도 (전주)",
  "경상북도 (경주/포항)",
  "경상남도 (통영/거제)",
  "경기도 (가평/양평)",
  "인천광역시",
  "충청남도 (태안/보령)",
  "충청북도 (단양/충주)",
  "대전광역시",
  "대구광역시",
  "광주광역시",
  "울산광역시",
  "세종특별자치시",
];

export const DOMESTIC_TRANSPORTS = [
  { id: "car", name: "자가용", icon: "Car" },
  { id: "rental", name: "렌터카", icon: "Key" },
  { id: "ktx", name: "KTX/기차", icon: "Train" },
  { id: "bus", name: "고속버스", icon: "Bus" },
  { id: "flight", name: "국내선 항공", icon: "Plane" },
  { id: "walk", name: "도보/자전거", icon: "Footprints" },
];

export const OVERSEAS_AIRPORTS = [
  "인천국제공항 (ICN)",
  "김포국제공항 (GMP)",
  "김해/부산공항 (PUS)",
  "대구국제공항 (TAE)",
  "청주국제공항 (CJJ)",
  "제주국제공항 (CJU)",
  "무안국제공항 (MWX)",
];

export const OVERSEAS_CONTINENTS = [
  { id: "japan", name: "일본", example: "도쿄, 오사카, 교토, 후쿠오카, 삿포로" },
  { id: "sea", name: "동남아", example: "방콕, 다낭, 발리, 싱가포르, 세부" },
  { id: "tw_cn", name: "중국/대만", example: "타이베이, 상하이, 홍콩, 베이징" },
  { id: "europe", name: "유럽", example: "파리, 로마, 런던, 바르셀로나, 스위스" },
  { id: "americas", name: "미주", example: "뉴욕, LA, 샌프란시스코, 하와이, 밴쿠버" },
  { id: "oceania", name: "대양주", example: "시드니, 멜버른, 괌, 사이판, 뉴질랜드" },
];

export const OVERSEAS_LOCAL_TRANSPORTS = [
  { id: "public", name: "대중교통", icon: "Train" },
  { id: "rental", name: "렌터카", icon: "Car" },
  { id: "taxi", name: "택시/차량공유", icon: "CarTaxiFront" },
  { id: "tourbus", name: "투어버스", icon: "Bus" },
  { id: "walk", name: "도보/자전거", icon: "Footprints" },
];

export const ACCOMMODATION_STYLES = [
  "호텔",
  "리조트",
  "에어비앤비",
  "게스트하우스",
  "료칸/전통숙소",
];
