/*
 Navicat Premium Data Transfer

 Source Server         : root
 Source Server Type    : MySQL
 Source Server Version : 80033
 Source Host           : localhost:3306
 Source Schema         : digital_warehouse

 Target Server Type    : MySQL
 Target Server Version : 80033
 File Encoding         : 65001

 Date: 29/01/2024 20:13:59
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for event
-- ----------------------------
DROP TABLE IF EXISTS `event`;
CREATE TABLE `event` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `eventTime` timestamp NULL DEFAULT NULL,
  `eventName` varchar(255) NOT NULL,
  `licensePlate` varchar(255) DEFAULT NULL,
  `detail` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of event
-- ----------------------------
BEGIN;
INSERT INTO `event` VALUES (1, '2024-01-27 20:39:54', '非机动车', NULL, NULL);
INSERT INTO `event` VALUES (2, '2024-01-18 22:20:11', '车辆越线', '桂M·G7D89', '/aaa.png');
INSERT INTO `event` VALUES (3, '2023-12-28 22:13:00', '车辆越线', '桂M·G7D89', '/aaa.png');
INSERT INTO `event` VALUES (4, '2024-01-28 22:13:00', '车辆越线', '桂M·G7D89', '/aaa.png');
INSERT INTO `event` VALUES (5, '2024-01-28 22:14:00', '行人越线', NULL, NULL);
INSERT INTO `event` VALUES (6, '2024-01-19 15:50:58', '非机动车', NULL, NULL);
INSERT INTO `event` VALUES (7, '2024-01-18 16:12:33', '车辆越线', '桂M·G7D89', '/aaa.png');
INSERT INTO `event` VALUES (8, '2024-01-29 09:52:01', '车辆越线', '桂M·G7D89', '/aaa.png');
INSERT INTO `event` VALUES (9, '2024-01-20 10:33:31', '非机动车', NULL, NULL);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
