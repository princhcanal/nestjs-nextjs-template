-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roles" "Role"[] DEFAULT ARRAY['USER']::"Role"[];

UPDATE "User"
SET "roles" = ARRAY['USER']::"Role"[]
WHERE "roles" = NULL;
