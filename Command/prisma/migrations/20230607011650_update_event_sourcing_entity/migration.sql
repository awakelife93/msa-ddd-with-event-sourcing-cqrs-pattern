/*
  Warnings:

  - You are about to drop the column `updated_at` on the `post` table. All the data in the column will be lost.
  - Added the required column `post_id` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` DROP COLUMN `updated_at`,
    ADD COLUMN `post_id` INTEGER NOT NULL,
    ADD COLUMN `version` INTEGER NOT NULL;
