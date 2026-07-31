-- CreateEnum
CREATE TYPE "ProcessStatus" AS ENUM ('EM_ANALISE', 'AGUARDANDO_DOCUMENTOS', 'AGUARDANDO_DISTRIBUICAO', 'EM_ANDAMENTO', 'AGUARDANDO_DECISAO', 'SUSPENSO', 'ENCERRADO', 'ARQUIVADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "ProcessType" AS ENUM ('JUDICIAL', 'ADMINISTRATIVO', 'EXTRAJUDICIAL', 'CONSULTIVO');

-- CreateEnum
CREATE TYPE "ProcessClientRole" AS ENUM ('AUTOR', 'REU', 'INTERESSADO', 'TERCEIRO', 'REQUERENTE', 'REQUERIDO', 'EXEQUENTE', 'EXECUTADO', 'RECORRENTE', 'RECORRIDO', 'OUTRO');

-- CreateEnum
CREATE TYPE "ProcessPartyType" AS ENUM ('PESSOA_FISICA', 'PESSOA_JURIDICA', 'ORGAO_PUBLICO', 'OUTRO');

-- CreateEnum
CREATE TYPE "ProcessPartyRole" AS ENUM ('AUTOR', 'REU', 'INTERESSADO', 'TERCEIRO', 'REQUERENTE', 'REQUERIDO', 'EXEQUENTE', 'EXECUTADO', 'RECORRENTE', 'RECORRIDO', 'ADVOGADO', 'REPRESENTANTE', 'TESTEMUNHA', 'OUTRO');

-- CreateEnum
CREATE TYPE "ProcessMovementSource" AS ENUM ('MANUAL', 'TRIBUNAL', 'IMPORTACAO', 'SISTEMA');

-- CreateEnum
CREATE TYPE "ProcessDocumentCategory" AS ENUM ('PETICAO', 'DECISAO', 'SENTENCA', 'ACORDAO', 'CONTRATO', 'PROCURACAO', 'COMPROVANTE', 'PROVA', 'DOCUMENTO_CLIENTE', 'DOCUMENTO_PARTE_CONTRARIA', 'OUTRO');

-- CreateEnum
CREATE TYPE "ProcessDeadlineStatus" AS ENUM ('ABERTO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO', 'VENCIDO');

-- CreateEnum
CREATE TYPE "ProcessActivityType" AS ENUM ('PROCESSO_CRIADO', 'PROCESSO_ATUALIZADO', 'STATUS_ALTERADO', 'MOVIMENTACAO_CRIADA', 'DOCUMENTO_ADICIONADO', 'DOCUMENTO_REMOVIDO', 'PRAZO_CRIADO', 'PRAZO_ATUALIZADO', 'PRAZO_CONCLUIDO', 'PARTE_ADICIONADA', 'PARTE_ATUALIZADA', 'RESPONSAVEL_ALTERADO', 'OUTRO');

-- CreateTable
CREATE TABLE "processes" (
    "id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "attendance_form_id" UUID NOT NULL,
    "internal_code" VARCHAR(40) NOT NULL,
    "number" VARCHAR(30),
    "title" VARCHAR(180) NOT NULL,
    "legal_area" VARCHAR(80) NOT NULL,
    "type" "ProcessType" NOT NULL,
    "status" "ProcessStatus" NOT NULL DEFAULT 'EM_ANALISE',
    "client_role" "ProcessClientRole" NOT NULL,
    "court" VARCHAR(180),
    "court_unit" VARCHAR(180),
    "jurisdiction" VARCHAR(160),
    "state" CHAR(2),
    "filing_date" DATE,
    "closed_at" TIMESTAMPTZ(3),
    "notes" TEXT,
    "responsible_id" UUID NOT NULL,
    "created_by_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "processes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_parties" (
    "id" UUID NOT NULL,
    "process_id" UUID NOT NULL,
    "type" "ProcessPartyType" NOT NULL,
    "role" "ProcessPartyRole" NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "document" VARCHAR(14),
    "email" VARCHAR(254),
    "phone" VARCHAR(15),
    "is_client" BOOLEAN NOT NULL DEFAULT false,
    "representative_name" VARCHAR(180),
    "notes" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_by_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "process_parties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_movements" (
    "id" UUID NOT NULL,
    "process_id" UUID NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "description" TEXT,
    "movement_at" TIMESTAMPTZ(3) NOT NULL,
    "source" "ProcessMovementSource" NOT NULL DEFAULT 'MANUAL',
    "external_code" VARCHAR(100),
    "external_payload" JSONB,
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "process_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_documents" (
    "id" UUID NOT NULL,
    "process_id" UUID NOT NULL,
    "movement_id" UUID,
    "name" VARCHAR(200) NOT NULL,
    "category" "ProcessDocumentCategory" NOT NULL DEFAULT 'OUTRO',
    "storage_key" VARCHAR(500) NOT NULL,
    "original_name" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(120) NOT NULL,
    "size_bytes" BIGINT NOT NULL,
    "checksum" VARCHAR(128),
    "description" VARCHAR(500),
    "uploaded_by_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "process_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_deadlines" (
    "id" UUID NOT NULL,
    "process_id" UUID NOT NULL,
    "movement_id" UUID,
    "title" VARCHAR(180) NOT NULL,
    "description" TEXT,
    "status" "ProcessDeadlineStatus" NOT NULL DEFAULT 'ABERTO',
    "due_at" TIMESTAMPTZ(3) NOT NULL,
    "responsible_id" UUID NOT NULL,
    "completed_by_id" UUID,
    "completed_at" TIMESTAMPTZ(3),
    "created_by_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "process_deadlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_activities" (
    "id" UUID NOT NULL,
    "process_id" UUID NOT NULL,
    "type" "ProcessActivityType" NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "actor_id" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "process_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "processes_attendance_form_id_key" ON "processes"("attendance_form_id");

-- CreateIndex
CREATE UNIQUE INDEX "processes_internal_code_key" ON "processes"("internal_code");

-- CreateIndex
CREATE INDEX "processes_client_id_deleted_at_idx" ON "processes"("client_id", "deleted_at");

-- CreateIndex
CREATE INDEX "processes_responsible_id_deleted_at_idx" ON "processes"("responsible_id", "deleted_at");

-- CreateIndex
CREATE INDEX "processes_status_deleted_at_idx" ON "processes"("status", "deleted_at");

-- CreateIndex
CREATE INDEX "processes_type_deleted_at_idx" ON "processes"("type", "deleted_at");

-- CreateIndex
CREATE INDEX "processes_legal_area_deleted_at_idx" ON "processes"("legal_area", "deleted_at");

-- CreateIndex
CREATE INDEX "processes_number_idx" ON "processes"("number");

-- CreateIndex
CREATE INDEX "processes_filing_date_idx" ON "processes"("filing_date");

-- CreateIndex
CREATE INDEX "processes_updated_at_idx" ON "processes"("updated_at");

-- CreateIndex
CREATE INDEX "process_parties_process_id_deleted_at_idx" ON "process_parties"("process_id", "deleted_at");

-- CreateIndex
CREATE INDEX "process_parties_process_id_role_idx" ON "process_parties"("process_id", "role");

-- CreateIndex
CREATE INDEX "process_parties_document_idx" ON "process_parties"("document");

-- CreateIndex
CREATE INDEX "process_parties_process_id_position_idx" ON "process_parties"("process_id", "position");

-- CreateIndex
CREATE INDEX "process_movements_process_id_movement_at_idx" ON "process_movements"("process_id", "movement_at");

-- CreateIndex
CREATE INDEX "process_movements_process_id_deleted_at_idx" ON "process_movements"("process_id", "deleted_at");

-- CreateIndex
CREATE INDEX "process_movements_source_idx" ON "process_movements"("source");

-- CreateIndex
CREATE INDEX "process_movements_external_code_idx" ON "process_movements"("external_code");

-- CreateIndex
CREATE INDEX "process_documents_process_id_deleted_at_idx" ON "process_documents"("process_id", "deleted_at");

-- CreateIndex
CREATE INDEX "process_documents_movement_id_idx" ON "process_documents"("movement_id");

-- CreateIndex
CREATE INDEX "process_documents_category_deleted_at_idx" ON "process_documents"("category", "deleted_at");

-- CreateIndex
CREATE INDEX "process_documents_uploaded_by_id_idx" ON "process_documents"("uploaded_by_id");

-- CreateIndex
CREATE INDEX "process_documents_created_at_idx" ON "process_documents"("created_at");

-- CreateIndex
CREATE INDEX "process_deadlines_process_id_deleted_at_idx" ON "process_deadlines"("process_id", "deleted_at");

-- CreateIndex
CREATE INDEX "process_deadlines_responsible_id_status_idx" ON "process_deadlines"("responsible_id", "status");

-- CreateIndex
CREATE INDEX "process_deadlines_status_due_at_idx" ON "process_deadlines"("status", "due_at");

-- CreateIndex
CREATE INDEX "process_deadlines_movement_id_idx" ON "process_deadlines"("movement_id");

-- CreateIndex
CREATE INDEX "process_deadlines_due_at_idx" ON "process_deadlines"("due_at");

-- CreateIndex
CREATE INDEX "process_activities_process_id_created_at_idx" ON "process_activities"("process_id", "created_at");

-- CreateIndex
CREATE INDEX "process_activities_actor_id_idx" ON "process_activities"("actor_id");

-- CreateIndex
CREATE INDEX "process_activities_type_idx" ON "process_activities"("type");

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_attendance_form_id_fkey" FOREIGN KEY ("attendance_form_id") REFERENCES "client_attendance_forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_parties" ADD CONSTRAINT "process_parties_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_parties" ADD CONSTRAINT "process_parties_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_parties" ADD CONSTRAINT "process_parties_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_movements" ADD CONSTRAINT "process_movements_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_movements" ADD CONSTRAINT "process_movements_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_documents" ADD CONSTRAINT "process_documents_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_documents" ADD CONSTRAINT "process_documents_movement_id_fkey" FOREIGN KEY ("movement_id") REFERENCES "process_movements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_documents" ADD CONSTRAINT "process_documents_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_deadlines" ADD CONSTRAINT "process_deadlines_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_deadlines" ADD CONSTRAINT "process_deadlines_movement_id_fkey" FOREIGN KEY ("movement_id") REFERENCES "process_movements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_deadlines" ADD CONSTRAINT "process_deadlines_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_deadlines" ADD CONSTRAINT "process_deadlines_completed_by_id_fkey" FOREIGN KEY ("completed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_deadlines" ADD CONSTRAINT "process_deadlines_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_deadlines" ADD CONSTRAINT "process_deadlines_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_activities" ADD CONSTRAINT "process_activities_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_activities" ADD CONSTRAINT "process_activities_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
