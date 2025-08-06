import { Router } from 'express';
import { createAgendamento, getAllAgendamentos, updateAgendamento } from '../controllers/AgendamentoController.js';

const router = Router();
router.post('/', createAgendamento);
router.get('/', getAllAgendamentos);
router.put('/:id', updateAgendamento);
export default router;