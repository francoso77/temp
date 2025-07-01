import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class InitialSchema1751375519717 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Tabela 'user' (assumindo estrutura básica com UUID como PK)
        await queryRunner.createTable(new Table({
            name: "users",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    length: "36",
                    isPrimary: true,
                    isNullable: false,
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "email",
                    type: "varchar",
                    length: "255",
                    isUnique: true,
                    isNullable: false,
                },
                {
                    name: "password",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    isNullable: false,
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP",
                    isNullable: false,
                },
            ]
        }), true);

        // Tabela 'usersectons'
        await queryRunner.createTable(new Table({
            name: "usersectons",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    length: "36",
                    isPrimary: true,
                    isNullable: false,
                },
                {
                    name: "userId",
                    type: "varchar",
                    length: "36",
                    isNullable: false,
                },
                {
                    name: "token",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "isActive",
                    type: "boolean",
                    default: false,
                    isNullable: false,
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    isNullable: false,
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP",
                    isNullable: false,
                },
            ]
        }), true);

        // Tabela 'accounts'
        await queryRunner.createTable(new Table({
            name: "accounts",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    length: "36",
                    isPrimary: true,
                    isNullable: false,
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "type",
                    type: "varchar",
                    length: "255", // Para tipos de enum como 'corrente' | 'poupanca'
                    isNullable: false,
                },
                {
                    name: "initialBalance",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                    default: 0,
                    isNullable: false,
                },
                {
                    name: "color",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "isDefault",
                    type: "boolean",
                    default: false,
                    isNullable: false,
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    isNullable: false,
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP",
                    isNullable: false,
                },
                {
                    name: "userId",
                    type: "varchar",
                    length: "36",
                    isNullable: false,
                },
            ]
        }), true);
        await queryRunner.createIndex("accounts", new TableIndex({
            columnNames: ["name"]
        }));

        // Tabela 'categorys'
        await queryRunner.createTable(new Table({
            name: "categorys",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    length: "36",
                    isPrimary: true,
                    isNullable: false,
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "80",
                    isNullable: false,
                },
                {
                    name: "type",
                    type: "varchar",
                    length: "255", // Para tipos de enum como 'Receita' | 'Despesa'
                    isNullable: false,
                },
                {
                    name: "color",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    isNullable: false,
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP",
                    isNullable: false,
                },
                {
                    name: "userId",
                    type: "varchar",
                    length: "36",
                    isNullable: false,
                },
            ]
        }), true);
        await queryRunner.createIndex("categorys", new TableIndex({
            columnNames: ["name"]
        }));
        await queryRunner.createIndex("categorys", new TableIndex({
            name: "IDX_CATEGORY_USERID_NAME", // Nome para o índice único
            columnNames: ["userId", "name"],
            isUnique: true
        }));


        // Tabela 'companies' 
        await queryRunner.createTable(new Table({
            name: "companies",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    length: "36",
                    isPrimary: true,
                    isNullable: false,
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "100",
                    isNullable: false,
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    isNullable: false,
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP",
                    isNullable: false,
                },
                {
                    name: "userId",
                    type: "varchar",
                    length: "36",
                    isNullable: false,
                },
            ]
        }), true);
        await queryRunner.createIndex("companies", new TableIndex({
            name: "IDX_COMPANY_USERID_NAME", // Nome para o índice único
            columnNames: ["userId", "name"],
            isUnique: true
        }));

        // Tabela 'sectors' 
        await queryRunner.createTable(new Table({
            name: "sectors",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    length: "36",
                    isPrimary: true,
                    isNullable: false,
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "60",
                    isNullable: false,
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    isNullable: false,
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP",
                    isNullable: false,
                },
                {
                    name: "userId",
                    type: "varchar",
                    length: "36",
                    isNullable: false,
                },
            ]
        }), true);
        await queryRunner.createIndex("sectors", new TableIndex({
            name: "IDX_SECTOR_USERID_NAME", // Nome para o índice único
            columnNames: ["userId", "name"],
            isUnique: true
        }));


        // Tabela 'transactions'
        await queryRunner.createTable(new Table({
            name: "transactions",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    length: "36",
                    isPrimary: true,
                    isNullable: false,
                },
                {
                    name: "description",
                    type: "varchar",
                    length: "100",
                    isNullable: false,
                },
                {
                    name: "amount",
                    type: "decimal",
                    precision: 12,
                    scale: 4,
                    default: 0,
                    isNullable: false,
                },
                {
                    name: "qtd",
                    type: "decimal",
                    precision: 12,
                    scale: 4,
                    default: 0,
                    isNullable: false,
                },
                {
                    name: "price",
                    type: "decimal",
                    precision: 12,
                    scale: 4,
                    default: 0,
                    isNullable: false,
                },
                {
                    name: "sectorId",
                    type: "varchar",
                    length: "36",
                    isNullable: false,
                },
                {
                    name: "categoryId",
                    type: "varchar",
                    length: "36",
                    isNullable: false,
                },
                {
                    name: "accountId",
                    type: "varchar",
                    length: "36",
                    isNullable: false,
                },
                {
                    name: "companyId",
                    type: "varchar",
                    length: "36",
                    isNullable: false,
                },
                {
                    name: "date",
                    type: "datetime",
                    isNullable: false,
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    isNullable: false,
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP",
                    isNullable: false,
                },
                {
                    name: "userId",
                    type: "varchar",
                    length: "36",
                    isNullable: false,
                },
            ]
        }), true);
        await queryRunner.createIndex("transactions", new TableIndex({
            columnNames: ["date", "description"]
        }));


        // Adicionando chaves estrangeiras
        await queryRunner.createForeignKey("usersectons", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE",
        }));

        await queryRunner.createForeignKey("accounts", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE",
        }));

        await queryRunner.createForeignKey("categorys", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE",
        }));

        await queryRunner.createForeignKey("companies", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE",
        }));

        await queryRunner.createForeignKey("sectors", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE",
        }));

        await queryRunner.createForeignKey("transactions", new TableForeignKey({
            columnNames: ["sectorId"],
            referencedColumnNames: ["id"],
            referencedTableName: "sectors",
            onDelete: "RESTRICT",
        }));

        await queryRunner.createForeignKey("transactions", new TableForeignKey({
            columnNames: ["categoryId"],
            referencedColumnNames: ["id"],
            referencedTableName: "categorys",
            onDelete: "RESTRICT",
        }));

        await queryRunner.createForeignKey("transactions", new TableForeignKey({
            columnNames: ["accountId"],
            referencedColumnNames: ["id"],
            referencedTableName: "accounts",
            onDelete: "RESTRICT",
        }));

        await queryRunner.createForeignKey("transactions", new TableForeignKey({
            columnNames: ["companyId"],
            referencedColumnNames: ["id"],
            referencedTableName: "companies",
            onDelete: "RESTRICT",
        }));

        await queryRunner.createForeignKey("transactions", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Removendo chaves estrangeiras (ordem inversa da criação)
        // Primeiro, as chaves estrangeiras da tabela 'transactions'
        const transactionsTable = await queryRunner.getTable("transactions");
        if (transactionsTable) {
            const foreignKeyTransactionSector = transactionsTable.foreignKeys.find(fk => fk.columnNames.includes("sectorId"));
            if (foreignKeyTransactionSector) await queryRunner.dropForeignKey("transactions", foreignKeyTransactionSector);

            const foreignKeyTransactionCategory = transactionsTable.foreignKeys.find(fk => fk.columnNames.includes("categoryId"));
            if (foreignKeyTransactionCategory) await queryRunner.dropForeignKey("transactions", foreignKeyTransactionCategory);

            const foreignKeyTransactionAccount = transactionsTable.foreignKeys.find(fk => fk.columnNames.includes("accountId"));
            if (foreignKeyTransactionAccount) await queryRunner.dropForeignKey("transactions", foreignKeyTransactionAccount);

            const foreignKeyTransactionCompany = transactionsTable.foreignKeys.find(fk => fk.columnNames.includes("companyId"));
            if (foreignKeyTransactionCompany) await queryRunner.dropForeignKey("transactions", foreignKeyTransactionCompany);

            const foreignKeyTransactionUser = transactionsTable.foreignKeys.find(fk => fk.columnNames.includes("userId"));
            if (foreignKeyTransactionUser) await queryRunner.dropForeignKey("transactions", foreignKeyTransactionUser);
        }

        // Chaves estrangeiras de 'usersectons', 'accounts', 'categorys', 'companies', 'sectors'
        const userSectionTable = await queryRunner.getTable("usersectons");
        if (userSectionTable) {
            const foreignKeyUserSectionUser = userSectionTable.foreignKeys.find(fk => fk.columnNames.includes("userId"));
            if (foreignKeyUserSectionUser) await queryRunner.dropForeignKey("usersectons", foreignKeyUserSectionUser);
        }

        const accountsTable = await queryRunner.getTable("accounts");
        if (accountsTable) {
            const foreignKeyAccountUser = accountsTable.foreignKeys.find(fk => fk.columnNames.includes("userId"));
            if (foreignKeyAccountUser) await queryRunner.dropForeignKey("accounts", foreignKeyAccountUser);
        }

        const categorysTable = await queryRunner.getTable("categorys");
        if (categorysTable) {
            const foreignKeyCategoryUser = categorysTable.foreignKeys.find(fk => fk.columnNames.includes("userId"));
            if (foreignKeyCategoryUser) await queryRunner.dropForeignKey("categorys", foreignKeyCategoryUser);
        }

        const companiesTable = await queryRunner.getTable("companies");
        if (companiesTable) {
            const foreignKeyCompanyUser = companiesTable.foreignKeys.find(fk => fk.columnNames.includes("userId"));
            if (foreignKeyCompanyUser) await queryRunner.dropForeignKey("companies", foreignKeyCompanyUser);
        }

        const sectorsTable = await queryRunner.getTable("sectors");
        if (sectorsTable) {
            const foreignKeySectorUser = sectorsTable.foreignKeys.find(fk => fk.columnNames.includes("userId"));
            if (foreignKeySectorUser) await queryRunner.dropForeignKey("sectors", foreignKeySectorUser);
        }


        // Removendo tabelas (ordem inversa da criação, após remover FKs)
        await queryRunner.dropTable("transactions");
        await queryRunner.dropTable("usersectons");
        await queryRunner.dropTable("accounts");
        await queryRunner.dropTable("categorys");
        await queryRunner.dropTable("companies");
        await queryRunner.dropTable("sectors");
        await queryRunner.dropTable("users");
    }
}
