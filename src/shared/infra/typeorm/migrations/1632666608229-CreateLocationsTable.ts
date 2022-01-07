import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLocationsTable1632666608229 implements MigrationInterface {
  name = 'CreateLocationsTable1632666608229';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "locations" ("id" bigint NOT NULL, "name" character varying NOT NULL, "initials" character varying NOT NULL, "region" character varying NOT NULL, CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "locations"`);
  }
}
