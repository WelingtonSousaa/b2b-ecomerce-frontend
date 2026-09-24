/**
 * Tipos e Interfaces do Sistema E-Commerce B2B (Shopcart)
 * Define as estruturas de dados para Clientes, Produtos, Estoques, Impostos, Carrinho, Checkout e Pedidos.
 */

// ==========================================
// 1. GESTÃO DE CLIENTES E EMPRESAS B2B
// ==========================================

export type TaxRegime = 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';

export type CompanyStatus = 'PENDING_ANALYSIS' | 'APPROVED' | 'REJECTED' | 'BLOCKED';

export interface CompanyAddress {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  pais: string;
}

export interface CompanyAccount {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  logoUrl?: string;
  industrySegment?: string;
  inscricaoEstadual: string;
  inscricaoMunicipal?: string;
  regimeTributario: TaxRegime;
  suframaCode?: string;
  hasSuframaIncentive: boolean;
  status: CompanyStatus;
  creditLimitTotal: number;
  creditLimitAvailable: number;
  mainAddress: CompanyAddress;
  branches: Branch[];
}

export interface Branch {
  id: string;
  cnpj: string;
  nomeFilial: string;
  inscricaoEstadual?: string;
  address: CompanyAddress;
}


export interface DistributionCenter {
  id: string;
  name: string;
  uf: string;
  isSuframa?: boolean;
}

export const DEFAULT_DISTRIBUTION_CENTERS: DistributionCenter[] = [
  { id: 'cd-sp', name: 'CD São Paulo (Matriz)', uf: 'SP' },
  { id: 'cd-sc', name: 'CD Santa Catarina (Sul)', uf: 'SC' },
  { id: 'cd-ba', name: 'CD Bahia (Nordeste)', uf: 'BA' },
  { id: 'cd-am', name: 'CD Manaus (SUFRAMA)', uf: 'AM', isSuframa: true },
];

export type UserRole = 'BUYER' | 'APPROVER' | 'ADMIN';

export interface CompanyUser {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: UserRole;
  spendingLimitPerOrder?: number;
  isActive: boolean;
}

// ==========================================
// 2. CATÁLOGO, PRODUTOS E ESTOQUE MULTI-CD
// ==========================================

export type UOM = 'UN' | 'CX' | 'FARDO' | 'PALLETE';

export interface StockByCD {
  cdId: string;
  cdName: string;
  cdStateUF: string;
  availableQuantity: number;
}

export interface VolumeDiscountTier {
  minQuantity: number;
  maxQuantity?: number;
  unitPrice: number;
  discountPercentage: number;
}

export interface ProductVariationAttribute {
  name: string; // ex: "Cor", "Armazenamento", "Voltagem", "Tamanho"
  values: string[]; // ex: ["Preto Titânio", "Branco Polar", "Azul Safira"]
}

export interface ProductVariant {
  id: string;
  sku: string;
  ean: string;
  combination: Record<string, string>; // ex: { "Cor": "Preto", "Armazenamento": "256GB" }
  basePrice: number;
  stockByCD: StockByCD[];
  minStockThreshold?: number;
  image?: string;
  batchNumber?: string;
  expirationDate?: string;
}

export type StockMovementType = 'IN' | 'OUT';
export type StockMovementReason =
  | 'PURCHASE_INVOICE' // Compra / NF de Entrada
  | 'RETURN' // Devolução de Cliente
  | 'INVENTORY_ADJUSTMENT_IN' // Ajuste de Inventário (Sobra)
  | 'SUPPLIER_RESTOCK' // Reposição de Fornecedor
  | 'DAMAGE_LOSS' // Avaria / Quebra / Perda
  | 'DIRECT_SALE' // Venda Balcão / Canal Externo
  | 'SAMPLE_BONUS' // Bonificação / Amostra Comercial
  | 'EXPIRATION' // Validade Vencida / Descarte
  | 'INVENTORY_ADJUSTMENT_OUT'; // Ajuste de Inventário (Falta)

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  variantInfo?: string;
  cdId: string;
  cdName: string;
  type: StockMovementType;
  reason: StockMovementReason;
  reasonLabel: string;
  quantity: number;
  previousStock: number;
  resultingStock: number;
  fiscalDoc?: string;
  batchNumber?: string;
  timestamp: string;
  operator: string;
  notes?: string;
}

export interface Product {
  id: string;
  sku: string;
  ean: string;
  ncm: string;
  name: string;
  description: string;
  categorySlug: string;
  brand: string;
  images: string[];
  basePrice: number;
  moq: number; // Minimum Order Quantity
  uom: UOM;
  itemsPerUom: number;
  stockByCD: StockByCD[];
  volumeDiscounts: VolumeDiscountTier[];
  hasVariants?: boolean;
  attributes?: ProductVariationAttribute[];
  variants?: ProductVariant[];
  batchNumber?: string;
  expirationDate?: string;
}

// ==========================================
// 3. TRIBUTAÇÃO E PRECIFICAÇÃO REGIONAL
// ==========================================

export interface TaxBreakdown {
  icmsRate: number;
  icmsStAmount: number;
  difalAmount: number;
  ipiRate: number;
  ipiAmount: number;
  pisCofinsExempt: boolean;
  isSuframaExempt: boolean;
}

export interface RegionalPrice {
  ufDestination: string;
  basePrice: number;
  taxes: TaxBreakdown;
  finalUnitPrice: number;
}

// ==========================================
// 4. CARRINHO, QUICK ORDER E CSV
// ==========================================

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedUOM: UOM;
  selectedCDId: string;
  unitPrice: number;
  subtotal: number;
  taxBreakdown: TaxBreakdown;
}

export interface CartSummary {
  subtotal: number;
  totalTaxes: number; // ICMS-ST + DIFAL + IPI
  totalFreight: number;
  discountTotal: number;
  grandTotal: number;
  minOrderValueThreshold: number;
  isMinOrderMet: boolean;
  remainingForMinOrder: number;
}

export type CSVImportRowStatus = 'VALID' | 'SKU_NOT_FOUND' | 'OUT_OF_STOCK' | 'BELOW_MOQ';

export interface CSVImportRowResult {
  rowNumber: number;
  rawSku: string;
  rawQuantity: number;
  product?: Product;
  status: CSVImportRowStatus;
  errorMessage?: string;
}

// ==========================================
// 5. CHECKOUT, FRETE E PAGAMENTO HÍBRIDO
// ==========================================

// dimensoes fisicas de mercadoria para calculo de cubagem
export interface CargoItemDimensions {
  widthCm: number;
  heightCm: number;
  lengthCm: number;
  weightKg: number;
}

// resultado consolidado da simulacao de palete
export interface PalletSimulationResult {
  totalWeightKg: number;
  totalVolumeM3: number;
  palletCapacityM3: number;
  palletMaxWeightKg: number;
  volumeOccupancyPercent: number;
  weightOccupancyPercent: number;
  overallOccupancyPercent: number;
  limitingFactor: 'VOLUME' | 'WEIGHT';
  palletsNeeded: number;
  freightEfficiencyStatus: 'UNDERUTILIZED' | 'GOOD' | 'OPTIMAL' | 'OVERLOAD';
  recommendedUnitsToFillPallet: number;
  freightSavingsEstimated: number;
}

export type FreightType = 'CIF' | 'FOB' | 'PICKUP';

export interface FreightOption {
  type: FreightType;
  carrierName?: string;
  carrierCNPJ?: string;
  contractNumber?: string;
  price: number;
  estimatedDeliveryDays: number;
}

export type PaymentType = 'BOLETO_FATURADO' | 'HYBRID' | 'PIX' | 'CREDIT_CARD';

export interface PaymentDetails {
  type: PaymentType;
  installmentsCount?: number;
  termsDays?: number[]; // Ex: [28, 56, 84]
  creditLimitUsed?: number;
  remainingBalancePaymentMethod?: 'PIX' | 'CREDIT_CARD';
  remainingBalanceAmount?: number;
}

// ==========================================
// 6. PEDIDOS, FATURAMENTO E BOLETOS
// ==========================================

export type OrderStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderB2B {
  id: string;
  orderNumber: string;
  createdAt: string;
  companyId: string;
  createdByUserId: string;
  requiresManagerApproval: boolean;
  status: OrderStatus;
  items: CartItem[];
  shippingAddress: CompanyAddress;
  freight: FreightOption;
  payment: PaymentDetails;
  summary: CartSummary;
  nfeKey?: string;
  danfePdfUrl?: string;
  xmlUrl?: string;
}

export interface InvoiceB2B {
  id: string;
  orderId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  status: 'OPEN' | 'PAID' | 'OVERDUE';
  originalBoletoUrl: string;
  recalculatedBoletoUrl?: string;
  penaltyAndInterestAmount?: number;
}

export interface RFQRequest {
  id: string;
  companyId: string;
  userId: string;
  createdAt: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'PROPOSAL_SENT' | 'REJECTED';
  requestedItems: {
    sku: string;
    quantity: number;
    targetPrice?: number;
  }[];
  comments?: string;
}

// ==========================================
// 7. TABELAS DE PREÇOS NEGOCIADAS (CUSTOM PRICE BOOKS)
// ==========================================

export interface PriceBookItem {
  sku: string;
  productName: string;
  customPrice: number;
  minMoqOverride?: number;
  discountPercentageFromBase: number;
}

export interface PriceBook {
  id: string;
  name: string; // Ex: "Tabela Contrato VIP Ouro", "Tabela Revenda Sudeste", "Tabela Polo Industrial Suframa"
  code: string;
  description: string;
  isActive: boolean;
  validFrom: string;
  validTo: string;
  assignedCnpjs: string[]; // CNPJs autorizados a comprar por esta tabela
  targetRegionUF?: string[]; // UFs aplicáveis
  items: PriceBookItem[];
}

// ==========================================
// 8. LOGÍSTICA REVERSA, GARANTIAS & RMA B2B
// ==========================================

export type RmaReason =
  | 'TRANSPORT_DAMAGE' // Avaria em Transporte
  | 'FACTORY_DEFECT' // Defeito Técnico de Fabricação
  | 'SHIPPING_DIVERGENCE' // Divergência de Quantidade ou SKU
  | 'SHORT_EXPIRATION' // Lote com Validade Curta / Incompatível
  | 'COMMERCIAL_RETURN'; // Devolução Comercial em Acordo

export type RmaStatus =
  | 'REQUESTED' // Aberto / Aguardando Triagem
  | 'INSPECTION_PENDING' // Laudo Técnico Pendente
  | 'APPROVED_SHIPPING' // Aprovado: Código de Postagem Emitido
  | 'RECEIVED_IN_WAREHOUSE' // Recebido no Centro de Distribuição
  | 'CREDIT_ISSUED' // Finalizado: Carta de Crédito / Reembolso
  | 'REJECTED'; // Recusado

export interface RmaItem {
  sku: string;
  productName: string;
  lotNumber: string;
  quantity: number;
  unitPrice: number;
  reason: RmaReason;
  reasonDescription: string;
  evidenceImages: string[];
}

export interface RmaTicket {
  id: string;
  protocolNumber: string; // Ex: RMA-2026-0042
  orderId: string;
  orderNumber: string;
  companyId: string;
  companyName: string;
  cnpj: string;
  cdDestinationId: string;
  cdDestinationName: string;
  status: RmaStatus;
  createdAt: string;
  updatedAt: string;
  items: RmaItem[];
  reverseTrackingCode?: string; // Código Correios / Transportadora Reversa
  reverseDanfeNfeKey?: string; // Chave da NF-e de Devolução
  resolutionNotes?: string;
  creditVoucherAmount?: number;
}

// ==========================================
// 9. MULTI-DESTINO / SPLIT DE FILIAIS & ENTREGAS PROGRAMADAS
// ==========================================

export interface BranchDestinationAllocation {
  branchId: string;
  branchCnpj: string;
  branchName: string;
  address: CompanyAddress;
  items: {
    sku: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    regionalTaxes: TaxBreakdown;
    totalAmount: number;
  }[];
  freightCost: number;
  estimatedDays: number;
  subtotal: number;
  totalWithTax: number;
}

export interface ScheduledDeliverySchedule {
  installmentNumber: number;
  deliveryDate: string;
  percentageAllocated: number; // Ex: 50%
  status: 'SCHEDULED' | 'IN_PRODUCTION' | 'DISPATCHED' | 'DELIVERED';
}

// ==========================================
// 10. GESTÃO DE LINHA DE CRÉDITO & SCORING B2B
// ==========================================

export type CreditRequestStatus = 'UNDER_ANALYSIS' | 'APPROVED' | 'MORE_DOCS_NEEDED' | 'REJECTED';

export interface CreditLimitRequest {
  id: string;
  protocol: string;
  companyId: string;
  cnpj: string;
  currentLimit: number;
  requestedLimit: number;
  annualRevenueDeclared: number;
  preferredTerms: string; // Ex: "30/60/90 Dias no Boleto"
  financialContact: string;
  status: CreditRequestStatus;
  scoreGrade: 'AAA' | 'AA' | 'A' | 'BBB' | 'RISK';
  createdAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

// ==========================================
// 11. CENTRAL DE NOTIFICAÇÕES & WEBHOOKS / ERPs
// ==========================================

export type NotificationType =
  | 'ORDER_STATUS'
  | 'APPROVAL_REQUEST'
  | 'CREDIT_LIMIT'
  | 'INVOICE_DUE'
  | 'RMA_UPDATE'
  | 'PRICE_BOOK_UPDATE'
  | 'STOCK_ALERT';

export interface B2BNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ErpIntegration {
  id: string;
  erpName: 'SAP_S4HANA' | 'TOTVS_PROTHEUS' | 'BLING' | 'TINY' | 'OMIE';
  displayName: string;
  status: 'CONNECTED' | 'SYNCING' | 'ERROR' | 'DISCONNECTED';
  lastSyncTimestamp: string;
  syncedOrdersCount: number;
  syncedInvoicesCount: number;
  webhookUrl: string;
}

export interface WebhookLog {
  id: string;
  event: string;
  payloadSummary: string;
  responseStatus: number;
  timestamp: string;
  durationMs: number;
}

// ==========================================
// 12. CONTRATOS DE FORNECIMENTO B2B & ASSINATURA DIGITAL
// ==========================================

export interface ContractSLA {
  minDispatchHours: number; // Ex: 24h ou 48h
  fixedPriceGuaranteeMonths: number; // Ex: 12 meses
  minAnnualVolumeCommitment: number; // Em R$
  rebatePercentageAnnual: number; // Bônus de 2% no atingimento de metas
  penaltyRatePerDayLate: number;
}

export interface SupplyContract {
  id: string;
  contractNumber: string; // Ex: CT-B2B-2026-089
  title: string;
  vendorName: string;
  buyerCompanyName: string;
  buyerCnpj: string;
  priceBookId: string;
  priceBookName: string;
  validFrom: string;
  validTo: string;
  status: 'ACTIVE' | 'PENDING_SIGNATURE' | 'EXPIRED' | 'RENEWAL_UNDER_REVIEW';
  sla: ContractSLA;
  digitalSignature: {
    isSigned: boolean;
    signedBy?: string;
    signedAt?: string;
    certificateIssuer?: string; // Ex: "ICP-Brasil / Certisign Digital"
    documentSha256?: string;
  };
  downloadPdfUrl: string;
}
