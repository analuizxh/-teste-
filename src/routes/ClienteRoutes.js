import { Router } from 'express';
import {
  createCliente,
  getAllClientes,
  getClienteById,
  updateCliente,
  deleteCliente
} from '../controllers/ClienteController.js';

const router = Router();

router.post('/', createCliente);
router.get('/', getAllClientes);
router.get('/:id', getClienteById);
router.put('/:id', updateCliente);
router.delete('/:id', deleteCliente);

export default router;