-- DropForeignKey
ALTER TABLE `zhangben` DROP FOREIGN KEY `zhangben_uid`;

-- DropForeignKey
ALTER TABLE `zixuan` DROP FOREIGN KEY `zixuan_uid`;

-- AddForeignKey
ALTER TABLE `zhangben` ADD CONSTRAINT `zhangben_uid` FOREIGN KEY (`uid`) REFERENCES `user`(`uid`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `zixuan` ADD CONSTRAINT `zixuan_uid` FOREIGN KEY (`uid`) REFERENCES `user`(`uid`) ON DELETE CASCADE ON UPDATE NO ACTION;
