import { Router } from 'express';
import { createOrcamento, getAllOrcamentos } from '../controllers/OrcamentoController.js';

const router = Router();
router.post('/', createOrcamento);
router.get('/', getAllOrcamentos);
export default router;