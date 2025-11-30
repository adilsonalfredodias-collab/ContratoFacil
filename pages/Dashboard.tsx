import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DbService } from '../services/api';
import { Contract, PlanType } from '../types';
import { PLANS } from '../constants';
import { FileText, Download, Trash2, Plus, Activity, AlertCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          const data = await DbService.getContracts(user.uid);
          setContracts(data);
        } catch (error) {
          console.error("Erro ao carregar contratos:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
    refreshUser(); // Ensure limit counters are fresh
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este contrato?')) {
      await DbService.deleteContract(id);
      setContracts(contracts.filter(c => c.id !== id));
    }
  };

  const handleDownloadPDF = async (contract: Contract) => {
    // Create a temporary container to render the HTML for PDF generation
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `<div class="a4-paper" style="transform: none;">${contract.content}</div>`;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    document.body.appendChild(tempDiv);

    try {
      const canvas = await html2canvas(tempDiv.firstChild as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${contract.title.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('Error generating PDF', err);
      alert('Erro ao gerar PDF.');
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center"><Activity className="animate-spin text-brand-600" /></div>;

  const plan = PLANS[user?.planType || 'free'];
  const usagePercent = Math.min(100, ((user?.contractsCreatedThisMonth || 0) / plan.limit) * 100);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Painel de Controle</h1>
          <p className="text-slate-500">Bem-vindo de volta, {user?.displayName}</p>
        </div>
        <Link 
          to="/editor" 
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Contrato
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Usage Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase">Contratos (Mês)</h3>
            <FileText className="text-brand-500" />
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-slate-900">{user?.contractsCreatedThisMonth}</span>
            <span className="text-sm text-slate-500 mb-1">/ {plan.limit}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${usagePercent > 90 ? 'bg-red-500' : 'bg-brand-500'}`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          {usagePercent >= 100 && (
             <p className="text-xs text-red-600 mt-2 flex items-center">
               <AlertCircle className="w-3 h-3 mr-1"/> Limite atingido
             </p>
          )}
        </div>

        {/* Plan Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase">Plano Atual</h3>
            <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2 py-1 rounded uppercase">
              {plan.name}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-4">
             Você tem acesso a recursos {user?.planType === 'free' ? 'básicos' : user?.planType === 'premium' ? 'intermediários' : 'avançados'}.
          </p>
          {user?.planType !== 'gold' && (
            <Link to="/plans" className="text-sm text-brand-600 font-semibold hover:underline">
              Fazer Upgrade &rarr;
            </Link>
          )}
        </div>

        {/* Quick Tip */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-sm text-white">
           <h3 className="font-semibold mb-2">Precisa de ajuda?</h3>
           <p className="text-sm text-slate-300 mb-4">
             Nossos modelos são revisados juridicamente. Escolha o modelo correto para garantir validade legal.
           </p>
        </div>
      </div>

      {/* Recent Contracts List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Contratos Recentes</h3>
        </div>
        {contracts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>Você ainda não criou nenhum contrato.</p>
            <Link to="/editor" className="text-brand-600 hover:underline mt-2 inline-block">Criar o primeiro</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-3">Título</th>
                  <th className="px-6 py-3">Data</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{contract.title}</td>
                    <td className="px-6 py-4">{new Date(contract.createdAt).toLocaleDateString('pt-AO')}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {contract.status === 'finalized' ? 'Finalizado' : 'Rascunho'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                       <button 
                        onClick={() => handleDownloadPDF(contract)}
                        className="text-slate-400 hover:text-brand-600 transition-colors"
                        title="Baixar PDF"
                       >
                         <Download className="w-5 h-5" />
                       </button>
                       <button 
                        onClick={() => handleDelete(contract.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                        title="Excluir"
                       >
                         <Trash2 className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};