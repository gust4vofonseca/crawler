import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterProcessFiles1630856999664 implements MigrationInterface {
    name = 'AlterProcessFiles1630856999664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "process_files" RENAME COLUMN "trf" TO "court"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "process_files" RENAME COLUMN "court" TO "trf"`);
    }

}
