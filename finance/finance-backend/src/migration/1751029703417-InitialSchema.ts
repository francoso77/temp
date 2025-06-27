import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1751029703417 implements MigrationInterface {
    name = 'InitialSchema1751029703417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`accounts\` CHANGE \`initialBalance\` \`initialBalance\` float(2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`transactions\` CHANGE \`amount\` \`amount\` float(3) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`transactions\` CHANGE \`qtd\` \`qtd\` float(3) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`transactions\` CHANGE \`price\` \`price\` float(3) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` CHANGE \`price\` \`price\` float(12) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`transactions\` CHANGE \`qtd\` \`qtd\` float(12) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`transactions\` CHANGE \`amount\` \`amount\` float(12) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`accounts\` CHANGE \`initialBalance\` \`initialBalance\` float(12) NOT NULL`);
    }

}
