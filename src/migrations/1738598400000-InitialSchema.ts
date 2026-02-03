import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1738598400000 implements MigrationInterface {
  name = 'InitialSchema1738598400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear extensión uuid
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Crear tabla users
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "name" character varying NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )
    `);

    // Crear tipo enum para status de todos
    await queryRunner.query(`
      CREATE TYPE "public"."todos_status_enum" AS ENUM('pending', 'in_progress', 'completed')
    `);

    // Crear tabla todos
    await queryRunner.query(`
      CREATE TABLE "todos" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "description" text,
        "status" "public"."todos_status_enum" NOT NULL DEFAULT 'pending',
        "dueDate" TIMESTAMP,
        "priority" integer NOT NULL DEFAULT '0',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" uuid NOT NULL,
        CONSTRAINT "PK_ca8cafd59ca6faaf67995344225" PRIMARY KEY ("id")
      )
    `);

    // Crear foreign key
    await queryRunner.query(`
      ALTER TABLE "todos" 
      ADD CONSTRAINT "FK_4583be7753873b4ead956f040e3" 
      FOREIGN KEY ("userId") 
      REFERENCES "users"("id") 
      ON DELETE CASCADE 
      ON UPDATE NO ACTION
    `);

    // Crear índices para mejorar rendimiento
    await queryRunner.query(`
      CREATE INDEX "IDX_todos_userId" ON "todos" ("userId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_todos_status" ON "todos" ("status")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índices
    await queryRunner.query(`DROP INDEX "public"."IDX_todos_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_todos_userId"`);

    // Eliminar foreign key
    await queryRunner.query(`
      ALTER TABLE "todos" DROP CONSTRAINT "FK_4583be7753873b4ead956f040e3"
    `);

    // Eliminar tablas
    await queryRunner.query(`DROP TABLE "todos"`);
    await queryRunner.query(`DROP TYPE "public"."todos_status_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
