import React from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../constants';
import { Calendar, User, ArrowRight } from 'lucide-react';

export const Blog = () => {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Blog & Dicas Jurídicas</h1>
        <p className="text-slate-500 text-lg">Artigos especializados sobre legislação angolana, gestão de contratos e boas práticas comerciais.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {BLOG_POSTS.map(post => (
          <div key={post.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="h-48 overflow-hidden bg-slate-100">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center text-xs text-slate-400 mb-3 space-x-4">
                <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {post.date}</span>
                <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {post.author}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">
                <Link to={`/blog/${post.id}`} className="hover:text-brand-600 transition-colors">
                  {post.title}
                </Link>
              </h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
              <Link 
                to={`/blog/${post.id}`}
                className="inline-flex items-center text-brand-600 font-semibold hover:text-brand-700"
              >
                Ler artigo completo <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};