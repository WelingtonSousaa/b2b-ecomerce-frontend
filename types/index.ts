export interface AuthUser {
  isLoggedIn: boolean;
  empresa: string;
  cnpj: string;
  limiteCredito: number;
  filialPadrao: string;
}

export interface VolumeDiscount {
  quantidade: number;
  preco: number;
}

export interface ProductPricing {
  padrao: number;
  descontoVolume: VolumeDiscount[];
}

export interface ProductTaxes {
  ipi: number;
  icmsSt: number;
}

export interface Product {
  id: string;
  sku: string;
  nome: string;
  imagem: string;
  categoria: string;
  moq: number;
  multiploVenda: number;
  precos: ProductPricing;
  taxas: ProductTaxes;
}
