// src/routes/messages.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();


router.get('/', async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      include: {
        sender: { select: { name: true, email: true } },
        receiver: { select: { name: true, email: true } },
        project: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
// Envoyer un message
router.post('/send', async (req, res) => {
  try {
    const { receiverId, content, subject, projectId } = req.body;
    
     console.log('📨 Message reçu:', {
      receiverId,
      subject, 
      content,
      projectId,
      timestamp: new Date().toISOString()
     });
    const message = await prisma.message.create({
      data: {
        content,
        subject: subject || 'Nouveau message',
        senderId: req.user?.id || 1, // À adapter avec l'auth réelle
        receiverId: parseInt(receiverId),
        projectId: projectId ? parseInt(projectId) : null,
      },
      include: {
        sender: { select: { name: true, email: true, company: true } },
        receiver: { select: { name: true, email: true } },
        project: { select: { title: true } }
      }
    });

     console.log('✅ Message sauvegardé en base avec ID:', message.id);
    
    // Créer une notification
    await prisma.notification.create({
      data: {
        type: 'MESSAGE',
        title: 'Nouveau message',
        message: `Vous avez reçu un message de ${message.sender.name}`,
        userId: parseInt(receiverId),
        entityType: 'message',
        entityId: message.id
      }
    });
    
    res.json({ 
      success: true, 
      message: 'Message envoyé avec succès',
      data: message 
    });
    
  } catch (error) {
    console.error('Erreur envoi message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Récupérer les messages d'une conversation
router.get('/conversation/:userId', async (req, res) => {
  try {
    const currentUserId = req.user?.id || 1; // À adapter
    const otherUserId = parseInt(req.params.userId);
    
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId }
        ]
      },
      include: {
        sender: { select: { name: true, avatar: true, company: true } },
        project: { select: { title: true } }
      },
      orderBy: { createdAt: 'asc' }
    });
    
    res.json({ success: true, messages });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
// Récupérer les messages de l'utilisateur connecté
// Récupérer les messages de l'utilisateur connecté - VERSION CORRIGÉE
router.get('/my-messages', async (req, res) => {
  try {
    // MAINTENANT on utilise l'ID 1 pour l'investisseur (VOUS)
    const userId = 1; // ✅ CHANGÉ : ID 1 = Investisseur (vous)
    
    const messages = await prisma.message.findMany({
      where: { 
        OR: [
          { receiverId: userId },   // Messages que VOUS avez reçus
          { senderId: userId }      // Messages que VOUS avez envoyés
        ]
      },
      include: {
        sender: { 
          select: { 
            name: true, 
            email: true, 
            company: true,
            avatar: true 
          } 
        },
        receiver: { 
          select: { 
            name: true, 
            email: true,
            avatar: true 
          } 
        },
        project: { 
          select: { 
            title: true,
            id: true
          } 
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Séparer messages reçus et envoyés
    const received = messages.filter(msg => msg.receiverId === userId);
    const sent = messages.filter(msg => msg.senderId === userId);
    
    res.json({ 
      success: true, 
      data: {
        all: messages,
        received,
        sent,
        stats: {
          total: messages.length,
          received: received.length,
          sent: sent.length,
          unread: received.filter(msg => !msg.read).length
        }
      }
    });
    
  } catch (error) {
    console.error('Erreur récupération messages:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Marquer un message comme lu
router.patch('/:id/read', async (req, res) => {
  try {
    const message = await prisma.message.update({
      where: { id: parseInt(req.params.id) },
      data: { read: true }
    });
    
    res.json({ success: true, message: 'Message marqué comme lu' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


export default router;