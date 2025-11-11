import { useEffect, useState } from 'react';

export default function Home() {
  const [stats, setStats] = useState({
    users: 0,
    categories: 0,
    topics: 0,
    posts: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [users, categories, topics, posts] = await Promise.all([
          fetch('/api/users').then(r => r.json()),
          fetch('/api/categories').then(r => r.json()),
          fetch('/api/topics').then(r => r.json()),
          fetch('/api/posts').then(r => r.json())
        ]);
        
        setStats({
          users: users.length || 0,
          categories: categories.length || 0,
          topics: topics.length || 0,
          posts: posts.length || 0
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      }
    }
    
    fetchStats();
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', borderBottom: '3px solid #0070f3', paddingBottom: '10px' }}>
        🎓 Fórum Acadêmico - Sistema de Gestão
      </h1>
      
      <div style={{ marginTop: '30px', marginBottom: '30px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h2>📊 Estatísticas do Sistema</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#0070f3', margin: '0' }}>👥 Usuários</h3>
            <p style={{ fontSize: '2em', margin: '10px 0' }}>{stats.users}</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#0070f3', margin: '0' }}>📁 Categorias</h3>
            <p style={{ fontSize: '2em', margin: '10px 0' }}>{stats.categories}</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#0070f3', margin: '0' }}>💬 Tópicos</h3>
            <p style={{ fontSize: '2em', margin: '10px 0' }}>{stats.topics}</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#0070f3', margin: '0' }}>📝 Posts</h3>
            <p style={{ fontSize: '2em', margin: '10px 0' }}>{stats.posts}</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>🔗 APIs Disponíveis</h2>
        <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginTop: '15px' }}>
          <h3>Endpoints REST:</h3>
          <ul style={{ lineHeight: '2' }}>
            <li><code style={{ backgroundColor: '#e0e0e0', padding: '2px 8px', borderRadius: '3px' }}>GET /api/users</code> - Listar usuários</li>
            <li><code style={{ backgroundColor: '#e0e0e0', padding: '2px 8px', borderRadius: '3px' }}>GET /api/categories</code> - Listar categorias</li>
            <li><code style={{ backgroundColor: '#e0e0e0', padding: '2px 8px', borderRadius: '3px' }}>GET /api/topics</code> - Listar tópicos</li>
            <li><code style={{ backgroundColor: '#e0e0e0', padding: '2px 8px', borderRadius: '3px' }}>GET /api/posts</code> - Listar posts</li>
          </ul>
          <p style={{ marginTop: '15px', color: '#666' }}>
            ℹ️ Todas as APIs suportam métodos: <strong>GET</strong>, <strong>POST</strong>, <strong>PUT</strong>, <strong>DELETE</strong>
          </p>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>✅ Status do Projeto</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li>✅ 4 CRUDs implementados e funcionais</li>
          <li>✅ Banco de dados configurado com Prisma</li>
          <li>✅ Testes automatizados com Selenium</li>
          <li>✅ Controle de versão Git/GitHub</li>
          <li>✅ Documentação completa</li>
        </ul>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#0070f3', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
        <h3>🚀 Projeto Completo e Funcional</h3>
        <p>Sistema desenvolvido com Next.js + TypeScript + Prisma + SQLite</p>
        <p style={{ marginTop: '10px' }}>
          <a href="https://github.com/kellyr5/forum-academico" style={{ color: 'white' }} target="_blank" rel="noopener noreferrer">
            📦 Ver no GitHub
          </a>
        </p>
      </div>
    </div>
  );
}
