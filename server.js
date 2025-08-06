process.env.TS_NODE_IGNORE = 'true';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';

import authRoutes from './src/routes/AuthRoutes.js';
import empresaRoutes from './src/routes/EmpresaRoutes.js';
import funcionarioRoutes from './src/routes/FuncionarioRoutes.js';
import clienteRoutes from './src/routes/ClienteRoutes.js';
import produtoRoutes from './src/routes/ProdutoRoutes.js';
import agendamentoRoutes from './src/routes/AgendamentoRoutes.js';
import orcamentoRoutes from './src/routes/OrcamentoRoutes.js';
import segurancaRoutes from './src/routes/SegurancaRoutes.js';

import { authMiddleware } from './src/middlewares/AuthMiddleware.js';
import { verifyLicense } from './src/middlewares/LicenseMiddleware.js';
import { requirePermission } from './src/controllers/permissions.js';
import { apiLimiter, authLimiter } from './src/middlewares/LimiteTaxaMiddleware.js';
import { securityConfig } from './src/config/seguranca.js';
import { sanitizarEntrada } from './src/middlewares/SanitizacaoMiddleware.js';

import { renovarLicenca } from './src/controllers/EmpresaController.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors(securityConfig.corsOptions));
app.use(express.json({ limit: '10kb' }));

app.use(sanitizarEntrada);
app.use('/api/auth/login', authLimiter);
app.use(apiLimiter);
 
app.use('/api/auth', authRoutes);

app.use(authMiddleware);

app.use(verifyLicense);

app.use('/api/empresas', empresaRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/agendamentos', agendamentoRoutes);
app.use('/api/orcamentos', orcamentoRoutes);
app.use('/api/seguranca', segurancaRoutes);

app.put('/api/empresas/:id/licenca', 
  requirePermission('empresas', 'administrar'), 
  renovarLicenca
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensagem: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor seguro rodando na porta ${PORT} 🛡️`);
});