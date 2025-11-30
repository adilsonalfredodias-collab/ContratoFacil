import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  CreditCard, 
  X,
  Plus,
  BookOpen,
  ExternalLink,
  Mail,
  Phone
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
    return (
      <Link
        to={to}
        className={`flex items-center px-4 py-3 mb-1 rounded-lg transition-colors ${
          isActive 
            ? 'bg-brand-50 text-brand-700 font-medium' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
        {label}
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="px-6 py-6 border-b border-slate-100">
            <div className="flex items-center gap-2 text-brand-600">
              <FileText className="w-8 h-8" />
              <span className="text-xl font-bold text-slate-900">ContratoFácil</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/editor" icon={Plus} label="Novo Contrato" />
            <NavItem to="/plans" icon={CreditCard} label="Meus Planos" />
            <NavItem to="/blog" icon={BookOpen} label="Blog & Dicas" />
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold">
                {user?.displayName?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{user?.displayName}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.planType} Plan</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header (Mobile Only) */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
          <div className="flex items-center gap-2 text-brand-600">
            <FileText className="w-6 h-6" />
            <span className="font-bold text-slate-900">ContratoFácil</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600">
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-auto flex flex-col">
          <div className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8">
            {children}
          </div>

          {/* Professional Dark Footer */}
          <footer className="bg-slate-900 text-slate-300 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                
                {/* Column 1: About */}
                <div>
                   <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                     <FileText className="w-5 h-5 text-brand-400" /> ContratoFácil
                   </h3>
                   <p className="text-sm leading-relaxed text-slate-400">
                     Plataforma líder em Angola para geração automatizada de documentos jurídicos. 
                     Simplificamos a burocracia para freelancers e empresas.
                   </p>
                </div>

                {/* Column 2: Developer Credits */}
                <div>
                  <h3 className="text-white text-lg font-bold mb-4">Análise & Desenvolvimento</h3>
                  <div className="space-y-2">
                    <p className="font-semibold text-white">Adilson Alfredo Adão Dias</p>
                    <p className="text-sm text-slate-400">Gestor de Informação e Analista de Dados</p>
                    <p className="text-sm text-slate-400">Luanda, Angola</p>
                    <a 
                      href="https://adilson-dias-portfolio.lovable.app/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-brand-400 hover:text-brand-300 text-sm font-medium mt-2 transition-colors"
                    >
                      Ver Portfólio <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>

                {/* Column 3: Contact */}
                <div>
                  <h3 className="text-white text-lg font-bold mb-4">Contactos</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span>adilsonalfredodias@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <span>(+244) 927 719 016</span>
                    </div>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-xs mt-2 transition-colors flex items-center w-fit">
                      Contactar via WhatsApp
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500">
                <p>&copy; {new Date().getFullYear()} Adilson Alfredo Adão Dias. Todos os direitos reservados. Dashboard desenvolvido para análise e gestão de contratos.</p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};