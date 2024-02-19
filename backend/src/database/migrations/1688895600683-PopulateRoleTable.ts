import { MigrationInterface, QueryRunner } from 'typeorm';

export class PopulateRoleTable1688895600683 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO role VALUES (DEFAULT, "customer"), (DEFAULT, "admin");`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM role WHERE name IN ("customer", "admin");`,
    );
  }
}
