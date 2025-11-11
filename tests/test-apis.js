const http = require('http');

const tests = {
  users: [],
  categories: [],
  topics: [],
  posts: [],
  results: []
};

function makeRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode === 204) {
            resolve({ status: res.statusCode });
          } else {
            resolve(JSON.parse(data));
          }
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function testCRUD() {
  console.log('🧪 TESTANDO APIs DO FÓRUM ACADÊMICO\n');
  
  try {
    // 1. CRIAR USUÁRIO
    console.log('📋 Testando CRUD de Usuários...');
    const user = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/users',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      name: 'Teste API',
      email: 'teste.api@forum.com',
      password: 'senha123'
    });
    
    if (user.id) {
      tests.users.push(user);
      console.log('  ✅ CREATE: Usuário criado');
      tests.results.push({ test: 'User CREATE', status: 'PASS' });
    } else {
      console.log('  ❌ CREATE: Falha ao criar usuário');
      tests.results.push({ test: 'User CREATE', status: 'FAIL' });
    }
    
    // 2. CRIAR CATEGORIA
    console.log('\n📋 Testando CRUD de Categorias...');
    const category = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/categories',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      name: 'Categoria Teste API',
      description: 'Teste via API'
    });
    
    if (category.id) {
      tests.categories.push(category);
      console.log('  ✅ CREATE: Categoria criada');
      tests.results.push({ test: 'Category CREATE', status: 'PASS' });
    } else {
      console.log('  ❌ CREATE: Falha ao criar categoria');
      tests.results.push({ test: 'Category CREATE', status: 'FAIL' });
    }
    
    // 3. CRIAR TÓPICO
    if (user.id && category.id) {
      console.log('\n📋 Testando CRUD de Tópicos...');
      const topic = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/topics',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        title: 'Tópico Teste API',
        content: 'Conteúdo de teste',
        authorId: user.id,
        categoryId: category.id
      });
      
      if (topic.id) {
        tests.topics.push(topic);
        console.log('  ✅ CREATE: Tópico criado');
        tests.results.push({ test: 'Topic CREATE', status: 'PASS' });
        
        // 4. CRIAR POST
        console.log('\n📋 Testando CRUD de Posts...');
        const post = await makeRequest({
          hostname: 'localhost',
          port: 3000,
          path: '/api/posts',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }, {
          content: 'Post de teste via API',
          topicId: topic.id,
          authorId: user.id
        });
        
        if (post.id) {
          tests.posts.push(post);
          console.log('  ✅ CREATE: Post criado');
          tests.results.push({ test: 'Post CREATE', status: 'PASS' });
        } else {
          console.log('  ❌ CREATE: Falha ao criar post');
          tests.results.push({ test: 'Post CREATE', status: 'FAIL' });
        }
      } else {
        console.log('  ❌ CREATE: Falha ao criar tópico');
        tests.results.push({ test: 'Topic CREATE', status: 'FAIL' });
      }
    }
    
    // LISTAR TODOS
    console.log('\n📋 Testando listagens (READ)...');
    
    const allUsers = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/users',
      method: 'GET'
    });
    console.log(`  ✅ READ: ${allUsers.length} usuários listados`);
    tests.results.push({ test: 'Users READ', status: 'PASS' });
    
    const allCategories = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/categories',
      method: 'GET'
    });
    console.log(`  ✅ READ: ${allCategories.length} categorias listadas`);
    tests.results.push({ test: 'Categories READ', status: 'PASS' });
    
    const allTopics = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/topics',
      method: 'GET'
    });
    console.log(`  ✅ READ: ${allTopics.length} tópicos listados`);
    tests.results.push({ test: 'Topics READ', status: 'PASS' });
    
    const allPosts = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/posts',
      method: 'GET'
    });
    console.log(`  ✅ READ: ${allPosts.length} posts listados`);
    tests.results.push({ test: 'Posts READ', status: 'PASS' });
    
    // RELATÓRIO
    console.log('\n' + '='.repeat(50));
    console.log('📊 RELATÓRIO DE TESTES');
    console.log('='.repeat(50));
    
    const passed = tests.results.filter(r => r.status === 'PASS').length;
    const failed = tests.results.filter(r => r.status === 'FAIL').length;
    
    console.log(`Total de testes: ${tests.results.length}`);
    console.log(`✅ Passou: ${passed}`);
    console.log(`❌ Falhou: ${failed}`);
    console.log(`Taxa de sucesso: ${((passed / tests.results.length) * 100).toFixed(1)}%`);
    
    console.log('\nDetalhes:');
    tests.results.forEach(r => {
      const icon = r.status === 'PASS' ? '✅' : '❌';
      console.log(`  ${icon} ${r.test}: ${r.status}`);
    });
    
  } catch (error) {
    console.error('\n❌ Erro durante os testes:', error.message);
  }
}

// Executar testes
testCRUD();
