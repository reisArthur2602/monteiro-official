-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('PESSOA_FISICA', 'PESSOA_JURIDICA');

-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('ATIVO', 'PROSPECTO', 'INATIVO');

-- CreateTable
CREATE TABLE "clients" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "type" "ClientType" NOT NULL,
    "status" "ClientStatus" NOT NULL DEFAULT 'PROSPECTO',
    "document" VARCHAR(14) NOT NULL,
    "phone" VARCHAR(11),
    "email" VARCHAR(254),
    "responsible_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_document_key" ON "clients"("document");

-- CreateIndex
CREATE INDEX "clients_status_deleted_at_idx" ON "clients"("status", "deleted_at");

-- CreateIndex
CREATE INDEX "clients_type_deleted_at_idx" ON "clients"("type", "deleted_at");

-- CreateIndex
CREATE INDEX "clients_responsible_id_deleted_at_idx" ON "clients"("responsible_id", "deleted_at");

-- CreateIndex
CREATE INDEX "clients_updated_at_idx" ON "clients"("updated_at");

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
