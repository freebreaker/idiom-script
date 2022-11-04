/*
  Warnings:

  - You are about to alter the column `createdAt` on the `g_idiom_level` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `deleted_at` on the `g_idiom_level` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `g_idiom_level` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `g_idiom_level` MODIFY `createdAt` TIMESTAMP NULL,
    MODIFY `deleted_at` TIMESTAMP NULL,
    MODIFY `updated_at` TIMESTAMP NULL;

-- CreateTable
CREATE TABLE `g_idiom_words` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `pinyin` VARCHAR(191) NOT NULL,
    `meaning` VARCHAR(191) NOT NULL,
    `level_id` INTEGER NOT NULL,
    `createdAt` TIMESTAMP NULL,
    `deleted_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
