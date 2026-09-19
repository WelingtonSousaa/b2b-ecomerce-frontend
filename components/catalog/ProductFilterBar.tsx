'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Star,
  SlidersHorizontal,
  X,
  Check,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export interface FilterState {
  type: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  color: string;
  material: string;
  onlyDeals: boolean;
  sortBy: string;
}

interface ProductFilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  availableTypes?: string[];
  totalResultsCount: number;
  maxCatalogPrice?: number;
}

interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  minValue: number;
  maxValue: number;
  onChange: (min: number, max: number) => void;
}

export function DualRangeSlider({
  min,
  max,
  step = 50,
  minValue,
  maxValue,
  onChange,
}: DualRangeSliderProps) {
  const minPercent = Math.min(100, Math.max(0, ((minValue - min) / (max - min)) * 100));
  const maxPercent = Math.min(100, Math.max(0, ((maxValue - min) / (max - min)) * 100));

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxValue - step);
    onChange(value, maxValue);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minValue + step);
    onChange(minValue, value);
  };

  return (
    <div className="space-y-2 select-none">
      {/* Dual Slider Track */}
      <div className="relative w-full h-8 flex items-center">
        {/* Gray Background Track */}
        <div className="absolute w-full h-2 bg-gray-200 rounded-full" />

        {/* Active Emerald Highlighted Track between the two thumbs */}
        <div
          className="absolute h-2 bg-[#2563eb] rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${Math.max(0, maxPercent - minPercent)}%`,
          }}
        />

        {/* Point 1: Min Price Draggable Thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-20 focus:outline-none
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-[#2563eb]
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-webkit-slider-thumb]:hover:scale-115
            [&::-webkit-slider-thumb]:active:scale-125
            [&::-webkit-slider-thumb]:transition-transform
            [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-[#2563eb]
            [&::-moz-range-thumb]:shadow-md
            [&::-moz-range-thumb]:cursor-grab
            [&::-moz-range-thumb]:active:cursor-grabbing
            [&::-moz-range-thumb]:hover:scale-115
            [&::-moz-range-thumb]:active:scale-125
            [&::-moz-range-thumb]:transition-transform"
          aria-label="Preço Mínimo"
        />

        {/* Point 2: Max Price Draggable Thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          className={`absolute w-full h-2 appearance-none bg-transparent pointer-events-none focus:outline-none ${
            minValue > max - 150 ? 'z-30' : 'z-20'
          }
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-[#2563eb]
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-webkit-slider-thumb]:hover:scale-115
            [&::-webkit-slider-thumb]:active:scale-125
            [&::-webkit-slider-thumb]:transition-transform
            [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-[#2563eb]
            [&::-moz-range-thumb]:shadow-md
            [&::-moz-range-thumb]:cursor-grab
            [&::-moz-range-thumb]:active:cursor-grabbing
            [&::-moz-range-thumb]:hover:scale-115
            [&::-moz-range-thumb]:active:scale-125
            [&::-moz-range-thumb]:transition-transform`}
          aria-label="Preço Máximo"
        />
      </div>

      {/* Axis Scale */}
      <div className="flex justify-between text-[10px] text-gray-400 font-mono">
        <span>R$ {min.toLocaleString('pt-BR')}</span>
        <span>R$ {Math.round((max - min) / 2).toLocaleString('pt-BR')}</span>
        <span>R$ {max.toLocaleString('pt-BR')}</span>
      </div>
    </div>
  );
}

export default function ProductFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  availableTypes = ['Todos', 'Sem Fio', 'Over-Ear', 'Estúdio ANC', 'Com Fio', 'Notebooks', 'Monitores', 'Servidores', 'Ergonomia', 'Impressoras', 'CFTV'],
  totalResultsCount,
  maxCatalogPrice = 15000
}: ProductFilterBarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAllFiltersOpen, setIsAllFiltersOpen] = useState(false);

  const filterBarRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterBarRef.current && !filterBarRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle ESC key to close modal/dropdowns
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsAllFiltersOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const hasActiveFilters =
    filters.type !== 'Todos' ||
    filters.minPrice > 0 ||
    filters.maxPrice < maxCatalogPrice ||
    filters.minRating > 0 ||
    filters.color !== 'Todos' ||
    filters.material !== 'Todos' ||
    filters.onlyDeals;

  const colorsList = [
    { name: 'Todos', hex: '' },
    { name: 'Preto', hex: '#111827' },
    { name: 'Rosa', hex: '#ec4899' },
    { name: 'Vermelho', hex: '#dc2626' },
    { name: 'Cinza Espacial', hex: '#4b5563' },
    { name: 'Grafite', hex: '#374151' },
    { name: 'Branco', hex: '#f3f4f6' },
    { name: 'Branco & Cinza', hex: '#9ca3af' },
    { name: 'Preto Fosco', hex: '#1f2937' },
  ];

  const materialsList = [
    'Todos',
    'Polímero',
    'Termoplástico',
    'Alumínio',
    'Couro & Aço',
    'Metal & Polímero',
    'Mesh & Alumínio',
    'Aço Carbono'
  ];

  const applyPriceFilter = (min: number, max: number) => {
    onFilterChange({
      ...filters,
      minPrice: Math.min(min, max),
      maxPrice: Math.max(min, max)
    });
  };

  return (
    <div ref={filterBarRef} className="space-y-3 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
        
        {/* Left Filter Pills Row */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* 1. Tipo de Produto */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all cursor-pointer ${
                filters.type !== 'Todos'
                  ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-xs'
                  : 'bg-[#f5f6f6] hover:bg-gray-200 text-gray-800 border-transparent'
              }`}
            >
              <span>{filters.type === 'Todos' ? 'Tipo de Produto' : filters.type}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'type' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'type' && (
              <div className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-64 overflow-y-auto">
                {availableTypes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      onFilterChange({ ...filters, type: t });
                      setActiveDropdown(null);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#f5f6f6] transition-colors flex items-center justify-between ${
                      filters.type === t ? 'font-bold text-[#2563eb] bg-blue-50/50' : 'text-gray-700'
                    }`}
                  >
                    <span>{t}</span>
                    {filters.type === t && <Check className="w-3.5 h-3.5 text-[#2563eb]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Preço com Barrinha Interativa com 2 Pontos (Dual Range Slider) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all cursor-pointer ${
                filters.minPrice > 0 || filters.maxPrice < maxCatalogPrice
                  ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-xs'
                  : 'bg-[#f5f6f6] hover:bg-gray-200 text-gray-800 border-transparent'
              }`}
            >
              <span>
                {filters.minPrice > 0 || filters.maxPrice < maxCatalogPrice
                  ? `R$ ${filters.minPrice} - R$ ${filters.maxPrice}`
                  : 'Faixa de Preço'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'price' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'price' && (
              <div className="absolute left-0 mt-2 w-84 bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="font-extrabold text-sm text-gray-900">Faixa de Preço (Min e Max)</span>
                  <button
                    type="button"
                    onClick={() => applyPriceFilter(0, maxCatalogPrice)}
                    className="text-[11px] text-gray-400 hover:text-red-600 font-bold transition-colors cursor-pointer underline"
                  >
                    Resetar
                  </button>
                </div>

                {/* Editable Manual Inputs Box */}
                <div className="flex items-center justify-between gap-3 text-xs">
                  {/* Min Price Input */}
                  <div className="flex-1 bg-gray-50 border border-gray-200 focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-[#2563eb]/15 focus-within:bg-white rounded-2xl p-2.5 transition-all">
                    <label htmlFor="dropdown-min-price" className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider mb-0.5">
                      Mínimo
                    </label>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400 font-bold text-xs">R$</span>
                      <input
                        id="dropdown-min-price"
                        type="number"
                        min={0}
                        max={filters.maxPrice}
                        step={50}
                        value={filters.minPrice === 0 ? '' : filters.minPrice}
                        placeholder="0"
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value);
                          if (isNaN(val)) return;
                          onFilterChange({
                            ...filters,
                            minPrice: Math.max(0, Math.min(val, filters.maxPrice))
                          });
                        }}
                        className="w-full bg-transparent font-mono font-bold text-[#2563eb] text-xs focus:outline-none placeholder:text-gray-300"
                      />
                    </div>
                  </div>

                  <span className="text-gray-400 font-bold">até</span>

                  {/* Max Price Input */}
                  <div className="flex-1 bg-gray-50 border border-gray-200 focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-[#2563eb]/15 focus-within:bg-white rounded-2xl p-2.5 transition-all">
                    <label htmlFor="dropdown-max-price" className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider mb-0.5">
                      Máximo
                    </label>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400 font-bold text-xs">R$</span>
                      <input
                        id="dropdown-max-price"
                        type="number"
                        min={filters.minPrice}
                        max={maxCatalogPrice}
                        step={50}
                        value={filters.maxPrice === maxCatalogPrice ? '' : filters.maxPrice}
                        placeholder={maxCatalogPrice.toString()}
                        onChange={(e) => {
                          const val = e.target.value === '' ? maxCatalogPrice : Number(e.target.value);
                          if (isNaN(val)) return;
                          onFilterChange({
                            ...filters,
                            maxPrice: Math.max(filters.minPrice, Math.min(val, maxCatalogPrice))
                          });
                        }}
                        className="w-full bg-transparent font-mono font-bold text-[#2563eb] text-xs focus:outline-none placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                </div>

                {/* DUAL RANGE SLIDER WITH 2 POINTS */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-bold text-gray-600 flex justify-between">
                    <span>Arraste os 2 pontos ou digite acima:</span>
                    <span className="text-[#2563eb] font-mono font-extrabold">
                      R$ {filters.minPrice.toLocaleString('pt-BR')} — R$ {filters.maxPrice.toLocaleString('pt-BR')}
                    </span>
                  </label>
                  
                  <DualRangeSlider
                    min={0}
                    max={maxCatalogPrice}
                    step={50}
                    minValue={filters.minPrice}
                    maxValue={filters.maxPrice}
                    onChange={(newMin, newMax) => {
                      onFilterChange({
                        ...filters,
                        minPrice: newMin,
                        maxPrice: newMax
                      });
                    }}
                  />
                </div>

                {/* Quick Presets */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => applyPriceFilter(0, 500)}
                    className="p-1.5 rounded-lg bg-gray-50 hover:bg-blue-50 text-[11px] text-gray-700 hover:text-[#2563eb] border border-gray-100 text-center font-medium transition-colors"
                  >
                    Até R$ 500
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPriceFilter(500, 3000)}
                    className="p-1.5 rounded-lg bg-gray-50 hover:bg-blue-50 text-[11px] text-gray-700 hover:text-[#2563eb] border border-gray-100 text-center font-medium transition-colors"
                  >
                    R$ 500 a R$ 3.000
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPriceFilter(3000, 10000)}
                    className="p-1.5 rounded-lg bg-gray-50 hover:bg-blue-50 text-[11px] text-gray-700 hover:text-[#2563eb] border border-gray-100 text-center font-medium transition-colors"
                  >
                    R$ 3.000 a R$ 10.000
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPriceFilter(0, maxCatalogPrice)}
                    className="p-1.5 rounded-lg bg-gray-50 hover:bg-blue-50 text-[11px] text-gray-700 hover:text-[#2563eb] border border-gray-100 text-center font-medium transition-colors"
                  >
                    Ver Todos
                  </button>
                </div>

                {/* Close / Confirm */}
                <button
                  type="button"
                  onClick={() => setActiveDropdown(null)}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs py-2.5 rounded-full transition-all shadow-xs cursor-pointer text-center"
                >
                  Concluir
                </button>
              </div>
            )}
          </div>

          {/* 3. Avaliação */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'rating' ? null : 'rating')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all cursor-pointer ${
                filters.minRating > 0
                  ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-xs'
                  : 'bg-[#f5f6f6] hover:bg-gray-200 text-gray-800 border-transparent'
              }`}
            >
              <span>{filters.minRating > 0 ? `${filters.minRating} estrelas ou mais` : 'Avaliação'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'rating' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'rating' && (
              <div className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {[
                  { label: 'Todas as avaliações', rating: 0 },
                  { label: '5 Estrelas', rating: 5 },
                  { label: '4.8 Estrelas ou mais', rating: 4.8 },
                  { label: '4.5 Estrelas ou mais', rating: 4.5 },
                  { label: '4.0 Estrelas ou mais', rating: 4.0 },
                ].map((item) => (
                  <button
                    key={item.rating}
                    type="button"
                    onClick={() => {
                      onFilterChange({ ...filters, minRating: item.rating });
                      setActiveDropdown(null);
                    }}
                    className={`w-full text-left px-4 py-2.5 hover:bg-[#f5f6f6] transition-colors flex items-center justify-between ${
                      filters.minRating === item.rating ? 'font-bold text-[#2563eb] bg-blue-50/50' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {item.rating > 0 && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
                      <span>{item.label}</span>
                    </div>
                    {filters.minRating === item.rating && <Check className="w-3.5 h-3.5 text-[#2563eb]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. Cor */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'color' ? null : 'color')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all cursor-pointer ${
                filters.color !== 'Todos'
                  ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-xs'
                  : 'bg-[#f5f6f6] hover:bg-gray-200 text-gray-800 border-transparent'
              }`}
            >
              <span>{filters.color !== 'Todos' ? filters.color : 'Cor'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'color' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'color' && (
              <div className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-60 overflow-y-auto">
                {colorsList.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      onFilterChange({ ...filters, color: c.name });
                      setActiveDropdown(null);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#f5f6f6] transition-colors flex items-center justify-between ${
                      filters.color === c.name ? 'font-bold text-[#2563eb] bg-blue-50/50' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {c.hex && (
                        <span
                          className="w-3 h-3 rounded-full border border-gray-300 shadow-2xs"
                          style={{ backgroundColor: c.hex }}
                        />
                      )}
                      <span>{c.name}</span>
                    </div>
                    {filters.color === c.name && <Check className="w-3.5 h-3.5 text-[#2563eb]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 5. Material */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'material' ? null : 'material')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all cursor-pointer ${
                filters.material !== 'Todos'
                  ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-xs'
                  : 'bg-[#f5f6f6] hover:bg-gray-200 text-gray-800 border-transparent'
              }`}
            >
              <span>{filters.material !== 'Todos' ? filters.material : 'Material'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'material' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'material' && (
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-60 overflow-y-auto">
                {materialsList.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      onFilterChange({ ...filters, material: m });
                      setActiveDropdown(null);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#f5f6f6] transition-colors flex items-center justify-between ${
                      filters.material === m ? 'font-bold text-[#2563eb] bg-blue-50/50' : 'text-gray-700'
                    }`}
                  >
                    <span>{m}</span>
                    {filters.material === m && <Check className="w-3.5 h-3.5 text-[#2563eb]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 6. Ofertas / Desconto por Volume */}
          <div className="relative">
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, onlyDeals: !filters.onlyDeals })}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all cursor-pointer ${
                filters.onlyDeals
                  ? 'bg-amber-400 text-gray-950 border-amber-400 font-black shadow-xs'
                  : 'bg-[#f5f6f6] hover:bg-gray-200 text-gray-800 border-transparent'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ofertas B2B</span>
              {filters.onlyDeals && <X className="w-3 h-3 ml-1" />}
            </button>
          </div>

          {/* 7. Botão Todos os Filtros (Drawer Modal) */}
          <button
            type="button"
            onClick={() => setIsAllFiltersOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#f5f6f6] hover:bg-gray-200 text-gray-800 rounded-full transition-colors cursor-pointer"
          >
            <span>Todos os Filtros</span>
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-700" />
          </button>

          {/* Limpar Filtros Rápido */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 font-bold px-2 py-1 underline transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpar filtros</span>
            </button>
          )}

        </div>

        {/* Right Sort Dropdown */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
          <span className="text-gray-500 hidden sm:inline">Ordenar por:</span>
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
              className="bg-[#f5f6f6] hover:bg-gray-200 text-gray-900 rounded-full px-4 py-2 pr-8 border border-transparent appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            >
              <option value="featured">Mais Relevantes</option>
              <option value="price-low">Menor Preço</option>
              <option value="price-high">Maior Preço</option>
              <option value="rating">Melhor Avaliados</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* MODAL / DRAWER: TODOS OS FILTROS */}
      {isAllFiltersOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 font-sans"
          onClick={() => setIsAllFiltersOpen(false)}
        >
          <div
            className="bg-white text-gray-900 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden relative max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#2563eb] text-white p-5 flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="w-5 h-5" />
                <h3 className="text-lg font-black tracking-tight">Todos os Filtros do Catálogo</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAllFiltersOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Preço Slider com 2 Pontos e Inputs Manuais */}
              <div className="space-y-4 border-b border-gray-100 pb-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900">Faixa de Preço (Min e Max)</h4>
                  <span className="font-mono text-xs font-bold text-[#2563eb]">
                    R$ {filters.minPrice.toLocaleString('pt-BR')} — R$ {filters.maxPrice.toLocaleString('pt-BR')}
                  </span>
                </div>

                {/* Editable Manual Inputs Box in Modal */}
                <div className="flex items-center justify-between gap-3 text-xs">
                  {/* Min Price Input */}
                  <div className="flex-1 bg-gray-50 border border-gray-200 focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-[#2563eb]/15 focus-within:bg-white rounded-2xl p-2.5 transition-all">
                    <label htmlFor="modal-min-price" className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider mb-0.5">
                      Mínimo
                    </label>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400 font-bold text-xs">R$</span>
                      <input
                        id="modal-min-price"
                        type="number"
                        min={0}
                        max={filters.maxPrice}
                        step={50}
                        value={filters.minPrice === 0 ? '' : filters.minPrice}
                        placeholder="0"
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value);
                          if (isNaN(val)) return;
                          onFilterChange({
                            ...filters,
                            minPrice: Math.max(0, Math.min(val, filters.maxPrice))
                          });
                        }}
                        className="w-full bg-transparent font-mono font-bold text-[#2563eb] text-xs focus:outline-none placeholder:text-gray-300"
                      />
                    </div>
                  </div>

                  <span className="text-gray-400 font-bold">até</span>

                  {/* Max Price Input */}
                  <div className="flex-1 bg-gray-50 border border-gray-200 focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-[#2563eb]/15 focus-within:bg-white rounded-2xl p-2.5 transition-all">
                    <label htmlFor="modal-max-price" className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider mb-0.5">
                      Máximo
                    </label>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400 font-bold text-xs">R$</span>
                      <input
                        id="modal-max-price"
                        type="number"
                        min={filters.minPrice}
                        max={maxCatalogPrice}
                        step={50}
                        value={filters.maxPrice === maxCatalogPrice ? '' : filters.maxPrice}
                        placeholder={maxCatalogPrice.toString()}
                        onChange={(e) => {
                          const val = e.target.value === '' ? maxCatalogPrice : Number(e.target.value);
                          if (isNaN(val)) return;
                          onFilterChange({
                            ...filters,
                            maxPrice: Math.max(filters.minPrice, Math.min(val, maxCatalogPrice))
                          });
                        }}
                        className="w-full bg-transparent font-mono font-bold text-[#2563eb] text-xs focus:outline-none placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                </div>

                <DualRangeSlider
                  min={0}
                  max={maxCatalogPrice}
                  step={50}
                  minValue={filters.minPrice}
                  maxValue={filters.maxPrice}
                  onChange={(newMin, newMax) => {
                    onFilterChange({
                      ...filters,
                      minPrice: newMin,
                      maxPrice: newMax
                    });
                  }}
                />
              </div>

              {/* Tipos de Produto */}
              <div className="space-y-3 border-b border-gray-100 pb-5">
                <h4 className="font-extrabold text-sm text-gray-900">Categoria / Tipo</h4>
                <div className="flex flex-wrap gap-2">
                  {availableTypes.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => onFilterChange({ ...filters, type: t })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        filters.type === t
                          ? 'bg-[#2563eb] text-white font-bold'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cores */}
              <div className="space-y-3 border-b border-gray-100 pb-5">
                <h4 className="font-extrabold text-sm text-gray-900">Cores Disponíveis</h4>
                <div className="flex flex-wrap gap-2">
                  {colorsList.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => onFilterChange({ ...filters, color: c.name })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        filters.color === c.name
                          ? 'bg-[#2563eb] text-white font-bold'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {c.hex && (
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-gray-300"
                          style={{ backgroundColor: c.hex }}
                        />
                      )}
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Material */}
              <div className="space-y-3 border-b border-gray-100 pb-5">
                <h4 className="font-extrabold text-sm text-gray-900">Material de Acabamento</h4>
                <div className="flex flex-wrap gap-2">
                  {materialsList.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => onFilterChange({ ...filters, material: m })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        filters.material === m
                          ? 'bg-[#2563eb] text-white font-bold'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Avaliação Mínima */}
              <div className="space-y-3 border-b border-gray-100 pb-5">
                <h4 className="font-extrabold text-sm text-gray-900">Avaliação do Cliente</h4>
                <div className="flex flex-wrap gap-2">
                  {[0, 4.0, 4.5, 4.8, 5.0].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => onFilterChange({ ...filters, minRating: r })}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        filters.minRating === r
                          ? 'bg-[#2563eb] text-white font-bold'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {r > 0 && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                      <span>{r === 0 ? 'Todas' : `${r} estrelas ou mais`}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ofertas B2B Checkbox */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">Apenas Produtos com Desconto por Volume</p>
                    <p className="text-[10px] text-gray-500">Exibir apenas itens com escalas ativas de desconto para lote</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={filters.onlyDeals}
                  onChange={(e) => onFilterChange({ ...filters, onlyDeals: e.target.checked })}
                  className="w-4 h-4 text-[#2563eb] rounded-md accent-[#2563eb] cursor-pointer"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#f5f6f6] border-t border-gray-100 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={onResetFilters}
                className="text-xs font-bold text-gray-500 hover:text-red-600 transition-colors underline cursor-pointer"
              >
                Limpar Todos os Filtros
              </button>

              <button
                type="button"
                onClick={() => setIsAllFiltersOpen(false)}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs px-6 py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
              >
                Ver {totalResultsCount} Produtos
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
