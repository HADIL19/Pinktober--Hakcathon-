// backend/src/routes/messages.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Récupérer tous les messages (pour admin)
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

// Récupérer les messages de l'utilisateur connecté
router.get('/my-messages', async (req, res) => {
  try {
    console.log('📨 Route /my-messages appelée');
    
    // Pour l'instant, on utilise un ID temporaire - à remplacer par l'authentification
    const userId = req.user?.id || 2; // ID 2 = Dr. Marie Lambert
    
    const messages = await prisma.message.findMany({
      where: { 
        OR: [
          { receiverId: userId },   // Messages reçus
          { senderId: userId }      // Messages envoyés
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
    
    console.log(`📊 ${messages.length} messages trouvés pour l'utilisateur ${userId}`);
    
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
          unread: received.filter(msg => !msg.isRead).length
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur récupération messages:', error);
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
        senderId: 1, // ID temporaire de l'investisseur
        receiverId: parseInt(receiverId),
        projectId: projectId ? parseInt(projectId) : null,
        isRead: false
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
    const currentUserId = 1; // ID temporaire de l'investisseur
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

// Marquer un message comme lu
router.patch('/:id/read', async (req, res) => {
  try {
    const message = await prisma.message.update({
      where: { id: parseInt(req.params.id) },
      data: { isRead: true }
    });
    
    res.json({ success: true, message: 'Message marqué comme lu' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Récupérer les messages de l'utilisateur connecté
router.get('/my-messages', async (req, res) => {
  try {
    // TEMPORAIRE: ID de l'investisseur (vous)
    const investorId = 1; // À remplacer par l'ID de l'utilisateur connecté
    
    const messages = await prisma.message.findMany({
      where: { 
        OR: [
          { receiverId: investorId },   // Messages reçus
          { senderId: investorId }      // Messages envoyés
        ]
      },
      include: {
        sender: { 
          select: { 
            id: true,
            name: true, 
            email: true, 
            company: true,
            avatar: true 
          } 
        },
        receiver: { 
          select: { 
            id: true,
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
    
    console.log(`📊 ${messages.length} messages trouvés pour l'investisseur ${investorId}`);
    
    // Séparer messages reçus et envoyés
    const received = messages.filter(msg => msg.receiverId === investorId);
    const sent = messages.filter(msg => msg.senderId === investorId);
    
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
          unread: received.filter(msg => !msg.isRead).length
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur récupération messages:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;