import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOtpFieldsToUser1793088095247 implements MigrationInterface {
    name = 'AddOtpFieldsToUser1793088095247'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "otpCode" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "otpExpired" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otpExpired"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otpCode"`);
    }

}
