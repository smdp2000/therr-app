import * as express from 'express';
import {
    createMoment,
    searchMoments,
    deleteMoments,
} from '../handlers/moments';

const router = express.Router();

// CREATE
router.post('/', createMoment);

// SEARCH
router.post('/search', searchMoments);

// DELETE
router.delete('/', deleteMoments);

export default router;
