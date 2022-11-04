/*
  Warnings:

  - You are about to alter the column `createdAt` on the `g_idiom_level` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `deleted_at` on the `g_idiom_level` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `g_idiom_level` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `createdAt` on the `g_idiom_words` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `deleted_at` on the `g_idiom_words` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `g_idiom_words` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to drop the `g_idiom_word_difficult` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `g_idiom_level` MODIFY `createdAt` TIMESTAMP NULL,
    MODIFY `deleted_at` TIMESTAMP NULL,
    MODIFY `updated_at` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `g_idiom_words` MODIFY `createdAt` TIMESTAMP NULL,
    MODIFY `deleted_at` TIMESTAMP NULL,
    MODIFY `updated_at` TIMESTAMP NULL;

-- DropTable
DROP TABLE `g_idiom_word_difficult`;

-- CreateTable
CREATE TABLE `g_idiom_chinese` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `word` VARCHAR(191) NOT NULL,
    `pinyin` VARCHAR(191) NOT NULL,
    `explanation` VARCHAR(191) NOT NULL,
    `difficult` INTEGER NULL,
    `createdAt` TIMESTAMP NULL,
    `deleted_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
