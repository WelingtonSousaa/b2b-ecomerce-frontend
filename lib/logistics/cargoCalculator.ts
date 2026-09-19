import { CargoItemDimensions, PalletSimulationResult } from '@/types/b2b';

// constantes do palete padrao brasileiro (pbr)
export const PALLET_PBR_SPECS = {
  widthCm: 100,
  lengthCm: 120,
  maxHeightCm: 145,
  maxVolumeM3: 1.74,
  maxWeightKg: 1000,
};

export interface CartCargoItem {
  id: string;
  name: string;
  quantity: number;
  dimensions?: CargoItemDimensions;
}

// dimensoes padrao para produtos de tecnologia e eletronicos b2b
export const DEFAULT_PRODUCT_DIMENSIONS: Record<string, CargoItemDimensions> = {
  c1: { widthCm: 25, heightCm: 12, lengthCm: 28, weightKg: 1.2 },
  c2: { widthCm: 18, heightCm: 10, lengthCm: 22, weightKg: 0.45 },
  notebook: { widthCm: 32, heightCm: 8, lengthCm: 45, weightKg: 2.8 },
  servidor: { widthCm: 48, heightCm: 15, lengthCm: 75, weightKg: 18.5 },
  default: { widthCm: 20, heightCm: 15, lengthCm: 25, weightKg: 1.0 },
};

// calculo de volume cubico em metros cubicos por item
export function calculateItemVolumeM3(dim: CargoItemDimensions, quantity: number): number {
  const volumeCm3 = dim.widthCm * dim.heightCm * dim.lengthCm * quantity;
  return Number((volumeCm3 / 1000000).toFixed(4));
}

// calculo de peso total
export function calculateItemWeightKg(dim: CargoItemDimensions, quantity: number): number {
  return Number((dim.weightKg * quantity).toFixed(2));
}

// simulador principal de ocupacao e eficiencia de frete cif
export function calculatePalletOccupancy(items: CartCargoItem[]): PalletSimulationResult {
  let totalVolumeM3 = 0;
  let totalWeightKg = 0;

  // somatorio de volume e peso dos itens
  items.forEach((item) => {
    const dim = item.dimensions || DEFAULT_PRODUCT_DIMENSIONS[item.id] || DEFAULT_PRODUCT_DIMENSIONS.default;
    totalVolumeM3 += calculateItemVolumeM3(dim, item.quantity);
    totalWeightKg += calculateItemWeightKg(dim, item.quantity);
  });

  totalVolumeM3 = Number(totalVolumeM3.toFixed(3));
  totalWeightKg = Number(totalWeightKg.toFixed(2));

  // percentuais de ocupacao em relacao a um palete pbr
  const volumeOccupancyPercent = Number(
    ((totalVolumeM3 / PALLET_PBR_SPECS.maxVolumeM3) * 100).toFixed(1)
  );
  const weightOccupancyPercent = Number(
    ((totalWeightKg / PALLET_PBR_SPECS.maxWeightKg) * 100).toFixed(1)
  );

  // fator determinante (volume ou peso)
  const limitingFactor = volumeOccupancyPercent >= weightOccupancyPercent ? 'VOLUME' : 'WEIGHT';
  const overallOccupancyPercent = Math.max(volumeOccupancyPercent, weightOccupancyPercent);

  // quantidade de paletes necessarios
  const palletsNeeded = Math.max(1, Math.ceil(overallOccupancyPercent / 100));

  // classificacao de eficiencia de frete
  let freightEfficiencyStatus: 'UNDERUTILIZED' | 'GOOD' | 'OPTIMAL' | 'OVERLOAD';
  if (overallOccupancyPercent < 55) {
    freightEfficiencyStatus = 'UNDERUTILIZED';
  } else if (overallOccupancyPercent < 85) {
    freightEfficiencyStatus = 'GOOD';
  } else if (overallOccupancyPercent <= 100) {
    freightEfficiencyStatus = 'OPTIMAL';
  } else {
    freightEfficiencyStatus = 'OVERLOAD';
  }

  // estimativa de quantas unidades do item principal faltam para preencher o palete
  let recommendedUnitsToFillPallet = 0;
  if (items.length > 0 && overallOccupancyPercent < 100) {
    const primaryItem = items[0];
    const dim = primaryItem.dimensions || DEFAULT_PRODUCT_DIMENSIONS[primaryItem.id] || DEFAULT_PRODUCT_DIMENSIONS.default;
    const unitVolume = calculateItemVolumeM3(dim, 1);
    const unitWeight = calculateItemWeightKg(dim, 1);

    const remainingVolume = Math.max(0, PALLET_PBR_SPECS.maxVolumeM3 - totalVolumeM3);
    const remainingWeight = Math.max(0, PALLET_PBR_SPECS.maxWeightKg - totalWeightKg);

    const unitsByVol = Math.floor(remainingVolume / unitVolume);
    const unitsByWeight = Math.floor(remainingWeight / unitWeight);
    recommendedUnitsToFillPallet = Math.max(1, Math.min(unitsByVol, unitsByWeight));
  }

  // estimativa de economia percentual no custo unitario de frete cif
  const freightSavingsEstimated = overallOccupancyPercent >= 80 
    ? Math.min(22, Number(((overallOccupancyPercent / 100) * 20).toFixed(1))) 
    : 0;

  return {
    totalWeightKg,
    totalVolumeM3,
    palletCapacityM3: PALLET_PBR_SPECS.maxVolumeM3,
    palletMaxWeightKg: PALLET_PBR_SPECS.maxWeightKg,
    volumeOccupancyPercent,
    weightOccupancyPercent,
    overallOccupancyPercent,
    limitingFactor,
    palletsNeeded,
    freightEfficiencyStatus,
    recommendedUnitsToFillPallet,
    freightSavingsEstimated,
  };
}
