import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const { topicId, authorId } = req.query;
        
        const where: any = {};
        if (topicId) where.topicId = topicId;
        if (authorId) where.authorId = authorId;

        const posts = await prisma.post.findMany({
          where,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            topic: {
              select: {
                id: true,
                title: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        });
        return res.status(200).json(posts);
      }

      case 'POST': {
        const { content, topicId, authorId } = req.body;
        
        if (!content || !topicId || !authorId) {
          return res.status(400).json({ 
            error: 'Conteúdo, tópico e autor são obrigatórios' 
          });
        }

        const newPost = await prisma.post.create({
          data: {
            content,
            topicId,
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
            topic: {
              select: {
                id: true,
                title: true
              }
            }
          }
        });

        await prisma.topic.update({
          where: { id: topicId },
          data: { updatedAt: new Date() }
        });
        
        return res.status(201).json(newPost);
      }

      case 'PUT': {
        const { id, content } = req.body;
        
        if (!id || !content) {
          return res.status(400).json({ 
            error: 'ID e conteúdo são obrigatórios' 
          });
        }

        const updatedPost = await prisma.post.update({
          where: { id },
          data: {
            content,
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
            topic: {
              select: {
                id: true,
                title: true
              }
            }
          }
        });
        
        return res.status(200).json(updatedPost);
      }

      case 'DELETE': {
        const postId = req.query.id as string;
        
        if (!postId) {
          return res.status(400).json({ error: 'ID do post é obrigatório' });
        }

        await prisma.post.delete({
          where: { id: postId }
        });
        
        return res.status(204).end();
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Erro no CRUD de posts:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    await prisma.$disconnect();
  }
}
