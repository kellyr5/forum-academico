import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const { categoryId, authorId } = req.query;
        
        const where: any = {};
        if (categoryId) where.categoryId = categoryId;
        if (authorId) where.authorId = authorId;

        const topics = await prisma.topic.findMany({
          where,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            category: true,
            _count: {
              select: {
                posts: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
        return res.status(200).json(topics);
      }

      case 'POST': {
        const { title, content, categoryId, authorId } = req.body;
        
        if (!title || !content || !categoryId || !authorId) {
          return res.status(400).json({ 
            error: 'Título, conteúdo, categoria e autor são obrigatórios' 
          });
        }

        const newTopic = await prisma.topic.create({
          data: {
            title,
            content,
            categoryId,
            authorId
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            category: true
          }
        });
        
        return res.status(201).json(newTopic);
      }

      case 'PUT': {
        const { id, ...updateData } = req.body;
        
        if (!id) {
          return res.status(400).json({ error: 'ID do tópico é obrigatório' });
        }

        const updatedTopic = await prisma.topic.update({
          where: { id },
          data: {
            ...updateData,
            updatedAt: new Date()
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            category: true
          }
        });
        
        return res.status(200).json(updatedTopic);
      }

      case 'DELETE': {
        const topicId = req.query.id as string;
        
        if (!topicId) {
          return res.status(400).json({ error: 'ID do tópico é obrigatório' });
        }

        await prisma.post.deleteMany({
          where: { topicId }
        });

        await prisma.topic.delete({
          where: { id: topicId }
        });
        
        return res.status(204).end();
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Erro no CRUD de tópicos:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    await prisma.$disconnect();
  }
}
