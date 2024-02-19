import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Init1688667042904 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE user (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          role INT NOT NULL DEFAULT 1
      )`,
    );

    // await queryRunner.createTable(
    //   new Table({
    //     name: 'user',
    //     columns: [
    //       {
    //         name: 'id',
    //         type: 'int',
    //         isPrimary: true,
    //         isGenerated: true,
    //         generationStrategy: 'increment',
    //       },
    //       {
    //         name: 'username',
    //         type: 'varchar',
    //         isUnique: true,
    //       },
    //       {
    //         name: 'password',
    //         type: 'varchar',
    //       },
    //       {
    //         name: 'email',
    //         type: 'varchar',
    //         isUnique: true,
    //       },
    //       {
    //         name: 'role',
    //         type: 'int',
    //         default: 1,
    //       },
    //       {
    //         name: 'profilePicture',
    //         type: 'varchar',
    //         default: '',
    //       },
    //     ],
    //   }),
    //   true,
    // );

    await queryRunner.createTable(
      new Table({
        name: 'role',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'confirmation',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'username',
            type: 'varchar',
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'role',
            type: 'int',
            default: 1,
          },
          {
            name: 'confirmationCode',
            type: 'varchar',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'ticket',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'movieId',
            type: 'int',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'price',
            type: 'decimal',
          },
          {
            name: 'numOfTickets',
            type: 'int',
          },
          {
            name: 'screeningTimes',
            type: 'varchar',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ticket', true);
    await queryRunner.dropTable('role', true);
    await queryRunner.dropTable('purchase', true);
    await queryRunner.dropTable('confirmation', true);
    await queryRunner.dropTable('user', true);
  }
}
