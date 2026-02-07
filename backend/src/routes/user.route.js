import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getRecommededUsers, getFriends, sendFriendRequest, acceptFriendRequest, getFriendRequests, getOutgoingFriendRequest } from '../controllers/user.controller.js';


const router = express.Router();

//globally protect the routes with auth middleware
router.use(protectRoute);

router.get('/', getRecommededUsers);
router.get('/friends', getFriends);

router.post('/friend-request/:id', sendFriendRequest);
router.put('/friend-request/:id/accept',acceptFriendRequest);

router.get('/friend-request',getFriendRequests)
router.get('/outgoing-friend-request', getOutgoingFriendRequest);

export default router;