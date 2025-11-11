import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const users = await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                topics: true,
                posts: true
              }
            }
          }
        });
        return res.status(200).json(users);

      case 'POST':
        const { name, email, password, role = 'USER' } = req.body;
        
        if (!name || !email || !password) {
          return res.status(400).json({ error: 'Campos obrigatórios faltando' });
        }

        const existingUser = await prisma.user.findUnique({
          where: { email }
        });

        if (existingUser) {
          return res.status(400).json({ error: 'Email já cadastrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          }
        });
        
        return res.status(201).json(newUser);

      case 'PUT':
        const { id, ...updateData } = req.body;
        
        if (!id) {
          return res.status(400).json({ error: 'ID do usuário é obrigatório' });
        }

        if (updateData.password) {
          updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const updatedUser = await prisma.user.update({
          where: { id },
          data: updateData,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            updatedAt: true
          }
        });
        
        return res.status(200).json(updatedUser);

      case 'DELETE':
        const userId = req.query.id as string;
        
        if (!userId) {
          return res.status(400).json({ error: 'ID do usuário é obrigatório' });
        }

        await prisma.user.delete({
          where: { id: userId }
        });
        
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Erro no CRUD de usuários:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    await prisma.$disconnect();
  }
}
