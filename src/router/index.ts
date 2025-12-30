
import { Router } from 'express';
import courseRoutes from './course';

const router = Router();

//main implementation routes

router.use('/course', courseRoutes);

export default router;
