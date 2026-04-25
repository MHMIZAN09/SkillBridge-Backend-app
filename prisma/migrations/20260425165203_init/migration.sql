-- CreateEnum
CREATE TYPE "UsersRole" AS ENUM ('ADMIN', 'STUDENT', 'TUTOR');

-- CreateEnum
CREATE TYPE "UsersStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BANNED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UsersRole" NOT NULL DEFAULT 'STUDENT',
    "status" "UsersStatus" NOT NULL DEFAULT 'ACTIVE',
    "image" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tutor_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "specialty" TEXT,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "hourlyRate" DECIMAL(65,30),
    "location" TEXT,
    "expertise" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "socialLinks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "totalMentoringMins" INTEGER NOT NULL DEFAULT 0,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tutor_profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tutor_profile_userId_key" ON "tutor_profile"("userId");

-- AddForeignKey
ALTER TABLE "tutor_profile" ADD CONSTRAINT "tutor_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
