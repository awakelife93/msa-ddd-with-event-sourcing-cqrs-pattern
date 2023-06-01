/*
  Warnings:

  - You are about to drop the column `authorName` on the `post` table. All the data in the column will be lost.
  - Added the required column `author_name` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` DROP COLUMN `authorName`,
    ADD COLUMN `author_name` VARCHAR(191) NOT NULL;
