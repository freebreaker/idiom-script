/*
  Warnings:

  - You are about to alter the column `createdAt` on the `g_idiom_level` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `deleted_at` on the `g_idiom_level` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `g_idiom_level` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `createdAt` on the `g_idiom_words` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `deleted_at` on the `g_idiom_words` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `g_idiom_words` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Added the required column `difficult` to the `g_idiom_words` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `g_idiom_level` MODIFY `createdAt` TIMESTAMP NULL,
    MODIFY `deleted_at` TIMESTAMP NULL,
    MODIFY `updated_at` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `g_idiom_words` ADD COLUMN `difficult` INTEGER NOT NULL,
    MODIFY `createdAt` TIMESTAMP NULL,
    MODIFY `deleted_at` TIMESTAMP NULL,
    MODIFY `updated_at` TIMESTAMP NULL;
