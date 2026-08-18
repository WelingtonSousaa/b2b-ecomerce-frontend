'use client';

import React from 'react';
import Link from 'next/link';

export default function TermosPage() {
  return (
    <div className="bg-white min-h-screen pb-20 pt-8 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium border-b border-gray-100 pb-4">
          <Link href="/" className="hover:text-[#004e38]">Home</Link>
          <span>/</span>
          <span className="font-bold text-gray-900">Termos & Condições de Uso B2B</span>
        </div>

        {/* Header */}
        <div className="space-y-3 border-b border-gray-100 pb-6">
          <span className="inline-block bg-emerald-100 text-[#004e38] text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Contrato de Prestação de Serviços & Vendas
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Termos & Condições Gerais de Uso
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Regulamento oficial que rege o acesso, concessão de limite de crédito, faturamento corporativo e compras por CNPJ no portal Shopcart.
          </p>
        </div>

        {/* Legal Sections */}
        <div className="space-y-8 text-xs text-gray-700 leading-relaxed">
          
          <div className="space-y-2">
            <h2 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-2">
              1. Elegibilidade & Cadastro de Pessoa Jurídica (CNPJ)
            </h2>
            <p>
              A utilização do portal de compras Shopcart B2B é restrita a pessoas jurídicas devidamente constituídas e registradas com CNPJ ativo no cadastro da Secretaria da Receita Federal do Brasil.
            </p>
            <p>
              Ao realizar o cadastro, a empresa declara que as informações prestadas são verdadeiras e autoriza a Shopcart a efetuar a validação junto a órgãos oficiais e bureaus de crédito.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-2">
              2. Concessão de Limite de Crédito & Faturamento no Boleto
            </h2>
            <p>
              A liberação de limite de crédito e concessão de prazos de faturamento (28, 56 e 84 dias) fica sujeita à análise de risco e aprovação prévia pela mesa de crédito interna da Shopcart.
            </p>
            <p>
              O atraso no pagamento dos boletos acarretará a incidência de juros de mora de 1% ao mês e multa contratual de 2%, podendo levar à suspensão temporária do limite de crédito cadastrado.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-2">
              3. Obrigações Fiscais e Emissão de Nota Fiscal (NF-e)
            </h2>
            <p>
              Todas as transações são acompanhadas da respectiva Nota Fiscal Eletrônica (NF-e) com o devido destaque dos impostos incidentes (ICMS, IPI, PIS e COFINS).
            </p>
            <p>
              Em operações com substituição tributária (ICMS-ST) ou DIFAL, o cálculo é efetuado de acordo com a legislação do estado de destino do estabelecimento comprador.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-2">
              4. Privacidade e Proteção de Dados (LGPD)
            </h2>
            <p>
              A Shopcart Brasil Ltda. compromete-se com o cumprimento integral da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), tratando os dados dos representantes cadastrados exclusivamente para fins operacionais e de faturamento.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-2">
              5. Foro de Eleição
            </h2>
            <p>
              Fica eleito o Foro da Comarca da Capital do Estado de São Paulo para dirimir quaisquer dúvidas ou litígios oriundos do presente contrato.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
