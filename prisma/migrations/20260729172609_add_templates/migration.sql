-- CreateEnum
CREATE TYPE "TemplateStatus" AS ENUM ('RASCUNHO', 'ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "TemplateCategory" AS ENUM ('CONTRATO', 'PETICAO', 'PROCURACAO', 'NOTIFICACAO', 'OUTRO');

-- CreateTable
CREATE TABLE "templates" (
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "description" VARCHAR(500),
    "category" "TemplateCategory" NOT NULL,
    "legal_area" VARCHAR(80),
    "status" "TemplateStatus" NOT NULL DEFAULT 'RASCUNHO',
    "current_version" INTEGER NOT NULL DEFAULT 1,
    "created_by_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_versions" (
    "id" UUID NOT NULL,
    "template_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "content_html" TEXT NOT NULL,
    "variables" JSONB NOT NULL,
    "signatures" JSONB NOT NULL,
    "page_settings" JSONB NOT NULL,
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "template_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "templates_status_deleted_at_idx" ON "templates"("status", "deleted_at");

-- CreateIndex
CREATE INDEX "templates_category_deleted_at_idx" ON "templates"("category", "deleted_at");

-- CreateIndex
CREATE INDEX "templates_legal_area_deleted_at_idx" ON "templates"("legal_area", "deleted_at");

-- CreateIndex
CREATE INDEX "templates_updated_at_idx" ON "templates"("updated_at");

-- CreateIndex
CREATE INDEX "template_versions_template_id_created_at_idx" ON "template_versions"("template_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "template_versions_template_id_version_key" ON "template_versions"("template_id", "version");

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_versions" ADD CONSTRAINT "template_versions_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_versions" ADD CONSTRAINT "template_versions_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
