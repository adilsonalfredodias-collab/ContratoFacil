import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DbService } from '../services/api';
import { PLANS } from '../constants';
import { Check, Star, Upload, X, Loader2, Copy, Lock } from 'lucide-react';
import { PlanType } from '../types';

export const Pricing = () => {
  const { user, refreshUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'reference' | 'transfer'>('reference');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);

  const openPaymentModal = (planId: PlanType) => {
    // Logic to block paid plans temporarily as requested
    if (planId !== 'free') {
      alert('Este plano estará disponível em breve. Estamos finalizando a integração bancária.');
      return;
    }

    setSelectedPlan(planId);
    setIsModalOpen(true);
    setPaymentProof(null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleConfirmPayment = async () => {
    if (!user || !selectedPlan) return;
    
    setProcessing(true);
    
    try {
      if (paymentProof) {
          await DbService.uploadPaymentProof(paymentProof);
      }
      await DbService.updateUserPlan(user.uid, selectedPlan);
      await refreshUser();
      setIsModalOpen(false);
      alert(`Pagamento confirmado! Upgrade para ${PLANS[selectedPlan].name} realizado com sucesso.`);
    } catch (e) {
      console.error(e);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setProcessing(false);
      setSelectedPlan(null);
    }
  };

  const planDetails = selectedPlan ? PLANS[selectedPlan] : null;

  return (
    <div className="max-w-5xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Escolha o plano ideal para seu negócio</h1>
        <p className="text-slate-500">Crie contratos profissionais em minutos. Cancele quando quiser.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {Object.values(PLANS).map((plan) => {
          const isCurrent = user?.planType === plan.id;
          const isGold = plan.id === 'gold';
          const isPaid = plan.id !== 'free';

          return (
            <div 
              key={plan.id} 
              className={`
                relative bg-white rounded-2xl shadow-xl p-8 border 
                ${isGold ? 'border-yellow-400 ring-2 ring-yellow-100' : 'border-slate-200'}
                flex flex-col
              `}
            >
              {isGold && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Mais Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline">
                   <span className="text-3xl font-bold text-slate-900">{plan.price.toLocaleString('pt-AO')}</span>
                   <span className="text-sm text-slate-500 ml-1">Kz/mês</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-slate-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => openPaymentModal(plan.id as PlanType)}
                disabled={isCurrent || isPaid}
                className={`
                  w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center
                  ${isCurrent 
                    ? 'bg-slate-100 text-slate-400 cursor-default'
                    : isPaid
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-75' 
                      : 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-200'
                  }
                `}
              >
                {isCurrent 
                  ? 'Plano Atual' 
                  : isPaid 
                    ? 'Indisponível (Brevemente)' 
                    : 'Selecionar Plano'
                }
                {isPaid && !isCurrent && <Lock className="w-4 h-4 ml-2" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment Modal */}
      {isModalOpen && planDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Upgrade para {planDetails.name}</h3>
                <p className="text-sm text-slate-500">Valor a pagar: <span className="font-bold text-brand-600">{planDetails.price.toLocaleString('pt-AO')} Kz</span></p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Payment Methods Tabs */}
              <div className="flex gap-4 mb-6 p-1 bg-slate-100 rounded-lg">
                <button 
                  onClick={() => setPaymentMethod('reference')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${paymentMethod === 'reference' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Referência Multicaixa
                </button>
                <button 
                  onClick={() => setPaymentMethod('transfer')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${paymentMethod === 'transfer' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Transferência Bancária
                </button>
              </div>

              {/* Reference Content */}
              {paymentMethod === 'reference' && (
                <div className="bg-brand-50 border border-brand-100 rounded-xl p-5 mb-6 space-y-3">
                   <div className="flex justify-between items-center">
                     <span className="text-sm text-slate-500">Entidade:</span>
                     <div className="flex items-center gap-2">
                       <span className="font-mono font-bold text-slate-800">00123</span>
                       <button onClick={() => handleCopy('00123')}><Copy className="w-4 h-4 text-brand-400 hover:text-brand-600" /></button>
                     </div>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-sm text-slate-500">Referência:</span>
                     <div className="flex items-center gap-2">
                       <span className="font-mono font-bold text-slate-800">998 881 234</span>
                       <button onClick={() => handleCopy('998881234')}><Copy className="w-4 h-4 text-brand-400 hover:text-brand-600" /></button>
                     </div>
                   </div>
                   <div className="flex justify-between items-center pt-2 border-t border-brand-100">
                     <span className="text-sm text-slate-500">Montante:</span>
                     <span className="font-bold text-brand-700 text-lg">{planDetails.price.toLocaleString('pt-AO')} Kz</span>
                   </div>
                </div>
              )}

              {/* Transfer Content */}
              {paymentMethod === 'transfer' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 space-y-3">
                   <div>
                     <span className="text-xs text-slate-500 uppercase font-bold">Banco BAI</span>
                     <div className="flex items-center justify-between mt-1">
                       <span className="font-mono text-sm text-slate-800 break-all">AO06 0040 0000 1234 5678 9012 3</span>
                       <button onClick={() => handleCopy('AO06004000001234567890123')}><Copy className="w-4 h-4 text-brand-400 hover:text-brand-600 ml-2" /></button>
                     </div>
                   </div>
                   <div>
                     <span className="text-xs text-slate-500 uppercase font-bold">Beneficiário</span>
                     <p className="text-sm text-slate-800">Tordil Lab - Comércio e Serviços</p>
                   </div>
                </div>
              )}

              {/* Proof Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Comprovativo de Pagamento</label>
                <div className="flex items-center justify-center w-full">
                  <label className={`
                    flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors
                    ${paymentProof ? 'border-brand-300 bg-brand-50' : 'border-slate-300 bg-white'}
                  `}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {paymentProof ? (
                        <>
                          <Check className="w-8 h-8 text-brand-500 mb-2" />
                          <p className="text-sm text-brand-700 font-medium">{paymentProof.name}</p>
                          <p className="text-xs text-brand-500">Clique para alterar</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-slate-400 mb-2" />
                          <p className="text-sm text-slate-500"><span className="font-semibold">Clique para carregar</span> ou arraste</p>
                          <p className="text-xs text-slate-400">PDF, PNG ou JPG (MAX. 2MB)</p>
                        </>
                      )}
                    </div>
                    <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange} />
                  </label>
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmPayment}
                disabled={!paymentProof || processing}
                className="bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processando...
                  </>
                ) : (
                  'Confirmar Pagamento'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};