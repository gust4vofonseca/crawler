import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateSchema1623193729115 implements MigrationInterface {
    name = 'CreateSchema1623193729115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "initial_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying NOT NULL, "classification" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6dadee52ca378e5bd0302c34c25" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "attendances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mobile_phone" character varying NOT NULL, "initial_message_id" uuid NOT NULL, "hubspot_contact_id" integer, "protocol_number" character varying NOT NULL, "contact_name" character varying, "clerk" character varying, "channel" character varying NOT NULL, "connection_type" character varying, "status" character varying, "reason" character varying, "observations" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_a7fd233cc31c28580a25b3bb39" UNIQUE ("initial_message_id"), CONSTRAINT "PK_483ed97cd4cd43ab4a117516b69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blacklist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "mobile_phone" character varying NOT NULL, "hubspot_contact_id" integer, "reason" character varying NOT NULL, CONSTRAINT "PK_04dc42a96bf0914cda31b579702" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "others_precatories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT 'now()', "name" character varying NOT NULL, "telephone" character varying NOT NULL, "precatory_type" character varying NOT NULL, "state" character varying NOT NULL, "city" character varying, "observations" character varying, CONSTRAINT "PK_f16fc8e65a7052c2794764e1732" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "teams" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "leader_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT 'now()', "updated_at" TIMESTAMP NOT NULL DEFAULT 'now()', CONSTRAINT "REL_10c8e335dc32010ef90abe65ce" UNIQUE ("leader_id"), CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "profile_id" uuid NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "team_id" uuid, "avatar" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "closer_availability" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "closer_id" uuid NOT NULL, "hunter_id" uuid, "hubspot_id" character varying, "wait_duration" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_a8a9ef93507071bd9ea755db058" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_logins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "type" character varying NOT NULL, "socket_id" character varying NOT NULL, "datetime_init" TIMESTAMP NOT NULL DEFAULT now(), "datetime_end" TIMESTAMP, "duration" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_9f86d27ab00b6848c87a76ad5ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "process_files" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, "trf" character varying NOT NULL, "lines" character varying NOT NULL, "processed" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_12b20448a56498833f9d7f1ca34" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "objectives" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "team_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT 'now()', "updated_at" TIMESTAMP NOT NULL DEFAULT 'now()', CONSTRAINT "PK_c54846771e6a2db24c2b886eca0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "key_results" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "objective_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT 'now()', "updated_at" TIMESTAMP NOT NULL DEFAULT 'now()', CONSTRAINT "PK_43ca92a80903403806ecf974392" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "key_results_check_in" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "progress" integer NOT NULL, "key_result_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cea5abd65b0be5642119194d7b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "boards" ("id" bigint NOT NULL, "name" character varying NOT NULL, "notes" character varying, "status" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_606923b0b068ef262dfdcd18f44" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id_data_base" BIGSERIAL NOT NULL, "id" integer NOT NULL, "token" character varying NOT NULL, "name" character varying NOT NULL, "notes" character varying, "status" integer NOT NULL, "status_updated_at" TIMESTAMP NOT NULL DEFAULT now(), "section_id" integer NOT NULL, "section_name" character varying NOT NULL, "project_id" bigint NOT NULL, "sequence" numeric NOT NULL, "assigned_to_id" integer, "tracked_time" integer NOT NULL, "due" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fe65e133ea657cb443b9d7caf96" PRIMARY KEY ("id_data_base"))`);
        await queryRunner.query(`CREATE TABLE "closers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "ramal" character varying NOT NULL, "prioridade" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_68257680fa057c3de4e59d02bc" UNIQUE ("user_id"), CONSTRAINT "PK_9d169a04c47661ff03abd4888fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hunters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "ramal" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_7766c4f1a362ff906db65649b3" UNIQUE ("user_id"), CONSTRAINT "PK_fdefb550a92f26fa17e8cc5eab8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_tokens" ("id" character varying NOT NULL, "refresh_token" character varying NOT NULL, "user_id" uuid NOT NULL, "expires_date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9f236389174a6ccbd746f53dca8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permissions_profile" ("profile_id" uuid NOT NULL, "permission_id" uuid NOT NULL, CONSTRAINT "PK_89b1d9ade57affb61ad817a67b4" PRIMARY KEY ("profile_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1b83ff060b135c0146c8dd36a7" ON "permissions_profile" ("profile_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1234500afc2385a1ff365d4a86" ON "permissions_profile" ("permission_id") `);
        await queryRunner.query(`ALTER TABLE "attendances" ADD CONSTRAINT "FK_a7fd233cc31c28580a25b3bb392" FOREIGN KEY ("initial_message_id") REFERENCES "initial_messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teams" ADD CONSTRAINT "FK_10c8e335dc32010ef90abe65cec" FOREIGN KEY ("leader_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_23371445bd80cb3e413089551bf" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_1208ee1db5ddb64b48a86b46a61" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "closer_availability" ADD CONSTRAINT "FK_a3d628c2de90e0435ee84173ab0" FOREIGN KEY ("closer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE SET NULL`);
        await queryRunner.query(`ALTER TABLE "closer_availability" ADD CONSTRAINT "FK_81b677fbd00652318682cc5586b" FOREIGN KEY ("hunter_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE SET NULL`);
        await queryRunner.query(`ALTER TABLE "users_logins" ADD CONSTRAINT "FK_61f2f4b5655714cd021166b56c5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE SET NULL`);
        await queryRunner.query(`ALTER TABLE "objectives" ADD CONSTRAINT "FK_b32447afcf945d99a7373c0d0ce" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "key_results" ADD CONSTRAINT "FK_83e289242ea81c01b44a8b2a4cf" FOREIGN KEY ("objective_id") REFERENCES "objectives"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "key_results_check_in" ADD CONSTRAINT "FK_89f979a4de68cf0af5714e48a22" FOREIGN KEY ("key_result_id") REFERENCES "key_results"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4" FOREIGN KEY ("project_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "closers" ADD CONSTRAINT "FK_68257680fa057c3de4e59d02bc8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hunters" ADD CONSTRAINT "FK_7766c4f1a362ff906db65649b3f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_tokens" ADD CONSTRAINT "FK_32f96022cc5076fe565a5cba20b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permissions_profile" ADD CONSTRAINT "FK_1b83ff060b135c0146c8dd36a75" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permissions_profile" ADD CONSTRAINT "FK_1234500afc2385a1ff365d4a86f" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions_profile" DROP CONSTRAINT "FK_1234500afc2385a1ff365d4a86f"`);
        await queryRunner.query(`ALTER TABLE "permissions_profile" DROP CONSTRAINT "FK_1b83ff060b135c0146c8dd36a75"`);
        await queryRunner.query(`ALTER TABLE "users_tokens" DROP CONSTRAINT "FK_32f96022cc5076fe565a5cba20b"`);
        await queryRunner.query(`ALTER TABLE "hunters" DROP CONSTRAINT "FK_7766c4f1a362ff906db65649b3f"`);
        await queryRunner.query(`ALTER TABLE "closers" DROP CONSTRAINT "FK_68257680fa057c3de4e59d02bc8"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4"`);
        await queryRunner.query(`ALTER TABLE "key_results_check_in" DROP CONSTRAINT "FK_89f979a4de68cf0af5714e48a22"`);
        await queryRunner.query(`ALTER TABLE "key_results" DROP CONSTRAINT "FK_83e289242ea81c01b44a8b2a4cf"`);
        await queryRunner.query(`ALTER TABLE "objectives" DROP CONSTRAINT "FK_b32447afcf945d99a7373c0d0ce"`);
        await queryRunner.query(`ALTER TABLE "users_logins" DROP CONSTRAINT "FK_61f2f4b5655714cd021166b56c5"`);
        await queryRunner.query(`ALTER TABLE "closer_availability" DROP CONSTRAINT "FK_81b677fbd00652318682cc5586b"`);
        await queryRunner.query(`ALTER TABLE "closer_availability" DROP CONSTRAINT "FK_a3d628c2de90e0435ee84173ab0"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_1208ee1db5ddb64b48a86b46a61"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_23371445bd80cb3e413089551bf"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP CONSTRAINT "FK_10c8e335dc32010ef90abe65cec"`);
        await queryRunner.query(`ALTER TABLE "attendances" DROP CONSTRAINT "FK_a7fd233cc31c28580a25b3bb392"`);
        await queryRunner.query(`DROP INDEX "IDX_1234500afc2385a1ff365d4a86"`);
        await queryRunner.query(`DROP INDEX "IDX_1b83ff060b135c0146c8dd36a7"`);
        await queryRunner.query(`DROP TABLE "permissions_profile"`);
        await queryRunner.query(`DROP TABLE "users_tokens"`);
        await queryRunner.query(`DROP TABLE "hunters"`);
        await queryRunner.query(`DROP TABLE "closers"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TABLE "boards"`);
        await queryRunner.query(`DROP TABLE "key_results_check_in"`);
        await queryRunner.query(`DROP TABLE "key_results"`);
        await queryRunner.query(`DROP TABLE "objectives"`);
        await queryRunner.query(`DROP TABLE "process_files"`);
        await queryRunner.query(`DROP TABLE "users_logins"`);
        await queryRunner.query(`DROP TABLE "closer_availability"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TABLE "teams"`);
        await queryRunner.query(`DROP TABLE "others_precatories"`);
        await queryRunner.query(`DROP TABLE "blacklist"`);
        await queryRunner.query(`DROP TABLE "attendances"`);
        await queryRunner.query(`DROP TABLE "initial_messages"`);
    }

}
