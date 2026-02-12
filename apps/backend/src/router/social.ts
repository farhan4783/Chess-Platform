import { Router } from 'express';
import { db } from '../db';

const router = Router();

// ==================== FRIENDS ENDPOINTS ====================

// Get user's friends
router.get('/friends', async (req, res) => {
  try {
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const friendships = await db.friendship.findMany({
      where: {
        OR: [
          { initiatorId: userId, status: 'ACCEPTED' },
          { receiverId: userId, status: 'ACCEPTED' },
        ],
      },
      include: {
        initiator: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            rating: true,
            lastLogin: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            rating: true,
            lastLogin: true,
          },
        },
      },
    });

    const friends = friendships.map((f: any) => (f.initiatorId === userId ? f.receiver : f.initiator));

    res.json(friends);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

// Get friend requests
router.get('/friends/requests', async (req, res) => {
  try {
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const requests = await db.friendship.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING',
      },
      include: {
        initiator: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            rating: true,
          },
        },
      },
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch friend requests' });
  }
});

// Send friend request
router.post('/friends/request', async (req, res) => {
  try {
    const { receiverId } = req.body;
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (userId === receiverId) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }

    const friendship = await db.friendship.create({
      data: {
        initiatorId: userId,
        receiverId,
      },
    });

    // Create notification
    await db.notification.create({
      data: {
        userId: receiverId,
        type: 'FRIEND_REQUEST',
        title: 'New Friend Request',
        message: 'You have a new friend request',
        link: `/social/friends`,
      },
    });

    res.status(201).json(friendship);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Friend request already exists' });
    }
    res.status(500).json({ error: 'Failed to send friend request' });
  }
});

// Accept friend request
router.post('/friends/accept/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const friendship = await db.friendship.findUnique({
      where: { id },
    });

    if (!friendship) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    if (friendship.receiverId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to accept this request' });
    }

    const updated = await db.friendship.update({
      where: { id },
      data: {
        status: 'ACCEPTED',
        acceptedAt: new Date(),
      },
    });

    // Create notification
    await db.notification.create({
      data: {
        userId: friendship.initiatorId,
        type: 'FRIEND_ACCEPTED',
        title: 'Friend Request Accepted',
        message: 'Your friend request was accepted',
        link: `/profile/${userId}`,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept friend request' });
  }
});

// Decline friend request
router.post('/friends/decline/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const friendship = await db.friendship.findUnique({
      where: { id },
    });

    if (!friendship) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    if (friendship.receiverId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to decline this request' });
    }

    await db.friendship.update({
      where: { id },
      data: { status: 'DECLINED' },
    });

    res.json({ message: 'Friend request declined' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to decline friend request' });
  }
});

// Remove friend
router.delete('/friends/:friendId', async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await db.friendship.deleteMany({
      where: {
        OR: [
          { initiatorId: userId, receiverId: friendId },
          { initiatorId: friendId, receiverId: userId },
        ],
      },
    });

    res.json({ message: 'Friend removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove friend' });
  }
});

// ==================== MESSAGING ENDPOINTS ====================

// Get conversations
router.get('/messages/conversations', async (req, res) => {
  try {
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const messages = await db.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Group by conversation partner
    const conversations = new Map();
    messages.forEach((msg: any) => {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!conversations.has(partnerId)) {
        conversations.set(partnerId, {
          partner: msg.senderId === userId ? msg.receiver : msg.sender,
          lastMessage: msg,
          unreadCount: 0,
        });
      }
      if (msg.receiverId === userId && !msg.isRead) {
        conversations.get(partnerId).unreadCount++;
      }
    });

    res.json(Array.from(conversations.values()));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages with a user
router.get('/messages/:userId', async (req, res) => {
  try {
    const { userId: otherUserId } = req.params;
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Mark messages as read
    await db.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message
router.post('/messages', async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const message = await db.message.create({
      data: {
        senderId: userId,
        receiverId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    // Create notification
    await db.notification.create({
      data: {
        userId: receiverId,
        type: 'MESSAGE_RECEIVED',
        title: 'New Message',
        message: 'You have a new message',
        link: `/messages/${userId}`,
      },
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// ==================== CLUBS ENDPOINTS ====================

// Get all clubs
router.get('/clubs', async (req, res) => {
  try {
    const clubs = await db.club.findMany({
      where: {
        isPublic: true,
      },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    res.json(clubs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clubs' });
  }
});

// Get club by ID
router.get('/clubs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const club = await db.club.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
                rating: true,
              },
            },
          },
        },
        chatRooms: true,
      },
    });

    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }

    res.json(club);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch club' });
  }
});

// Create club
router.post('/clubs', async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const club = await db.club.create({
      data: {
        name,
        description,
        isPublic: isPublic ?? true,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
        chatRooms: {
          create: {
            name: 'General',
          },
        },
      },
    });

    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create club' });
  }
});

// Join club
router.post('/clubs/:id/join', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const member = await db.clubMember.create({
      data: {
        clubId: id,
        userId,
      },
    });

    res.status(201).json(member);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Already a member' });
    }
    res.status(500).json({ error: 'Failed to join club' });
  }
});

// Leave club
router.delete('/clubs/:id/leave', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await db.clubMember.delete({
      where: {
        clubId_userId: {
          clubId: id,
          userId,
        },
      },
    });

    res.json({ message: 'Left club successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to leave club' });
  }
});

// ==================== NOTIFICATIONS ENDPOINTS ====================

// Get user notifications
router.get('/notifications', async (req, res) => {
  try {
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.patch('/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const notification = await db.notification.update({
      where: { id },
      data: { isRead: true },
    });

    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.patch('/notifications/read-all', async (req, res) => {
  try {
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await db.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
});

export default router;
