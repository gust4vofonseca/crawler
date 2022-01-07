import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterProcessFiles1630703240656 implements MigrationInterface {
  name = 'AlterProcessFiles1630703240656';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "process_files" DROP COLUMN "lines"`);
    await queryRunner.query(
      `ALTER TABLE "process_files" ADD "lines" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "process_files" DROP COLUMN "processed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "process_files" ADD "processed" bigint NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "process_files" DROP COLUMN "processed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "process_files" ADD "processed" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "process_files" DROP COLUMN "lines"`);
    await queryRunner.query(
      `ALTER TABLE "process_files" ADD "lines" character varying NOT NULL`,
    );
  }
}
