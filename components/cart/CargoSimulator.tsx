'use client';

import React, { useState } from 'react';
import {
  Truck,
  Package,
  Layers,
  Sparkles,
  TrendingUp,
  Info,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  PlusCircle
} from 'lucide-react';
import { calculatePalletOccupancy, CartCargoItem, PALLET_PBR_SPECS } from '@/lib/logistics/cargoCalculator';

interface CargoSimulatorProps {
  items: CartCargoItem[];
  onFillPallet?: (quantityToAdd: number) => void;
  compact?: boolean;
}

// componente visual de simulacao de cubagem e ocupacao de palete b2b
export default function CargoSimulator({ items, onFillPallet, compact = false }: CargoSimulatorProps) {
  const [showSpecs, setShowSpecs] = useState(false);

  // calculo de métricas em tempo real
  const sim = calculatePalletOccupancy(items);

  // configuracao visual de status
  const getStatusBadge = () => {
    switch (sim.freightEfficiencyStatus) {
      case 'OPTIMAL':
        return {
          label: 'Frete CIF Otimizado',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          barColor: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          message: `Palete com ${sim.overallOccupancyPercent}% de aproveitamento. Excelente eficiência logística! Economia estimada de até ${sim.freightSavingsEstimated}% no custo por unidade.`
        };
      case 'GOOD':
        return {
          label: 'Boa Ocupação',
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          barColor: 'bg-blue-600',
          icon: <TrendingUp className="w-3.5 h-3.5 text-blue-600" />,
          message: `Ocupação em ${sim.overallOccupancyPercent}%. Quase na faixa ideal para máxima diluição de frete.`
        };
      case 'UNDERUTILIZED':
        return {
          label: 'Espaço Ocioso no Palete',
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          barColor: 'bg-amber-500',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
          message: `Apenas ${sim.overallOccupancyPercent}% do palete ocupado. O caminhão transportará espaço vazio sem redução do custo fixo de frete.`
        };
      case 'OVERLOAD':
      default:
        return {
          label: `${sim.palletsNeeded} Paletes Necessários`,
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          barColor: 'bg-slate-700',
          icon: <Layers className="w-3.5 h-3.5 text-slate-600" />,
          message: `Volume excede 1 palete PBR. A carga será dividida em ${sim.palletsNeeded} paletes.`
        };
    }
  };

  const status = getStatusBadge();
  const progressWidth = Math.min(100, sim.overallOccupancyPercent % 100 || (sim.overallOccupancyPercent >= 100 ? 100 : 0));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs font-sans transition-all">
      {/* cabecalho do simulador */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              Simulador de Carga & Cubagem
              <span className="text-[10px] font-normal text-slate-500">PBR 1,74m³</span>
            </h4>
          </div>
        </div>

        {/* badge de status da eficiencia */}
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.bg}`}>
          {status.icon}
          {status.label}
        </span>
      </div>

      {/* barra de progresso visual do palete */}
      <div className="pt-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 text-[11px] font-medium flex items-center gap-1">
            <Package className="w-3.5 h-3.5 text-slate-400" />
            Ocupação do Palete:
          </span>
          <span className="font-extrabold text-slate-900 text-[12px]">
            {sim.overallOccupancyPercent}% {sim.palletsNeeded > 1 && `(Palete ${sim.palletsNeeded})`}
          </span>
        </div>

        {/* trilho da barra */}
        <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/70">
          <div
            className={`h-full transition-all duration-500 ease-out rounded-full ${status.barColor}`}
            style={{ width: `${progressWidth}%` }}
          />
          {/* marcadores de escala */}
          <div className="absolute inset-0 flex justify-between px-2 text-[8px] text-slate-400 pointer-events-none items-center font-mono">
            <div className="w-px h-1.5 bg-slate-300" />
            <div className="w-px h-1.5 bg-slate-300" />
            <div className="w-px h-1.5 bg-slate-300" />
            <div className="w-px h-1.5 bg-slate-300" />
          </div>
        </div>

        {/* marcadores de porcentagem */}
        <div className="flex justify-between text-[9px] text-slate-400 font-mono pt-0.5">
          <span>0%</span>
          <span>50%</span>
          <span className="text-emerald-600 font-bold">85% (Ideal)</span>
          <span>100%</span>
        </div>
      </div>

      {/* mensagem contextual de incentivo a compras b2b */}
      <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
        <p className="flex items-start gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
          <span>{status.message}</span>
        </p>

        {/* acao rapida para preencher palete */}
        {sim.recommendedUnitsToFillPallet > 0 && sim.overallOccupancyPercent < 85 && onFillPallet && (
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-medium">
              Faltam aprox. <strong>+{sim.recommendedUnitsToFillPallet} un</strong> para fechar 100%
            </span>
            <button
              onClick={() => onFillPallet(sim.recommendedUnitsToFillPallet)}
              className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors shadow-2xs cursor-pointer"
            >
              <PlusCircle className="w-3 h-3" />
              Preencher Palete
            </button>
          </div>
        )}
      </div>

      {/* accordion de detalhes tecnicos de cubagem */}
      {!compact && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px]">
          <button
            onClick={() => setShowSpecs(!showSpecs)}
            className="w-full flex items-center justify-between text-slate-500 hover:text-slate-700 py-0.5 cursor-pointer"
          >
            <span className="flex items-center gap-1 font-medium">
              <Info className="w-3 h-3 text-slate-400" />
              Especificações Físicas da Carga
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSpecs ? 'rotate-180' : ''}`} />
          </button>

          {showSpecs && (
            <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] bg-slate-50/70 p-2.5 rounded-md border border-slate-200/50">
              <div>
                <span className="text-slate-400 block">Volume Total:</span>
                <span className="font-bold text-slate-800 font-mono">
                  {sim.totalVolumeM3} m³ / {PALLET_PBR_SPECS.maxVolumeM3} m³
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Peso Total Estimado:</span>
                <span className="font-bold text-slate-800 font-mono">
                  {sim.totalWeightKg} kg / {PALLET_PBR_SPECS.maxWeightKg} kg
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Fator Limitante:</span>
                <span className="font-bold text-slate-800">
                  {sim.limitingFactor === 'VOLUME' ? 'Volume Cúbico (m³)' : 'Capacidade de Peso (kg)'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Padrão Logístico:</span>
                <span className="font-bold text-slate-800">Palete PBR (1,0 x 1,2 m)</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
