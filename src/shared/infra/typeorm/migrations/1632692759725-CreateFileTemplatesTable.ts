import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFileTemplatesTable1632692759725
  implements MigrationInterface
{
  name = 'CreateFileTemplatesTable1632692759725';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "file_templates" ("id" BIGSERIAL NOT NULL, "court" character varying NOT NULL, "example_process_number" character varying NOT NULL, CONSTRAINT "PK_fdaa6cd803e7bbf8088c607acc4" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "file_templates"`);
  }
}
