import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BLOG_POSTS } from '../constants';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

export const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = BLOG_POSTS.find(p => p.id === id);

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">Artigo não encontrado</h2>
        <Link to="/blog" className="text-brand-600 hover:underline mt-4 inline-block">Voltar para o Blog</Link>
      </div>
    );
  }

  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(`Confira este artigo: ${post.title}`);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate('/blog')} className="mb-6 flex items-center text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o Blog
      </button>

      <article className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-64 md:h-96 bg-slate-100 relative">
          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white text-shadow">{post.title}</h1>
          </div>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 mb-8 gap-4">
            <div className="flex items-center text-sm text-slate-500 space-x-6">
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {post.date}</span>
              <span className="flex items-center"><User className="w-4 h-4 mr-2" /> {post.author}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm font-semibold text-slate-700 flex items-center"><Share2 className="w-4 h-4 mr-2" /> Partilhar:</span>
              <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors">Facebook</a>
              <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="bg-blue-800 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-900 transition-colors">LinkedIn</a>
              <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-600 transition-colors">WhatsApp</a>
            </div>
          </div>

          <div className="prose prose-slate max-w-none lg:prose-lg" dangerouslySetInnerHTML={{ __html: post.content }} />
          
          <div className="mt-12 pt-8 border-t border-slate-100 bg-slate-50 -mx-8 -mb-8 p-8 text-center">
            <h3 className="font-bold text-slate-900 text-lg mb-2">Gostou deste artigo?</h3>
            <p className="text-slate-600 mb-4">Crie agora mesmo seus contratos com segurança jurídica.</p>
            <Link to="/editor" className="inline-block bg-brand-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200">
              Criar Contrato Grátis
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};