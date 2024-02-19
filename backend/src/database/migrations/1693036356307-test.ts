import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1693036356307 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user ADD profilePicture VARCHAR(255) DEFAULT "";`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user DROP profilePicture VARCHAR(255);`,
    );
  }
}
