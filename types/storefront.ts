export interface StorefrontTheme {
  primaryColor: string;
  accentColor: string;
  bannerBgColor: string;
  borderRadius: string;
}

export interface StorefrontHero {
  headline: string;
  subheadline: string;
  badgeText: string;
  ctaText: string;
  ctaLink: string;
  heroImage: string;
  showBadge: boolean;
}

export interface StorefrontAnnouncement {
  enabled: boolean;
  text: string;
  linkText: string;
  linkUrl: string;
  bgColor: string;
}

export interface StorefrontConfig {
  storeName: string;
  storeSlug: string;
  slogan: string;
  logoUrl: string;
  customDomain?: string;
  theme: StorefrontTheme;
  hero: StorefrontHero;
  announcement: StorefrontAnnouncement;
  featuredProductIds: string[];
  featuredCategorySlugs: string[];
  subscriptionPlan: 'Enterprise Pro' | 'Standard B2B' | 'Brand Official Store';
  allowResellerMobileApp: boolean;
}

export const defaultStorefrontConfig: StorefrontConfig = {
  storeName: 'Shopcart Distribuidora Corporativa',
  storeSlug: 'shopcart-oficial',
  slogan: 'Equipamentos de alta tecnologia e suprimentos corporativos com faturamento direto por CNPJ',
  logoUrl: '',
  customDomain: 'loja.shopcart.com.br',
  subscriptionPlan: 'Brand Official Store',
  allowResellerMobileApp: true,
  theme: {
    primaryColor: '#004e38',
    accentColor: '#10b981',
    bannerBgColor: '#f9ece4',
    borderRadius: 'rounded-3xl',
  },
  hero: {
    headline: 'Ganhe até 50% OFF em Fones Selecionados',
    subheadline: 'Equipamentos de alta performance para empresas, escritórios e operações críticas de TI.',
    badgeText: 'Oferta Especial B2B',
    ctaText: 'Comprar Agora',
    ctaLink: '/produtos',
    heroImage: '/media/hero_woman.jpg',
    showBadge: true,
  },
  announcement: {
    enabled: true,
    text: 'Condições especiais de IPI e ICMS-ST para faturamento via CNPJ de SP, SC e BA.',
    linkText: 'Ver Tabela Fiscal',
    linkUrl: '/conta/analise-tributaria',
    bgColor: '#004e38',
  },
  featuredProductIds: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'],
  featuredCategorySlugs: ['moveis-escritorio', 'fones-audio', 'computadores-ti', 'redes-servidores', 'seguranca-cftv', 'impressao-suprimentos'],
};
