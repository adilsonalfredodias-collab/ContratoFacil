import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Mail, Lock, User } from 'lucide-react';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        navigate('/');
      } else {
        await register(email, password, name);
        // If registration is successful without throwing CONFIRM_EMAIL, we might be auto-logged in or need to prompt login
        // But usually AuthContext handles the redirect if user state changes.
        // If specific logic for email confirmation is triggered in AuthContext, it throws an error we catch below.
        navigate('/');
      }
    } catch (err: any) {
      if (err.message === 'CONFIRM_EMAIL') {
        setSuccessMsg('Conta criada com sucesso! Por favor, verifique seu email para confirmar o cadastro antes de entrar.');
        setIsLogin(true); // Switch back to login view
        setPassword('');
      } else {
        setError(err.message || 'Ocorreu um erro ao processar sua solicitação.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 text-brand-600 mb-2">
          <FileText className="w-10 h-10" />
          <h1 className="text-3xl font-bold text-slate-900">ContratoFácil</h1>
        </div>
        <p className="text-slate-500">Geração inteligente de contratos jurídicos</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-2 text-center">
          {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h2>
        <p className="text-center text-slate-500 text-sm mb-6">
          {isLogin ? 'Insira seus dados para acessar o painel' : 'Preencha os dados abaixo para começar'}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 border border-red-100">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4 border border-green-100">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  placeholder="Seu Nome"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                placeholder="seu@email.com"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                placeholder="••••••••"
                minLength={6}
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition-all transform active:scale-95 shadow-md shadow-brand-100 mt-2"
          >
            {loading ? 'Processando...' : (isLogin ? 'Entrar na Plataforma' : 'Criar Conta Grátis')}
          </button>
        </form>

        <div className="mt-6 text-center pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-500 mb-2">
            {isLogin ? 'Ainda não tem conta?' : 'Já possui cadastro?'}
          </p>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccessMsg('');
            }}
            className="text-brand-600 hover:text-brand-700 font-bold hover:underline"
          >
            {isLogin ? 'Registar-se agora' : 'Fazer Login'}
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} ContratoFácil. Todos os direitos reservados.</p>
      </div>
    </div>
  );
};