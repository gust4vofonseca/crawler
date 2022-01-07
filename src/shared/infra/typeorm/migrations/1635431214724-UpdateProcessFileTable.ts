import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProcessFileTable1635431214724 implements MigrationInterface {
  name = 'UpdateProcessFileTable1635431214724';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "process_files" ADD "zip_name" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "process_files" DROP COLUMN "zip_name"`,
    );
  }
}
