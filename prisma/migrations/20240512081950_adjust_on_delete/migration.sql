/*
  Warnings:

  - The primary key for the `zhangben` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `zixuan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `admin` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `flist` MODIFY `rate` DOUBLE NULL DEFAULT 0,
    MODIFY `value` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `admin` BOOLEAN NOT NULL,
    MODIFY `password` VARCHAR(32) NOT NULL;

-- AlterTable
ALTER TABLE `zhangben` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`fid`, `uid`);

-- AlterTable
ALTER TABLE `zixuan` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`fid`, `uid`);

-- CreateTable
CREATE TABLE `funds` (
    `fid` CHAR(6) NOT NULL,
    `pinyin` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `leixin` VARCHAR(255) NOT NULL,
    `rate` DOUBLE NULL,
    `value` DOUBLE NULL,

    PRIMARY KEY (`fid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- RenameIndex
ALTER TABLE `zhangben` RENAME INDEX `zhangben_uid` TO `zhangben_user_uid_fk`;

-- RenameIndex
ALTER TABLE `zixuan` RENAME INDEX `zixuan_uid` TO `zixuan_user_uid_fk`;
