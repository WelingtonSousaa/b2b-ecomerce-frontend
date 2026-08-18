'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, CheckCircle2, MessageSquare, Send } from 'lucide-react';

export default function ContatoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [department, setDepartment] = useState('Vendas Corporativas');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen pb-20 pt-8 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 space-y-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium border-b border-gray-100 pb-4">
          <Link href="/" className="hover:text-[#004e38]">Home</Link>
          <span>/</span>
          <span className="font-bold text-gray-900">Fale Conosco</span>
        </div>

        {/* Title Banner */}
        <div className="text-center space-y-3">
          <span className="inline-block bg-emerald-100 text-[#004e38] text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Canais de Atendimento Corporativo
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Entre em Contato com Nossos Consultores
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
            Atendimento especializado para empresas, mesas de crédito, cotações de grande volume e suporte técnico.
          </p>
        </div>

        {/* 2 Columns: Contact Form & Official Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT: Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 shadow-2xs space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Formulário de Contato Comercial</h2>
              <p className="text-xs text-gray-500 mt-1">Preencha os campos abaixo e entraremos em contato em até 2 horas úteis.</p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Razão Social / Nome da Empresa*</label>
                    <input type="text" required placeholder="ex: Tech Solutions LTDA" className="w-full bg-[#f5f6f6] rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-[#004e38]" />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">CNPJ da Empresa*</label>
                    <input type="text" required placeholder="00.000.000/0001-00" className="w-full bg-[#f5f6f6] rounded-xl px-4 py-3 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#004e38]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Nome do Responsável*</label>
                    <input type="text" required placeholder="Seu nome completo" className="w-full bg-[#f5f6f6] rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-[#004e38]" />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">E-mail Corporativo*</label>
                    <input type="email" required placeholder="compras@empresa.com.br" className="w-full bg-[#f5f6f6] rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-[#004e38]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Telefone / WhatsApp*</label>
                    <input type="text" required placeholder="(11) 98765-4321" className="w-full bg-[#f5f6f6] rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-[#004e38]" />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Departamento Desejado*</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-[#f5f6f6] rounded-xl px-4 py-3 font-bold text-gray-900 focus:outline-none"
                    >
                      <option value="Vendas Corporativas">Vendas Corporativas & Cotações</option>
                      <option value="Mesa de Crédito">Mesa de Crédito & Faturamento</option>
                      <option value="Suporte Técnico">Suporte Técnico & Pós-Venda</option>
                      <option value="Logística & Entregas">Logística & Rastreamento</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Mensagem ou Especificação de Compra*</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Descreva os produtos, quantidades estimadas ou dúvida comercial..."
                    className="w-full bg-[#f5f6f6] rounded-xl p-4 font-medium focus:outline-none focus:ring-2 focus:ring-[#004e38]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#004e38] hover:bg-[#033627] text-white font-bold py-3.5 rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Mensagem Comercial</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-10 space-y-3">
                <CheckCircle2 className="w-14 h-14 text-[#004e38] mx-auto" />
                <h3 className="text-xl font-black text-gray-900">Mensagem Enviada com Sucesso!</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Um consultor dedicado do departamento de <strong className="text-gray-900">{department}</strong> retornará o contato no seu e-mail corporativo.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: Official Contact Cards & Address */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#f5f6f6] p-6 sm:p-8 rounded-3xl space-y-6 border border-gray-200">
              <h3 className="text-lg font-black text-gray-900 border-b border-gray-200 pb-3">
                Canais Diretos de Atendimento
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white text-[#004e38] flex items-center justify-center shrink-0 shadow-2xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Central 0800 Gratuitos</h4>
                    <p className="text-gray-600 font-mono font-bold text-xs">0800 123 4567</p>
                    <p className="text-gray-400 text-[11px]">Segunda a Sexta das 08h às 18h</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white text-[#004e38] flex items-center justify-center shrink-0 shadow-2xs">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">WhatsApp B2B</h4>
                    <p className="text-gray-600 font-mono font-bold text-xs">(11) 98765-4321</p>
                    <p className="text-gray-400 text-[11px]">Cotações rápidas por mensagens</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white text-[#004e38] flex items-center justify-center shrink-0 shadow-2xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">E-mail Comercial</h4>
                    <p className="text-gray-600 font-mono font-bold text-xs">atendimento@shopcart.com.br</p>
                    <p className="text-gray-400 text-[11px]">Recebimento de RFQ e orçamentos</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white text-[#004e38] flex items-center justify-center shrink-0 shadow-2xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Sede Corporativa</h4>
                    <p className="text-gray-700 font-semibold text-xs">
                      Av. Paulista, 1000 - Conjunto 42 <br />
                      Bela Vista - São Paulo / SP <br />
                      CEP: 01310-100
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
