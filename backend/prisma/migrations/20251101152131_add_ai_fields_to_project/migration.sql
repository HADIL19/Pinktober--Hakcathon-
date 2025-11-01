-- AlterTable
ALTER TABLE `project` ADD COLUMN `impactScore` INTEGER NULL,
    ADD COLUMN `shortFeedback` VARCHAR(191) NULL,
    ADD COLUMN `strengths` VARCHAR(191) NULL,
    ADD COLUMN `weaknesses` VARCHAR(191) NULL;
