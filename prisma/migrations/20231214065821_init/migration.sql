-- AlterTable
ALTER TABLE `User` MODIFY `status` ENUM('Ready', 'Ok') NOT NULL DEFAULT 'Ready';
