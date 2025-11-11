import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const categories = await prisma.category.findMany({
          include: {
            _count: {
              select: {
                topics: true
              }
            }
          },
          orderBy: {
            name: 'asc'
          }
        });
        return res.status(200).json(categories);

      case 'POST':
        const { name, description } = req.body;
        
        if (!name) {
          return res.status(400).json({ error: 'Nome da categoria é obrigatório' });
        }

        const existingCategory = await prisma.category.findUnique({
          where: { name }
        });

        if (existingCategory) {
          return res.status(400).json({ error: 'Categoria já existe' });
        }

        const newCategory = await prisma.category.create({
          data: {
            name,
            description: description || ''
          }
        });
        
        return res.status(201).json(newCategory);

      case 'PUT':
        const { id, ...updateData } = req.body;
        
        if (!id) {
          return res.status(400).json({ error: 'ID da categoria é obrigatório' });
        }

        const updatedCategory = await prisma.category.update({
          where: { id },
          data: updateData
        });
        
        return res.status(200).json(updatedCategory);

      case 'DELETE':
        const categoryId = req.query.id as string;
        
        if (!categoryId) {
          return res.status(400).json({ error: 'ID da categoria é obrigatório' });
        }

        const topicsCount = await prisma.topic.count({
          where: { categoryId }
        });

        if (topicsCount > 0) {
          return res.status(400).json({ 
            error: 'Não é possível deletar categoria com tópicos' 
          });
        }

        await prisma.category.delete({
          where: { id: categoryId }
        });
        
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Erro no CRUD de categorias:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    await prisma.$disconnect();
  }
}
