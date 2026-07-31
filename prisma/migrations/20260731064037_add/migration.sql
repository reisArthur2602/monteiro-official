/*
  Warnings:

  - You are about to drop the `process_activities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `process_deadlines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `process_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `process_movements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `process_parties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `processes` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ClientDocumentCategory" AS ENUM ('IDENTIFICACAO', 'CONTRATO', 'PROCURACAO', 'COMPROVANTE', 'CORRESPONDENCIA', 'DOCUMENTO_JURIDICO', 'DOCUMENTO_FINANCEIRO', 'OUTRO');

-- CreateEnum
CREATE TYPE "ClientDocumentStatus" AS ENUM ('ATIVO', 'ARQUIVADO');

-- CreateEnum
CREATE TYPE "ClientDocumentSource" AS ENUM ('UPLOAD', 'TEMPLATE', 'IMPORTACAO');

-- CreateEnum
CREATE TYPE "ClientDocumentVisibility" AS ENUM ('EQUIPE', 'CLIENTE', 'CONFIDENCIAL');

-- DropForeignKey
ALTER TABLE "process_activities" DROP CONSTRAINT "process_activities_actor_id_fkey";

-- DropForeignKey
ALTER TABLE "process_activities" DROP CONSTRAINT "process_activities_process_id_fkey";

-- DropForeignKey
ALTER TABLE "process_deadlines" DROP CONSTRAINT "process_deadlines_completed_by_id_fkey";

-- DropForeignKey
ALTER TABLE "process_deadlines" DROP CONSTRAINT "process_deadlines_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "process_deadlines" DROP CONSTRAINT "process_deadlines_movement_id_fkey";

-- DropForeignKey
ALTER TABLE "process_deadlines" DROP CONSTRAINT "process_deadlines_process_id_fkey";

-- DropForeignKey
ALTER TABLE "process_deadlines" DROP CONSTRAINT "process_deadlines_responsible_id_fkey";

-- DropForeignKey
ALTER TABLE "process_deadlines" DROP CONSTRAINT "process_deadlines_updated_by_id_fkey";

-- DropForeignKey
ALTER TABLE "process_documents" DROP CONSTRAINT "process_documents_movement_id_fkey";

-- DropForeignKey
ALTER TABLE "process_documents" DROP CONSTRAINT "process_documents_process_id_fkey";

-- DropForeignKey
ALTER TABLE "process_documents" DROP CONSTRAINT "process_documents_uploaded_by_id_fkey";

-- DropForeignKey
ALTER TABLE "process_movements" DROP CONSTRAINT "process_movements_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "process_movements" DROP CONSTRAINT "process_movements_process_id_fkey";

-- DropForeignKey
ALTER TABLE "process_parties" DROP CONSTRAINT "process_parties_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "process_parties" DROP CONSTRAINT "process_parties_process_id_fkey";

-- DropForeignKey
ALTER TABLE "process_parties" DROP CONSTRAINT "process_parties_updated_by_id_fkey";

-- DropForeignKey
ALTER TABLE "processes" DROP CONSTRAINT "processes_attendance_form_id_fkey";

-- DropForeignKey
ALTER TABLE "processes" DROP CONSTRAINT "processes_client_id_fkey";

-- DropForeignKey
ALTER TABLE "processes" DROP CONSTRAINT "processes_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "processes" DROP CONSTRAINT "processes_responsible_id_fkey";

-- DropForeignKey
ALTER TABLE "processes" DROP CONSTRAINT "processes_updated_by_id_fkey";

-- DropTable
DROP TABLE "process_activities";

-- DropTable
DROP TABLE "process_deadlines";

-- DropTable
DROP TABLE "process_documents";

-- DropTable
DROP TABLE "process_movements";

-- DropTable
DROP TABLE "process_parties";

-- DropTable
DROP TABLE "processes";

-- DropEnum
DROP TYPE "ProcessActivityType";

-- DropEnum
DROP TYPE "ProcessClientRole";

-- DropEnum
DROP TYPE "ProcessDeadlineStatus";

-- DropEnum
DROP TYPE "ProcessDocumentCategory";

-- DropEnum
DROP TYPE "ProcessMovementSource";

-- DropEnum
DROP TYPE "ProcessPartyRole";

-- DropEnum
DROP TYPE "ProcessPartyType";

-- DropEnum
DROP TYPE "ProcessStatus";

-- DropEnum
DROP TYPE "ProcessType";

-- CreateTable
CREATE TABLE "client_documents" (
    "id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" VARCHAR(500),
    "category" "ClientDocumentCategory" NOT NULL,
    "status" "ClientDocumentStatus" NOT NULL DEFAULT 'ATIVO',
    "source" "ClientDocumentSource" NOT NULL DEFAULT 'UPLOAD',
    "visibility" "ClientDocumentVisibility" NOT NULL DEFAULT 'EQUIPE',
    "document_date" DATE,
    "storage_key" VARCHAR(500) NOT NULL,
    "original_name" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(120) NOT NULL,
    "size_bytes" BIGINT NOT NULL,
    "checksum" VARCHAR(64),
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "uploaded_by_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "archived_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "client_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "client_documents_storage_key_key" ON "client_documents"("storage_key");

-- CreateIndex
CREATE INDEX "client_documents_client_id_deleted_at_idx" ON "client_documents"("client_id", "deleted_at");

-- CreateIndex
CREATE INDEX "client_documents_client_id_category_deleted_at_idx" ON "client_documents"("client_id", "category", "deleted_at");

-- CreateIndex
CREATE INDEX "client_documents_status_deleted_at_idx" ON "client_documents"("status", "deleted_at");

-- CreateIndex
CREATE INDEX "client_documents_visibility_deleted_at_idx" ON "client_documents"("visibility", "deleted_at");

-- CreateIndex
CREATE INDEX "client_documents_uploaded_by_id_idx" ON "client_documents"("uploaded_by_id");

-- CreateIndex
CREATE INDEX "client_documents_document_date_idx" ON "client_documents"("document_date");

-- CreateIndex
CREATE INDEX "client_documents_created_at_idx" ON "client_documents"("created_at");

-- CreateIndex
CREATE INDEX "client_documents_checksum_idx" ON "client_documents"("checksum");

-- AddForeignKey
ALTER TABLE "client_documents" ADD CONSTRAINT "client_documents_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_documents" ADD CONSTRAINT "client_documents_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_documents" ADD CONSTRAINT "client_documents_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
