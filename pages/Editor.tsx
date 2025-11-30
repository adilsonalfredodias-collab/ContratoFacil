import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DbService } from '../services/api';
import { CONTRACT_TEMPLATES, PLANS } from '../constants';
import { Save, Download, ArrowLeft, Lock, Upload, Image as ImageIcon, FileText, CheckCircle, Edit3, AlertCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const Editor = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  // States
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'form' | 'preview'>('form');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({}); // State for validation errors
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [saving, setSaving] = useState(false);
  
  const previewRef = useRef<HTMLDivElement>(null);

  // Initial Check: User Limit
  useEffect(() => {
    if (user) {
      const plan = PLANS[user.planType];
      if (user.contractsCreatedThisMonth >= plan.limit) {
        alert(`Você atingiu o limite de contratos do plano ${plan.name} (${plan.limit}). Faça upgrade para continuar.`);
        navigate('/plans');
      }
    }
    // Set current date as default
    setFormData(prev => ({ ...prev, data_atual: new Date().toLocaleDateString('pt-AO', { day: 'numeric', month: 'long', year: 'numeric' }) }));
  }, [user, navigate]);

  const currentTemplate = CONTRACT_TEMPLATES.find(t => t.id === selectedTemplateId);

  // Generate HTML whenever form changes (but only displayed in preview mode)
  useEffect(() => {
    if (currentTemplate) {
      let content = currentTemplate.defaultContent;
      
      // Replace placeholders
      Object.keys(formData).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        content = content.replace(regex, formData[key] || `<span style="background-color: #e2e8f0; padding: 0 4px; color: #64748b;">[${currentTemplate.fields.find(f => f.key === key)?.label || key}]</span>`);
      });

      // Handle data_atual default
      if(!formData.data_atual) {
         const today = new Date().toLocaleDateString('pt-AO', { day: 'numeric', month: 'long', year: 'numeric' });
         content = content.replace(/{{data_atual}}/g, today);
      }

      // Add Logo if exists
      let logoHtml = '';
      if (logoUrl) {
        logoHtml = `<div style="text-align: center; margin-bottom: 20px;"><img src="${logoUrl}" style="max-height: 80px; max-width: 250px;" alt="Logo" /></div>`;
      }

      setPreviewHtml(logoHtml + content);
    }
  }, [formData, currentTemplate, logoUrl]);

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Clear error when user types
    if (formErrors[key]) {
      setFormErrors(prev => ({ ...prev, [key]: false }));
    }
  };

  const validateForm = () => {
    if (!currentTemplate) return false;
    
    const newErrors: Record<string, boolean> = {};
    let isValid = true;
    let firstErrorField = null;

    currentTemplate.fields.forEach(field => {
      // Check if field is optional based on key naming convention
      const isOptional = field.key.toLowerCase().includes('opcional');
      const value = formData[field.key];

      // If not optional and value is empty or just whitespace
      if (!isOptional && (!value || !value.trim())) {
        newErrors[field.key] = true;
        isValid = false;
        if (!firstErrorField) firstErrorField = field.key;
      }
    });

    setFormErrors(newErrors);

    if (!isValid) {
      // Scroll to the first error
      const element = document.getElementById(`field-${firstErrorField}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      alert('Por favor, preencha todos os campos obrigatórios assinalados em vermelho.');
    }

    return isValid;
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user || !currentTemplate) return;
    setSaving(true);
    try {
      await DbService.saveContract({
        userId: user.uid,
        title: `${currentTemplate.name} - ${new Date().toLocaleDateString()}`,
        type: currentTemplate.id,
        content: previewHtml,
        status: 'finalized',
        variables: formData,
        logoUrl: logoUrl || undefined
      });
      await refreshUser();
      navigate('/');
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar contrato. Verifique sua conexão.');
    } finally {
      setSaving(false);
    }
  };

  const exportPDF = async () => {
    if (!previewRef.current) return;
    
    // Temporarily remove shadow for cleaner print
    previewRef.current.style.boxShadow = 'none';
    
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, 
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
      pdf.save(`${currentTemplate?.name || 'contrato'}.pdf`);
    } finally {
      // Restore shadow
      if (previewRef.current) previewRef.current.style.boxShadow = '';
    }
  };

  const exportWord = () => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML to Word</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + previewHtml + footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${currentTemplate?.name || 'contrato'}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  }

  // STEP 1: Template Selection
  if (!selectedTemplateId) {
    return (
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center text-slate-500 hover:text-slate-800">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Dashboard
        </button>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Escolha um Modelo</h1>
        <p className="text-slate-500 mb-8">Selecione um dos nossos modelos profissionais para começar.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {CONTRACT_TEMPLATES.map(template => (
            <div 
              key={template.id} 
              onClick={() => {
                setSelectedTemplateId(template.id);
                setViewMode('form');
                setFormErrors({});
                setFormData({});
              }}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-brand-500 hover:shadow-md cursor-pointer transition-all group flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600 mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <FileText />
              </div>
              <h3 className="font-bold text-lg mb-2">{template.name}</h3>
              <p className="text-slate-500 text-sm flex-1">{template.description}</p>
              <div className="mt-4 pt-4 border-t border-slate-50 text-brand-600 text-sm font-medium flex items-center">
                Selecionar <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto pb-12">
      
      {/* Header / Navigation Bar */}
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-0 z-10">
         <div className="flex items-center gap-4">
           <button 
             onClick={() => {
               if(viewMode === 'preview') {
                 setViewMode('form');
               } else {
                 setSelectedTemplateId('');
                 setFormData({});
                 setFormErrors({});
               }
             }} 
             className="text-slate-500 hover:text-slate-800 transition-colors"
           >
              <ArrowLeft className="w-5 h-5" />
           </button>
           <div>
             <h2 className="font-bold text-slate-800">{currentTemplate?.name}</h2>
             <p className="text-xs text-slate-500">
               {viewMode === 'form' ? 'Passo 1: Preencha os dados' : 'Passo 2: Revise e Exporte'}
             </p>
           </div>
         </div>

         {/* Actions Toolbar - Only Visible in Preview Mode */}
         {viewMode === 'preview' && (
           <div className="flex items-center gap-2">
             <button 
               onClick={() => setViewMode('form')}
               className="hidden md:flex px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg items-center transition-colors"
             >
               <Edit3 className="w-4 h-4 mr-2" /> Editar Dados
             </button>
             
             <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

             <button onClick={exportPDF} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg flex items-center transition-colors">
               <Download className="w-4 h-4 mr-2" /> PDF
             </button>
             
             {user?.planType !== 'free' ? (
               <button onClick={exportWord} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg flex items-center transition-colors">
                 <Download className="w-4 h-4 mr-2" /> Word
               </button>
             ) : (
               <div className="group relative">
                  <button disabled className="px-4 py-2 text-sm text-slate-300 flex items-center cursor-not-allowed">
                    <Download className="w-4 h-4 mr-2" /> Word
                    <Lock className="w-3 h-3 ml-1" />
                  </button>
               </div>
             )}
             
             <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-brand-200 ml-2"
             >
               {saving ? 'Salvando...' : (
                 <>
                   <Save className="w-4 h-4 mr-2" /> Salvar Contrato
                 </>
               )}
             </button>
           </div>
         )}
      </div>

      {/* STEP 2: Input Form */}
      {viewMode === 'form' && (
        <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-8">
             
             {/* Logo Section */}
             <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <h3 className="font-semibold mb-2 text-slate-700 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-brand-600" /> Logótipo da Empresa (Opcional)
                </h3>
                <p className="text-xs text-slate-500 mb-4">Adicione sua marca para dar mais profissionalismo ao documento.</p>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm border border-slate-300 shadow-sm flex items-center transition-colors">
                    <Upload className="w-4 h-4 mr-2" /> {logoUrl ? 'Trocar Imagem' : 'Carregar Logótipo'}
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  {logoUrl && (
                    <div className="relative group">
                      <img src={logoUrl} alt="Logo Preview" className="h-12 object-contain border rounded bg-white p-1" />
                      <button 
                        onClick={() => setLogoUrl(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-xs w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
             </div>

             <hr className="border-slate-100 my-6" />

             {/* Dynamic Fields */}
             <h3 className="font-semibold mb-6 text-xl text-slate-800">Preencha os dados do Contrato</h3>
             <div className="space-y-5">
               {currentTemplate?.fields.map(field => {
                 const isError = formErrors[field.key];
                 return (
                   <div key={field.key} id={`field-${field.key}`}>
                     <label className={`block text-sm font-semibold mb-1.5 ${isError ? 'text-red-600' : 'text-slate-700'}`}>
                       {field.label}
                       {field.key.includes('opcional') ? <span className="text-slate-400 font-normal ml-1">(Opcional)</span> : <span className="text-red-500 ml-1">*</span>}
                     </label>
                     {field.type === 'textarea' ? (
                       <textarea 
                        className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800 transition-shadow shadow-sm placeholder:text-slate-400 ${isError ? 'border-red-500 ring-1 ring-red-100' : 'border-slate-300'}`}
                        rows={4}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        placeholder={field.placeholder || 'Digite aqui...'}
                       />
                     ) : (
                       <input 
                        type={field.type}
                        className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800 transition-shadow shadow-sm placeholder:text-slate-400 ${isError ? 'border-red-500 ring-1 ring-red-100' : 'border-slate-300'}`}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        placeholder={field.placeholder || 'Digite aqui...'}
                       />
                     )}
                     {isError && (
                       <p className="text-xs text-red-500 mt-1 flex items-center">
                         <AlertCircle className="w-3 h-3 mr-1" /> Campo obrigatório
                       </p>
                     )}
                   </div>
                 );
               })}
             </div>

             <div className="mt-8 pt-6 border-t border-slate-100">
               <button 
                 onClick={() => {
                   if (validateForm()) {
                     window.scrollTo(0,0);
                     setViewMode('preview');
                   }
                 }}
                 className="w-full bg-brand-600 hover:bg-brand-700 text-white text-lg font-semibold py-4 rounded-xl shadow-lg shadow-brand-200 transition-all transform active:scale-[0.99] flex items-center justify-center"
               >
                 <CheckCircle className="w-6 h-6 mr-2" /> Gerar Minuta do Contrato
               </button>
             </div>
          </div>
        </div>
      )}

      {/* STEP 3: Preview */}
      {viewMode === 'preview' && (
        <div className="flex justify-center bg-slate-200/50 rounded-xl p-8 border border-slate-200 shadow-inner min-h-[800px] animate-in fade-in zoom-in-95 duration-300">
          <div 
            ref={previewRef}
            className="a4-paper shadow-2xl transition-transform" 
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      )}
    </div>
  );
};