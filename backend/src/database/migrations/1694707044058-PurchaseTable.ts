import { MigrationInterface, QueryRunner } from 'typeorm';

export class PurchaseTable1694707044058 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE purchase(id INT AUTO_INCREMENT PRIMARY KEY, userId INT, ticketId INT, numOfTickets INT);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE purchase;`);
  }
}
