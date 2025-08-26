-- CreateTable
CREATE TABLE "public"."Tenant" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "dob" TIMESTAMP(3),
    "nationalId" TEXT,
    "hometown" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "temporaryResidence" TEXT,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Room" (
    "id" SERIAL NOT NULL,
    "roomName" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RoomTenant" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "RoomTenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Setting" (
    "id" SERIAL NOT NULL,
    "electricPrice" DOUBLE PRECISION NOT NULL,
    "waterPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Usage" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "electricReading" DOUBLE PRECISION NOT NULL,
    "waterReading" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Invoice" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "roomPrice" DOUBLE PRECISION NOT NULL,
    "electricCost" DOUBLE PRECISION NOT NULL,
    "waterCost" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNPAID',

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."RoomTenant" ADD CONSTRAINT "RoomTenant_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RoomTenant" ADD CONSTRAINT "RoomTenant_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Usage" ADD CONSTRAINT "Usage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
