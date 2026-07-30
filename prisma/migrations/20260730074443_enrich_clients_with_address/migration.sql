-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "birth_date" DATE,
ADD COLUMN     "display_name" VARCHAR(160),
ADD COLUMN     "municipal_registration" VARCHAR(30),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "state_registration" VARCHAR(30),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(160),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(15);

-- CreateTable
CREATE TABLE "client_addresses" (
    "id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "postal_code" VARCHAR(8),
    "street" VARCHAR(160),
    "number" VARCHAR(30),
    "complement" VARCHAR(100),
    "district" VARCHAR(100),
    "city" VARCHAR(100),
    "state" CHAR(2),
    "country" CHAR(2) NOT NULL DEFAULT 'BR',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "client_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "client_addresses_client_id_key" ON "client_addresses"("client_id");

-- CreateIndex
CREATE INDEX "client_addresses_city_state_idx" ON "client_addresses"("city", "state");

-- CreateIndex
CREATE INDEX "clients_name_idx" ON "clients"("name");

-- CreateIndex
CREATE INDEX "clients_email_idx" ON "clients"("email");

-- AddForeignKey
ALTER TABLE "client_addresses" ADD CONSTRAINT "client_addresses_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
