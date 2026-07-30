/*
  Warnings:

  - Added the required column `content_json` to the `template_versions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "TemplateCategory" ADD VALUE 'FICHA';

-- AlterTable
ALTER TABLE "template_versions" ADD COLUMN     "content_json" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "templates" ALTER COLUMN "current_version" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "template_drafts" (
    "id" UUID NOT NULL,
    "template_id" UUID NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "content_json" JSONB NOT NULL,
    "content_html" TEXT NOT NULL,
    "variables" JSONB NOT NULL,
    "signatures" JSONB NOT NULL,
    "page_settings" JSONB NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "template_drafts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "template_drafts_template_id_key" ON "template_drafts"("template_id");

-- AddForeignKey
ALTER TABLE "template_drafts" ADD CONSTRAINT "template_drafts_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_drafts" ADD CONSTRAINT "template_drafts_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
