-- AlterTable
ALTER TABLE `Mail` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `User` MODIFY `deleted` BOOLEAN NOT NULL DEFAULT false;
