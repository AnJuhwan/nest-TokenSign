/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `User_id_userId_key` ON `User`(`id`, `userId`);
