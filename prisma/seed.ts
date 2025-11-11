import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Criar usuário admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@forum.com',
      name: 'Administrador',
      password: adminPassword,
      role: 'ADMIN'
    }
  });

  // Criar usuário comum
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'user@forum.com',
      name: 'Usuário Teste',
      password: userPassword,
      role: 'USER'
    }
  });

  // Criar categorias
  const categoria1 = await prisma.category.create({
    data: {
      name: 'Programação',
      description: 'Discussões sobre programação e desenvolvimento'
    }
  });

  const categoria2 = await prisma.category.create({
    data: {
      name: 'Banco de Dados',
      description: 'Tópicos sobre bancos de dados e SQL'
    }
  });

  const categoria3 = await prisma.category.create({
    data: {
      name: 'DevOps',
      description: 'CI/CD, Docker, Kubernetes e mais'
    }
  });

  // Criar tópicos
  const topico1 = await prisma.topic.create({
    data: {
      title: 'Como começar com TypeScript?',
      content: 'Olá pessoal, estou começando com TypeScript e gostaria de dicas',
      authorId: user.id,
      categoryId: categoria1.id
    }
  });

  const topico2 = await prisma.topic.create({
    data: {
      title: 'Diferenças entre SQL e NoSQL',
      content: 'Quais são as principais diferenças e quando usar cada um?',
      authorId: admin.id,
      categoryId: categoria2.id
    }
  });

  // Criar posts
  await prisma.post.create({
    data: {
      content: 'TypeScript é JavaScript com tipos. Comece instalando com npm install typescript',
      authorId: admin.id,
      topicId: topico1.id
    }
  });

  await prisma.post.create({
    data: {
      content: 'Recomendo o curso da Microsoft sobre TypeScript, é gratuito!',
      authorId: user.id,
      topicId: topico1.id
    }
  });

  console.log('✅ Seed executado com sucesso!');
  console.log('📧 Usuários criados:');
  console.log('   - admin@forum.com (senha: admin123)');
  console.log('   - user@forum.com (senha: user123)');
  console.log('📁 Categorias criadas: 3');
  console.log('💬 Tópicos criados: 2');
  console.log('📝 Posts criados: 2');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
