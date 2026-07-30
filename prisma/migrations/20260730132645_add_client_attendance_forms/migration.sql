-- CreateEnum
CREATE TYPE "AttendanceFormStatus" AS ENUM ('RASCUNHO', 'FINALIZADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "AttendanceChannel" AS ENUM ('PRESENCIAL', 'TELEFONE', 'VIDEOCHAMADA', 'EMAIL', 'WHATSAPP', 'OUTRO');

-- CreateEnum
CREATE TYPE "ClientAttendanceActionType" AS ENUM ('SOLICITAR_DOCUMENTOS', 'ANALISAR_DOCUMENTOS', 'SOLICITAR_INFORMACOES_COMPLEMENTARES', 'CONSULTAR_PROCESSO_EXISTENTE', 'REALIZAR_PESQUISA_JURIDICA', 'ELABORAR_PARECER', 'ELABORAR_CONTRATO_OU_ADITIVO', 'ELABORAR_NOTIFICACAO_EXTRAJUDICIAL', 'ELABORAR_PETICAO', 'PROPOR_ACAO_JUDICIAL', 'APRESENTAR_DEFESA', 'ABRIR_PROCESSO_INTERNO', 'AGENDAR_RETORNO', 'ENVIAR_PROPOSTA_HONORARIOS', 'ENCAMINHAR_OUTRA_AREA', 'ENCERRAR_SEM_PROVIDENCIAS');

-- CreateTable
CREATE TABLE "client_attendance_forms" (
    "id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "client_snapshot" JSONB NOT NULL,
    "client_snapshot_version" INTEGER NOT NULL DEFAULT 1,
    "status" "AttendanceFormStatus" NOT NULL DEFAULT 'RASCUNHO',
    "revision" INTEGER NOT NULL DEFAULT 1,
    "attendance_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "channel" "AttendanceChannel",
    "contact_person" VARCHAR(160),
    "subject" VARCHAR(180),
    "legal_area" VARCHAR(80),
    "client_report" TEXT,
    "preliminary_analysis" TEXT,
    "responsible_id" UUID NOT NULL,
    "created_by_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "finalized_by_id" UUID,
    "finalized_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "client_attendance_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_attendance_actions" (
    "id" UUID NOT NULL,
    "attendance_form_id" UUID NOT NULL,
    "type" "ClientAttendanceActionType" NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_attendance_actions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "client_attendance_forms_client_id_deleted_at_idx" ON "client_attendance_forms"("client_id", "deleted_at");

-- CreateIndex
CREATE INDEX "client_attendance_forms_responsible_id_deleted_at_idx" ON "client_attendance_forms"("responsible_id", "deleted_at");

-- CreateIndex
CREATE INDEX "client_attendance_forms_status_deleted_at_idx" ON "client_attendance_forms"("status", "deleted_at");

-- CreateIndex
CREATE INDEX "client_attendance_forms_attendance_at_idx" ON "client_attendance_forms"("attendance_at");

-- CreateIndex
CREATE INDEX "client_attendance_forms_legal_area_idx" ON "client_attendance_forms"("legal_area");

-- CreateIndex
CREATE INDEX "client_attendance_forms_updated_at_idx" ON "client_attendance_forms"("updated_at");

-- CreateIndex
CREATE INDEX "client_attendance_actions_attendance_form_id_position_idx" ON "client_attendance_actions"("attendance_form_id", "position");

-- CreateIndex
CREATE INDEX "client_attendance_actions_type_idx" ON "client_attendance_actions"("type");

-- CreateIndex
CREATE UNIQUE INDEX "client_attendance_actions_attendance_form_id_type_key" ON "client_attendance_actions"("attendance_form_id", "type");

-- AddForeignKey
ALTER TABLE "client_attendance_forms" ADD CONSTRAINT "client_attendance_forms_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_attendance_forms" ADD CONSTRAINT "client_attendance_forms_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_attendance_forms" ADD CONSTRAINT "client_attendance_forms_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_attendance_forms" ADD CONSTRAINT "client_attendance_forms_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_attendance_forms" ADD CONSTRAINT "client_attendance_forms_finalized_by_id_fkey" FOREIGN KEY ("finalized_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_attendance_actions" ADD CONSTRAINT "client_attendance_actions_attendance_form_id_fkey" FOREIGN KEY ("attendance_form_id") REFERENCES "client_attendance_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
