
CREATE TABLE `empresas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cnpj` VARCHAR(191) NOT NULL,
    `razaoSocial` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `dataCadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `empresas_cnpj_key`(`cnpj`),
    UNIQUE INDEX `empresas_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE `funcionarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `cargo` VARCHAR(191) NOT NULL,
    `empresaId` INTEGER NOT NULL,

    UNIQUE INDEX `funcionarios_cpf_key`(`cpf`),
    UNIQUE INDEX `funcionarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE `clientes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `cpf_cnpj` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `clientes_cpf_cnpj_key`(`cpf_cnpj`),
    UNIQUE INDEX `clientes_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE `enderecos_obra` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `logradouro` VARCHAR(191) NOT NULL,
    `bairro` VARCHAR(191) NOT NULL,
    `cep` VARCHAR(191) NOT NULL,
    `cidade` VARCHAR(191) NOT NULL,
    `clienteId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE `agendamentos_medida` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dataAgendamento` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `altura` DECIMAL(65, 30) NULL,
    `largura` DECIMAL(65, 30) NULL,
    `profundidade` DECIMAL(65, 30) NULL,
    `diametro` DECIMAL(65, 30) NULL,
    `dataMedicao` DATETIME(3) NULL,
    `observacaoTecnica` VARCHAR(191) NULL,
    `clienteId` INTEGER NOT NULL,
    `produtoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE `orcamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `valorTotal` DECIMAL(65, 30) NOT NULL,
    `validade` DATETIME(3) NOT NULL,
    `funcionarioId` INTEGER NOT NULL,
    `agendamentoMedidaId` INTEGER NOT NULL,

    UNIQUE INDEX `orcamentos_agendamentoMedidaId_key`(`agendamentoMedidaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE `produtos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `categoria` VARCHAR(191) NOT NULL,
    `descricaoTecnica` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE `telefones_empresa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `telefone` VARCHAR(191) NOT NULL,
    `empresaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE `telefones_funcionario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `telefone` VARCHAR(191) NOT NULL,
    `funcionarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE `telefones_cliente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `telefone` VARCHAR(191) NOT NULL,
    `clienteId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE `_Realiza` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_Realiza_AB_unique`(`A`, `B`),
    INDEX `_Realiza_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


ALTER TABLE `funcionarios` ADD CONSTRAINT `funcionarios_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `enderecos_obra` ADD CONSTRAINT `enderecos_obra_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `agendamentos_medida` ADD CONSTRAINT `agendamentos_medida_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `agendamentos_medida` ADD CONSTRAINT `agendamentos_medida_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `produtos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `orcamentos` ADD CONSTRAINT `orcamentos_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `funcionarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `orcamentos` ADD CONSTRAINT `orcamentos_agendamentoMedidaId_fkey` FOREIGN KEY (`agendamentoMedidaId`) REFERENCES `agendamentos_medida`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `telefones_empresa` ADD CONSTRAINT `telefones_empresa_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `telefones_funcionario` ADD CONSTRAINT `telefones_funcionario_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `funcionarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `telefones_cliente` ADD CONSTRAINT `telefones_cliente_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `_Realiza` ADD CONSTRAINT `_Realiza_A_fkey` FOREIGN KEY (`A`) REFERENCES `agendamentos_medida`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `_Realiza` ADD CONSTRAINT `_Realiza_B_fkey` FOREIGN KEY (`B`) REFERENCES `funcionarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
