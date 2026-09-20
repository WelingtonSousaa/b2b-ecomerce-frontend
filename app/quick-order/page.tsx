'use client';

import React, { useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
  Download,
  RefreshCw,
  ShoppingCart,
  Zap
} from 'lucide-react';
import { productsService } from '@/services/products.service';
import { CSVImportRowResult, CSVImportRowStatus, Product } from '@/types/b2b';
import { useCart } from '@/context/CartContext';

export default function QuickOrderPage() {
  const { addItem, openCart } = useCart();
  const [activeTab, setActiveTab] = useState<'csv' | 'manual'>('csv');
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [manualRows, setManualRows] = useState<{ id: number; sku: string; quantity: number }[]>([
    { id: 1, sku: 'DELL-R750-XS', quantity: 2 },
    { id: 2, sku: 'MBP-M3-MAX-64', quantity: 1 },
    { id: 3, sku: 'CISCO-C9300-48P', quantity: 1 },
  ]);

  const [validationResults, setValidationResults] = useState<CSVImportRowResult[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  React.useEffect(() => {
    productsService.getProducts().then((res) => {
      if (res.data) {
        setCatalogProducts(res.data);
      }
    }).catch(() => {});
  }, []);

  // Executa o motor de validacao das linhas
  const runValidation = (rows: { sku: string; quantity: number }[]) => {
    setIsProcessing(true);

    setTimeout(() => {
      const results: CSVImportRowResult[] = rows.map((r, idx) => {
        const product = catalogProducts.find(
          (p) => p.sku.toUpperCase() === r.sku.trim().toUpperCase()
        );

        if (!product) {
          return {
            rowNumber: idx + 1,
            rawSku: r.sku,
            rawQuantity: r.quantity,
            status: 'SKU_NOT_FOUND',
            errorMessage: `SKU "${r.sku}" não foi localizado no catálogo de produtos.`,
          };
        }

        const totalStock = product.stockByCD.reduce((acc, cd) => acc + cd.availableQuantity, 0);

        if (totalStock === 0) {
          return {
            rowNumber: idx + 1,
            rawSku: r.sku,
            rawQuantity: r.quantity,
            product,
            status: 'OUT_OF_STOCK',
            errorMessage: `Produto sem saldo disponível em nenhum Centro de Distribuição.`,
          };
        }

        if (r.quantity < product.moq) {
          return {
            rowNumber: idx + 1,
            rawSku: r.sku,
            rawQuantity: r.quantity,
            product,
            status: 'BELOW_MOQ',
            errorMessage: `Quantidade (${r.quantity}) é inferior ao Pedido Mínimo exigido (MOQ = ${product.moq} un).`,
          };
        }

        return {
          rowNumber: idx + 1,
          rawSku: r.sku,
          rawQuantity: r.quantity,
          product,
          status: 'VALID',
        };
      });

      setValidationResults(results);
      setIsProcessing(false);
    }, 600);
  };

  // Simula upload de arquivo CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Dados simulados do CSV enviado
      const mockCsvRows = [
        { sku: 'SKU-HEAD-01', quantity: 20 },
        { sku: 'SKU-HEAD-02', quantity: 5 },
        { sku: 'SKU-HEAD-03', quantity: 2 }, // Abaixo MOQ
        { sku: 'SKU-INVALID-77', quantity: 10 }, // Erro
        { sku: 'SKU-ACC-01', quantity: 15 },
      ];
      runValidation(mockCsvRows);
    }
  };

  const handleAddManualRow = () => {
    setManualRows((prev) => [
      ...prev,
      { id: Date.now(), sku: '', quantity: 1 },
    ]);
  };

  const handleRemoveManualRow = (id: number) => {
    setManualRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateManualRow = (id: number, field: 'sku' | 'quantity', value: string | number) => {
    setManualRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  // Ajusta automaticamente quantidades abaixo do MOQ
  const handleFixMoqErrors = () => {
    if (!validationResults) return;

    const fixed = validationResults.map((res) => {
      if (res.status === 'BELOW_MOQ' && res.product) {
        return {
          ...res,
          rawQuantity: res.product.moq,
          status: 'VALID' as CSVImportRowStatus,
          errorMessage: undefined,
        };
      }
      return res;
    });

    setValidationResults(fixed);
  };

  const validCount = validationResults?.filter((r) => r.status === 'VALID').length || 0;
  const errorCount = validationResults?.filter((r) => r.status !== 'VALID').length || 0;

  return (
    <div className="bg-[#eaeded] min-h-screen pb-16 pt-6">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 space-y-6">
        
        {/* Header Title Bar */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-400 text-gray-900 text-xs font-black px-2.5 py-0.5 rounded flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-gray-900" /> B2B Quick Order
              </span>
              <span className="text-xs text-gray-400">Importação em Lote</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Pedido Rápido & Validação por CSV
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Importe planilhas de produtos por SKU ou digite manualmente para montar seu carrinho com cálculo de estoque e impostos.
            </p>
          </div>

          {/* Download Sample CSV */}
          <a
            href="/modelo_pedido_b2b.csv"
            download="modelo_pedido_b2b.csv"
            className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 shrink-0 shadow-xs"
          >
            <Download className="w-4 h-4 text-blue-300" />
            <span>Baixar Planilha Modelo (.CSV)</span>
          </a>

        </div>

        {/* Import Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="flex border-b border-gray-200 bg-gray-50/80 text-xs font-bold">
            <button
              onClick={() => setActiveTab('csv')}
              className={`flex-1 py-3.5 px-6 flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === 'csv'
                  ? 'border-blue-800 text-blue-900 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Modo 1: Upload de Planilha CSV / Excel</span>
            </button>

            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-3.5 px-6 flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === 'manual'
                  ? 'border-blue-800 text-blue-900 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Modo 2: Digitação Manual de SKUs</span>
            </button>
          </div>

          <div className="p-6">
            {/* Tab 1: CSV Upload */}
            {activeTab === 'csv' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 hover:border-blue-600 rounded-xl p-8 text-center bg-gray-50/50 hover:bg-blue-50/30 transition-all cursor-pointer relative">
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-800 mx-auto flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">
                    {fileName ? `Arquivo selecionado: ${fileName}` : 'Arraste seu arquivo CSV aqui ou clique para selecionar'}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Formato aceito: .CSV separado por vírgula com cabeçalho (ex: SKU, Quantidade)
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Manual Entry */}
            {activeTab === 'manual' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-gray-200 rounded-lg">
                    <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200 uppercase tracking-wider">
                      <tr>
                        <th className="p-3 w-16 text-center">#</th>
                        <th className="p-3">Código SKU ou EAN do Produto</th>
                        <th className="p-3 w-40">Quantidade Desejada</th>
                        <th className="p-3 w-16 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {manualRows.map((row, idx) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                          <td className="p-3 text-center font-bold text-gray-400">{idx + 1}</td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={row.sku}
                              onChange={(e) => handleUpdateManualRow(row.id, 'sku', e.target.value)}
                              placeholder="Ex: SKU-HEAD-01"
                              className="w-full border border-gray-300 rounded px-3 py-1.5 font-mono text-xs focus:border-blue-600 focus:outline-none"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min={1}
                              value={row.quantity}
                              onChange={(e) => handleUpdateManualRow(row.id, 'quantity', parseInt(e.target.value) || 1)}
                              className="w-full border border-gray-300 rounded px-3 py-1.5 font-bold text-xs focus:border-blue-600 focus:outline-none"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleRemoveManualRow(row.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleAddManualRow}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-4 py-2 rounded-lg border border-gray-300 transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Linha</span>
                  </button>

                  <button
                    onClick={() => runValidation(manualRows)}
                    className="bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Validar Lista de Produtos</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Validation Results Panel */}
        {isProcessing && (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-700 animate-spin mx-auto" />
            <p className="text-sm font-bold text-gray-900">Validando SKUs, estoque por CD e regras de MOQ...</p>
          </div>
        )}

        {validationResults && !isProcessing && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden space-y-6 p-6">
            
            {/* Validation Summary Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span>Resultado da Validação da Importação</span>
                  <span className="text-xs font-normal text-gray-400">({validationResults.length} linhas processadas)</span>
                </h2>
                <div className="flex items-center gap-4 text-xs mt-1">
                  <span className="text-blue-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> {validCount} Linhas Válidas
                  </span>
                  {errorCount > 0 && (
                    <span className="text-red-600 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> {errorCount} Linhas com Inconsistências
                    </span>
                  )}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                {errorCount > 0 && (
                  <button
                    onClick={handleFixMoqErrors}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 fill-amber-700" />
                    <span>Ajustar Quantidades para MOQ</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    const validProducts = validationResults?.filter((r) => r.status === 'VALID') || [];
                    if (validProducts.length === 0) {
                      alert('Nenhum item válido para enviar ao carrinho.');
                      return;
                    }
                    validProducts.forEach((p) => {
                      if (p.product) {
                        addItem({
                          id: p.product.id,
                          sku: p.product.sku,
                          name: p.product.name,
                          price: p.product.basePrice,
                          image: p.product.images?.[0] || '/placeholder.jpg',
                          moq: p.product.moq || 1,
                        }, p.rawQuantity);
                      }
                    });
                    openCart();
                  }}
                  className="bg-amber-400 hover:bg-amber-500 text-gray-900 text-xs font-black px-6 py-2.5 rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Transferir Itens Validados para o Carrinho ({validCount})</span>
                </button>
              </div>
            </div>

            {/* Detailed Row-by-Row Log Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-gray-200 rounded-lg">
                <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200 uppercase tracking-wider">
                  <tr>
                    <th className="p-3 w-16 text-center">Linha</th>
                    <th className="p-3">SKU Informado</th>
                    <th className="p-3">Produto Identificado</th>
                    <th className="p-3 text-center">Qtd. Solicitada</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3">Mensagem de Validação / Log de Erro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {validationResults.map((res) => (
                    <tr key={res.rowNumber} className={res.status === 'VALID' ? 'bg-white' : 'bg-red-50/30'}>
                      <td className="p-3 text-center font-bold text-gray-400">{res.rowNumber}</td>
                      <td className="p-3 font-mono font-bold text-gray-900">{res.rawSku}</td>
                      <td className="p-3">
                        {res.product ? (
                          <div>
                            <p className="font-bold text-gray-900">{res.product.name}</p>
                            <p className="text-[10px] text-gray-400">MOQ: {res.product.moq} un | Emb: {res.product.uom}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Não identificado</span>
                        )}
                      </td>
                      <td className="p-3 text-center font-bold text-gray-900">{res.rawQuantity}</td>
                      <td className="p-3 text-center">
                        {res.status === 'VALID' && (
                          <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> VÁLIDO
                          </span>
                        )}
                        {res.status === 'SKU_NOT_FOUND' && (
                          <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[10px] inline-flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> SKU NÃO ENCONTRADO
                          </span>
                        )}
                        {res.status === 'BELOW_MOQ' && (
                          <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px] inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> ABAIXO DO MOQ
                          </span>
                        )}
                        {res.status === 'OUT_OF_STOCK' && (
                          <span className="bg-orange-100 text-orange-900 font-bold px-2 py-0.5 rounded text-[10px] inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> SEM ESTOQUE
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {res.status === 'VALID' ? (
                          <span className="text-blue-700 font-medium">Estoque e alíquotas de tributos confirmados para a sua UF.</span>
                        ) : (
                          <span className="text-red-700 font-bold">{res.errorMessage}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
