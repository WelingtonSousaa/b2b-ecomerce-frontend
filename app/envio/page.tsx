'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function EnvioPage() {
  return (
    <div className="bg-white min-h-screen pb-20 pt-8 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium border-b border-gray-100 pb-4">
          <Link href="/" className="hover:text-[#2563eb]">Home</Link>
          <span>/</span>
          <span className="font-bold text-gray-900">Informações de Envio & Logística</span>
        </div>

        {/* Header Title */}
        <div className="space-y-3 border-b border-gray-100 pb-6">
          <span className="inline-block bg-blue-100 text-[#2563eb] text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Malha Logística Multi-CD
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Prazos de Entrega, Modalidades CIF/FOB & Rastreamento
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Conheça nossa estrutura de expedição inteligente distribuída estrategicamente para garantir a menor alíquota de frete e maior agilidade na entrega.
          </p>
        </div>

        {/* Distribution Centers */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-gray-900">Centros de Distribuição Estratégicos (Hubs)</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#f5f6f6] p-5 rounded-2xl border border-gray-200 space-y-2">
              <div className="flex items-center gap-2 text-[#2563eb] font-black">
                <MapPin className="w-4 h-4" /> CD Sudeste (São Paulo - SP)
              </div>
              <p className="text-gray-600 text-[11px]">Atendimento prioritário para os estados de SP, RJ, MG, ES e Centro-Oeste.</p>
              <span className="inline-block bg-white text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-200">
                Prazo médio: 24h a 48h
              </span>
            </div>

            <div className="bg-[#f5f6f6] p-5 rounded-2xl border border-gray-200 space-y-2">
              <div className="flex items-center gap-2 text-[#2563eb] font-black">
                <MapPin className="w-4 h-4" /> CD Sul (Joinville - SC)
              </div>
              <p className="text-gray-600 text-[11px]">Atendimento prioritário com isenção de incentivos fiscais para SC, PR e RS.</p>
              <span className="inline-block bg-white text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-200">
                Prazo médio: 48h a 72h
              </span>
            </div>

            <div className="bg-[#f5f6f6] p-5 rounded-2xl border border-gray-200 space-y-2">
              <div className="flex items-center gap-2 text-[#2563eb] font-black">
                <MapPin className="w-4 h-4" /> CD Nordeste (Camaçari - BA)
              </div>
              <p className="text-gray-600 text-[11px]">Atendimento aos estados do Nordeste e Norte com otimização tributária de ICMS.</p>
              <span className="inline-block bg-white text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-200">
                Prazo médio: 48h a 96h
              </span>
            </div>
          </div>
        </div>

        {/* CIF vs FOB Explanation */}
        <div className="space-y-4 text-xs text-gray-700 leading-relaxed border-t border-gray-100 pt-8">
          <h2 className="text-xl font-extrabold text-gray-900">Modalidades de Frete Suportadas</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-2 shadow-2xs">
              <span className="bg-[#2563eb] text-white text-[10px] font-black px-2.5 py-1 rounded">FRETE CIF (OneSync Contrata)</span>
              <h3 className="text-base font-bold text-gray-900 pt-1">Frete Pago e Gerenciado pela OneSync</h3>
              <p className="text-gray-600">
                A OneSync assume total responsabilidade pela cotação, embarque, seguro e entrega do pedido. Disponível com **Frete Grátis** para compras corporativas acima de R$ 200,00.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-2 shadow-2xs">
              <span className="bg-[#2563eb] text-white text-[10px] font-black px-2.5 py-1 rounded">FRETE FOB (Cliente Contrata)</span>
              <h3 className="text-base font-bold text-gray-900 pt-1">Retirada por Transportadora Indicada</h3>
              <p className="text-gray-600">
                Sua empresa pode indicar a transportadora de sua preferência (informando CNPJ da transportadora e número do contrato) diretamente na finalização do pedido.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
