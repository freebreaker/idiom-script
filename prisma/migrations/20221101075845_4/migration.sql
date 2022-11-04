/*
  Warnings:

  - You are about to alter the column `createdAt` on the `g_idiom_level` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `deleted_at` on the `g_idiom_level` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `g_idiom_level` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `createdAt` on the `g_idiom_words` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `deleted_at` on the `g_idiom_words` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `g_idiom_words` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `g_idiom_level` MODIFY `createdAt` TIMESTAMP NULL,
    MODIFY `deleted_at` TIMESTAMP NULL,
    MODIFY `updated_at` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `g_idiom_words` MODIFY `createdAt` TIMESTAMP NULL,
    MODIFY `deleted_at` TIMESTAMP NULL,
    MODIFY `updated_at` TIMESTAMP NULL;
