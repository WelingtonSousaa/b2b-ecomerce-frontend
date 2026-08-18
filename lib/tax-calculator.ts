import { Product, TaxBreakdown, CompanyAccount } from '@/types/b2b';

/**
 * Calculadora de Tributos e Alíquotas B2B (ICMS-ST, DIFAL, IPI e SUFRAMA)
 */
export function calculateItemTaxes(
  product: Product,
  quantity: number,
  company: CompanyAccount,
  ufDestination: string
): TaxBreakdown {
  const itemSubtotal = product.basePrice * quantity;
  const isZFM = company.hasSuframaIncentive && (ufDestination === 'AM' || ufDestination === 'RR' || ufDestination === 'AP');

  // Se for Zona Franca de Manaus (SUFRAMA) ativada, ha isencao de IPI e ICMS
  if (isZFM) {
    return {
      icmsRate: 0,
      icmsStAmount: 0,
      difalAmount: 0,
      ipiRate: 0,
      ipiAmount: 0,
      pisCofinsExempt: true,
      isSuframaExempt: true,
    };
  }

  // Regra geral de alíquota interna vs interestadual
  const isInterstate = ufDestination !== 'SP'; // SP é o CD de origem principal
  const icmsRate = isInterstate ? 12 : 18;
  const ipiRate = 5.0; // 5% de IPI para produtos eletrônicos
  const ipiAmount = (itemSubtotal * ipiRate) / 100;

  // Cálculo de Substituição Tributária (ICMS-ST) simulado com MVA de 35%
  let icmsStAmount = 0;
  let difalAmount = 0;

  if (isInterstate) {
    // DIFAL para consumidor final / contribuinte ICMS
    difalAmount = (itemSubtotal * 6) / 100; // DIFAL 6%
  } else {
    // ST interno
    const mva = 0.35;
    const baseCalculoST = (itemSubtotal + ipiAmount) * (1 + mva);
    icmsStAmount = (baseCalculoST * 0.18) - (itemSubtotal * 0.18);
  }

  return {
    icmsRate,
    icmsStAmount: Math.max(0, Number(icmsStAmount.toFixed(2))),
    difalAmount: Math.max(0, Number(difalAmount.toFixed(2))),
    ipiRate,
    ipiAmount: Number(ipiAmount.toFixed(2)),
    pisCofinsExempt: false,
    isSuframaExempt: false,
  };
}
