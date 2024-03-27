-- CreateTable
CREATE TABLE `config` (
    `listtime` VARCHAR(32) NULL,
    `ratetime` VARCHAR(32) NULL,
    `rt_time` VARCHAR(32) NULL,
    `his_time` VARCHAR(32) NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fdata` (
    `fid` VARCHAR(6) NOT NULL,
    `w01` DOUBLE NULL,
    `w02` DOUBLE NULL,
    `w03` DOUBLE NULL,
    `w04` DOUBLE NULL,
    `M01` DOUBLE NULL,
    `w05` DOUBLE NULL,
    `w06` DOUBLE NULL,
    `w07` DOUBLE NULL,
    `w08` DOUBLE NULL,
    `M02` DOUBLE NULL,
    `name` VARCHAR(60) NULL,
    `Value` DOUBLE NULL,
    `Rate` DOUBLE NULL,
    `R01` DOUBLE NULL,
    `R02` DOUBLE NULL,
    `R03` DOUBLE NULL,
    `R04` DOUBLE NULL,
    `R05` DOUBLE NULL,
    `R06` DOUBLE NULL,
    `R07` DOUBLE NULL,
    `R08` DOUBLE NULL,
    `R09` DOUBLE NULL,
    `R10` DOUBLE NULL,
    `R11` DOUBLE NULL,
    `R12` DOUBLE NULL,
    `R13` DOUBLE NULL,
    `R14` DOUBLE NULL,
    `R15` DOUBLE NULL,
    `R16` DOUBLE NULL,
    `R17` DOUBLE NULL,
    `R18` DOUBLE NULL,
    `R19` DOUBLE NULL,
    `R20` DOUBLE NULL,
    `R21` DOUBLE NULL,
    `R22` DOUBLE NULL,
    `R23` DOUBLE NULL,
    `R24` DOUBLE NULL,
    `R25` DOUBLE NULL,
    `R26` DOUBLE NULL,
    `R27` DOUBLE NULL,
    `R28` DOUBLE NULL,
    `R29` DOUBLE NULL,
    `R30` DOUBLE NULL,
    `R31` DOUBLE NULL,
    `R32` DOUBLE NULL,
    `R33` DOUBLE NULL,
    `R34` DOUBLE NULL,
    `R35` DOUBLE NULL,
    `R36` DOUBLE NULL,
    `R37` DOUBLE NULL,
    `R38` DOUBLE NULL,
    `R39` DOUBLE NULL,
    `R40` DOUBLE NULL,
    `pinyin` VARCHAR(32) NULL,
    `bh` INTEGER NULL,

    PRIMARY KEY (`fid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flist` (
    `fid` VARCHAR(6) NOT NULL,
    `name` VARCHAR(255) NULL,
    `rate` DOUBLE NULL,
    `leixin` VARCHAR(255) NULL,
    `pinyin` VARCHAR(255) NULL,
    `value` DOUBLE NOT NULL,

    PRIMARY KEY (`fid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oprec` (
    `bh` INTEGER NOT NULL,
    `fid` VARCHAR(6) NULL,
    `name` VARCHAR(60) NULL,
    `rq` VARCHAR(255) NULL,
    `tianshu` INTEGER NULL,
    `shouyilv` DOUBLE NULL,
    `gushouyi` DOUBLE NULL,
    `gujinzhi` DOUBLE NULL,
    `jinzhi` DOUBLE NULL,
    `fenshu` DOUBLE NULL,
    `s_shouyilv` DOUBLE NULL,
    `s_gushouyi` DOUBLE NULL,
    `s_gujinzhi` DOUBLE NULL,
    `s_jinzhi` DOUBLE NULL,
    `s_fenshu` DOUBLE NULL,
    `s_fid` VARCHAR(6) NULL,
    `s_name` VARCHAR(64) NULL,
    `zhuangtai` VARCHAR(255) NULL,
    `shuomin` VARCHAR(255) NULL,

    PRIMARY KEY (`bh`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `uid` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(10) NOT NULL,
    `password` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `zhangben` (
    `fid` VARCHAR(6) NOT NULL,
    `name` VARCHAR(60) NULL,
    `fenshu` DOUBLE NULL,
    `yuanjia` DOUBLE NULL,
    `yuanzhi` DOUBLE NULL,
    `xianjia` DOUBLE NULL,
    `xianzhi` DOUBLE NULL,
    `shouyi` DOUBLE NULL,
    `shouyilv` DOUBLE NULL,
    `guzhi` DOUBLE NULL,
    `gujia` DOUBLE NULL,
    `gushouyi` DOUBLE NULL,
    `shuomin` VARCHAR(255) NULL,
    `newjia` DOUBLE NULL,
    `newzhi` DOUBLE NULL,
    `newshouyi` DOUBLE NULL,
    `bh` CHAR(1) NULL,
    `uid` INTEGER NOT NULL,

    INDEX `zhangben_uid`(`uid`),
    PRIMARY KEY (`fid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `zixuan` (
    `fid` VARCHAR(6) NOT NULL,
    `w01` DOUBLE NULL,
    `w02` DOUBLE NULL,
    `w03` DOUBLE NULL,
    `w04` DOUBLE NULL,
    `M01` DOUBLE NULL,
    `w05` DOUBLE NULL,
    `w06` DOUBLE NULL,
    `w07` DOUBLE NULL,
    `w08` DOUBLE NULL,
    `M02` DOUBLE NULL,
    `name` VARCHAR(60) NULL,
    `Value` DOUBLE NULL,
    `Rate` DOUBLE NULL,
    `R01` DOUBLE NULL,
    `R02` DOUBLE NULL,
    `R03` DOUBLE NULL,
    `R04` DOUBLE NULL,
    `R05` DOUBLE NULL,
    `R06` DOUBLE NULL,
    `R07` DOUBLE NULL,
    `R08` DOUBLE NULL,
    `R09` DOUBLE NULL,
    `R10` DOUBLE NULL,
    `R11` DOUBLE NULL,
    `R12` DOUBLE NULL,
    `R13` DOUBLE NULL,
    `R14` DOUBLE NULL,
    `R15` DOUBLE NULL,
    `R16` DOUBLE NULL,
    `R17` DOUBLE NULL,
    `R18` DOUBLE NULL,
    `R19` DOUBLE NULL,
    `R20` DOUBLE NULL,
    `R21` DOUBLE NULL,
    `R22` DOUBLE NULL,
    `R23` DOUBLE NULL,
    `R24` DOUBLE NULL,
    `R25` DOUBLE NULL,
    `R26` DOUBLE NULL,
    `R27` DOUBLE NULL,
    `R28` DOUBLE NULL,
    `R29` DOUBLE NULL,
    `R30` DOUBLE NULL,
    `R31` DOUBLE NULL,
    `R32` DOUBLE NULL,
    `R33` DOUBLE NULL,
    `R34` DOUBLE NULL,
    `R35` DOUBLE NULL,
    `R36` DOUBLE NULL,
    `R37` DOUBLE NULL,
    `R38` DOUBLE NULL,
    `R39` DOUBLE NULL,
    `R40` DOUBLE NULL,
    `pinyin` VARCHAR(32) NULL,
    `bh` CHAR(1) NULL,
    `uid` INTEGER NOT NULL,

    INDEX `zixuan_uid`(`uid`),
    PRIMARY KEY (`fid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `zhangben` ADD CONSTRAINT `zhangben_uid` FOREIGN KEY (`uid`) REFERENCES `user`(`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `zixuan` ADD CONSTRAINT `zixuan_uid` FOREIGN KEY (`uid`) REFERENCES `user`(`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

