import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getRecommededUsers, getFriends, sendFriendRequest, acceptFriendRequest, getFriendRequests, getOutgoingFriendRequest } from '../controllers/user.controller.js';


const router = express.Router();

//globally protect the routes with auth middleware
router.use(protectRoute);

router.get('/', getRecommededUsers);
router.get('/friends', getFriends);

router.post('/friend-req/:id', sendFriendRequest);
router.put('/friend-req/:id/accept',acceptFriendRequest);

router.get('/friend-req',getFriendRequests)
router.get('/outgoing-friend-req', getOutgoingFriendRequest);

export default router;