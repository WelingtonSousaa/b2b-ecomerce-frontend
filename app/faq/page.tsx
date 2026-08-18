'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: 'Como funciona o cadastro por CNPJ e a consulta automática na Receita Federal?',
      category: 'Cadastro & Validação Fiscal',
      answer: 'O cadastro B2B na Shopcart é 100% automatizado. Basta informar os 14 dígitos do CNPJ da sua empresa na tela de cadastro. Nosso sistema consulta diretamente a base da Receita Federal e do Sintegra, preenchendo automaticamente a Razão Social, Nome Fantasia, Inscrição Estadual e Endereço Fiscal, eliminando digitação manual.'
    },
    {
      question: 'Quais são as condições para faturamento no boleto bancário (28, 56 e 84 dias)?',
      category: 'Crédito & Faturamento',
      answer: 'Empresas ativas com mais de 6 meses de constituição passam por uma análise automática na nossa mesa de crédito interna no momento do cadastro. Uma vez aprovado o limite de crédito, sua empresa poderá escolher faturar seus pedidos no boleto parcelado em até 3 vezes (28, 56 e 84 dias) sem juros diretamente no checkout.'
    },
    {
      question: 'Como funciona o cálculo de impostos (ICMS-ST, DIFAL e IPI) no momento da compra?',
      category: 'Tributação & Notas Fiscais',
      answer: 'Nossa plataforma possui um motor de regras fiscais nativo. Ao selecionar o endereço de entrega da empresa ou filial, o sistema calcula automaticamente a alíquota de ICMS do estado de destino, o DIFAL (Diferencial de Alíquota) e a Substituição Tributária (ICMS-ST), exibindo o valor exato da Nota Fiscal Eletrônica (NF-e) antes da finalização do pedido.'
    },
    {
      question: 'Minha empresa está localizada em área de isenção fiscal (SUFRAMA / ZFM). Como obtenho desconto?',
      category: 'Tributação & Notas Fiscais',
      answer: 'Se sua empresa possui Inscrição SUFRAMA ativa na Zona Franca de Manaus ou Áreas de Livre Comércio (ALC), informe seu código SUFRAMA no cadastro ou nas configurações da empresa. O sistema validará junto ao órgão federal e aplicará o desconto automático de isenção de PIS, COFINS, IPI e ICMS conforme legislação vigente.'
    },
    {
      question: 'Como posso realizar compras em lote ou importação de pedidos via arquivo CSV?',
      category: 'Pedidos & Catálogo',
      answer: 'Acesse o menu "Pedido Rápido (CSV)" no topo do site. Você poderá baixar nosso modelo de planilha padronizado, preencher os SKUs e quantidades desejadas e fazer o upload do arquivo. O sistema validará o estoque nos 3 Centros de Distribuição e adicionará os itens ao carrinho instantaneamente.'
    },
    {
      question: 'Qual a diferença entre as modalidades de frete CIF e FOB disponíveis?',
      category: 'Logística & Envio',
      answer: 'No frete CIF (Cost, Insurance and Freight), a Shopcart se responsabiliza totalmente pela contratação do transporte, seguro e entrega até o endereço cadastrado. Na modalidade FOB (Free on Board), sua empresa pode indicar a transportadora parceira de sua preferência (informando CNPJ e número de contrato).'
    },
    {
      question: 'Como solicitar a 2ª via de boleto bancário vencido ou alteração de vencimento?',
      category: 'Crédito & Faturamento',
      answer: 'Acesse o painel "Meus Pedidos & Faturas" dentro do seu usuário corporativo. Caso um boleto esteja vencido, nosso sistema permite gerar a 2ª via atualizada com recálculo automático de juros e multa pré-acordados, mantendo o histórico fiscal regularizado.'
    },
    {
      question: 'Qual é o prazo e procedimento para solicitar RMA / Troca de produtos com avaria?',
      category: 'Trocas & Garantia',
      answer: 'Em caso de avaria no transporte, a ressalva deve ser anotada no conhecimento de frete no ato do recebimento. Para devoluções legais (em até 30 dias) ou defeitos cobertos pela garantia de fábrica, o responsável da empresa deve abrir uma solicitação no menu de Suporte informando a Nota Fiscal para emissão da autorização de devolução (NF-e de Devolução).'
    }
  ];

  const filteredFaqs = faqs.filter(
    f => f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
         f.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
         f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen pb-20 pt-8 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium border-b border-gray-100 pb-4">
          <Link href="/" className="hover:text-[#004e38]">Home</Link>
          <span>/</span>
          <span className="font-bold text-gray-900">Perguntas Frequentes (FAQ)</span>
        </div>

        {/* Header Title & Search Bar */}
        <div className="text-center space-y-4">
          <span className="inline-block bg-emerald-100 text-[#004e38] text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Central de Suporte B2B
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Perguntas Frequentes & Dúvidas Fiscais
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
            Encontre respostas detalhadas sobre cadastro CNPJ, faturamento corporativo, tributação por estado e logística.
          </p>

          {/* Search Box */}
          <div className="max-w-md mx-auto relative pt-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Digite sua dúvida (ex: boleto, CNPJ, frete, SUFRAMA)..."
              className="w-full bg-[#f5f6f6] border border-gray-200 rounded-full py-3 pl-5 pr-12 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004e38]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-4 top-5" />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
          <span className="bg-[#004e38] text-white px-4 py-1.5 rounded-full">Todas</span>
          <span className="bg-[#f5f6f6] text-gray-700 px-4 py-1.5 rounded-full">Cadastro & CNPJ</span>
          <span className="bg-[#f5f6f6] text-gray-700 px-4 py-1.5 rounded-full">Crédito & Boletos</span>
          <span className="bg-[#f5f6f6] text-gray-700 px-4 py-1.5 rounded-full">Impostos & NF-e</span>
          <span className="bg-[#f5f6f6] text-gray-700 px-4 py-1.5 rounded-full">Frete CIF/FOB</span>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-2xs transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-gray-900 hover:text-[#004e38] transition-colors cursor-pointer"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#004e38] bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider block w-fit">
                        {faq.category}
                      </span>
                      <span>{faq.question}</span>
                    </div>

                    <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#004e38]' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3 bg-[#f5f6f6]/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-gray-500 bg-[#f5f6f6] rounded-2xl">
              Nenhuma pergunta encontrada com o termo &quot;{searchQuery}&quot;.
            </div>
          )}
        </div>

        {/* Still Need Help Box */}
        <div className="bg-[#f5f6f6] p-8 rounded-3xl text-center space-y-3 border border-gray-200">
          <HelpCircle className="w-10 h-10 text-[#004e38] mx-auto" />
          <h3 className="text-lg font-black text-gray-900">Ainda precisa de atendimento corporativo?</h3>
          <p className="text-xs text-gray-600 max-w-md mx-auto">
            Nossa mesa de crédito e consultores B2B estão disponíveis de segunda a sexta, das 08h às 18h.
          </p>
          <div className="pt-2">
            <Link
              href="/contato"
              className="inline-block bg-[#004e38] text-white text-xs font-bold px-8 py-3 rounded-full hover:bg-[#033627] transition-all"
            >
              Falar com um Consultor B2B
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
