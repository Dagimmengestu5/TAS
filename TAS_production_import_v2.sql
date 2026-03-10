-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: TAS
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `application_messages`
--

DROP TABLE IF EXISTS `application_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `application_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `application_messages_application_id_foreign` (`application_id`),
  KEY `application_messages_user_id_foreign` (`user_id`),
  CONSTRAINT `application_messages_application_id_foreign` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE,
  CONSTRAINT `application_messages_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_messages`
--

LOCK TABLES `application_messages` WRITE;
/*!40000 ALTER TABLE `application_messages` DISABLE KEYS */;
INSERT INTO `application_messages` VALUES (1,7,11,'ok but i will in the office not come','2026-03-03 09:37:36','2026-03-03 10:45:19',1),(2,7,11,'ok please answer me','2026-03-03 09:50:12','2026-03-03 10:45:19',1),(3,7,3,'ok were did you come','2026-03-03 09:50:55','2026-03-03 11:00:32',1),(4,7,3,'oo so i post the offer in my admin','2026-03-03 10:31:00','2026-03-03 11:00:32',1),(5,7,3,'ate brather how are you','2026-03-03 10:46:00','2026-03-03 11:00:32',1),(6,7,3,'and could you change to the backend to in your project','2026-03-03 10:46:44','2026-03-03 11:00:32',1),(7,7,11,'ok','2026-03-03 11:01:17','2026-03-03 11:03:32',1),(8,7,11,'ok i will see you','2026-03-03 11:02:31','2026-03-03 11:03:32',1),(9,7,3,'stay interview','2026-03-04 03:08:33','2026-03-04 03:09:14',1),(10,8,3,'hi bro how was you day','2026-03-04 04:14:48','2026-03-04 04:15:46',1),(11,8,12,'ok i will see you','2026-03-04 05:41:55','2026-03-04 05:42:59',1),(12,9,3,'what do you think about offer','2026-03-04 06:16:28','2026-03-04 06:16:47',1),(13,9,13,'i accept the offer i will get in office march 7','2026-03-04 06:17:10','2026-03-04 06:17:46',1);
/*!40000 ALTER TABLE `application_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application_status_histories`
--

DROP TABLE IF EXISTS `application_status_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_status_histories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `application_id` bigint unsigned NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `feedback` text COLLATE utf8mb4_unicode_ci,
  `document_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `application_status_histories_application_id_foreign` (`application_id`),
  KEY `application_status_histories_user_id_foreign` (`user_id`),
  CONSTRAINT `application_status_histories_application_id_foreign` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE,
  CONSTRAINT `application_status_histories_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_status_histories`
--

LOCK TABLES `application_status_histories` WRITE;
/*!40000 ALTER TABLE `application_status_histories` DISABLE KEYS */;
INSERT INTO `application_status_histories` VALUES (1,1,'pooled','Auto-routed to Candidate Pool due to professional background mismatch.',NULL,'2026-03-03 00:15:52','2026-03-03 00:15:52',1),(2,2,'pooled','Auto-routed to Candidate Pool due to professional background mismatch.',NULL,'2026-03-03 00:23:22','2026-03-03 00:23:22',1),(3,3,'pooled','Auto-routed to Candidate Pool due to professional background mismatch.',NULL,'2026-03-03 00:45:47','2026-03-03 00:45:47',5),(4,3,'written_test','please come to office',NULL,'2026-03-03 00:50:52','2026-03-03 00:50:52',3),(5,3,'interview_1','the first interview',NULL,'2026-03-03 00:51:21','2026-03-03 00:51:21',3),(6,3,'interview_2','Interview scheduled for March 11, 2026, 2:33 pm at https://maps.app.goo.gl/kdJ5ogjUcy1gZtP28. Notes: ok i will see you in office',NULL,'2026-03-03 05:34:44','2026-03-03 05:34:44',3),(7,4,'submitted','Initial application synchronization.',NULL,'2026-03-03 07:13:17','2026-03-03 07:13:17',3),(8,5,'submitted','Initial application synchronization.',NULL,'2026-03-03 07:16:39','2026-03-03 07:16:39',10),(9,5,'written_test','please come to office',NULL,'2026-03-03 07:38:24','2026-03-03 07:38:24',3),(10,5,'interview_1','Interview scheduled for March 4, 2026, 2:38 pm at https://maps.app.goo.gl/kdJ5ogjUcy1gZtP28. Notes: ok you arr pass to interview',NULL,'2026-03-03 07:39:25','2026-03-03 07:39:25',3),(11,5,'interview_2','Interview scheduled for March 3, 2026, 2:40 pm at https://maps.app.goo.gl/kdJ5ogjUcy1gZtP28. Notes: no',NULL,'2026-03-03 07:40:15','2026-03-03 07:40:15',3),(12,5,'offer','ok please kow this','offers/jkztpErkqmsdP6r1Ll7KuhUl0LvB7euNa6e2e1E8.pdf','2026-03-03 07:40:57','2026-03-03 07:40:57',3),(13,5,'hired','ok you are hired in the droga',NULL,'2026-03-03 07:54:51','2026-03-03 07:54:51',3),(14,6,'pooled','Auto-routed to Candidate Pool: Background/Education does not match job category (Information Technology).',NULL,'2026-03-03 08:51:51','2026-03-03 08:51:51',10),(15,7,'submitted','Initial application synchronization.',NULL,'2026-03-03 08:59:32','2026-03-03 08:59:32',11),(16,7,'written_test','you are in the writing test come heir or use in online',NULL,'2026-03-03 09:01:18','2026-03-03 09:01:18',3),(17,7,'interview_1','Interview scheduled for March 3, 2026, 5:03 am at https://maps.app.goo.gl/kdJ5ogjUcy1gZtP28. Notes: come in office',NULL,'2026-03-03 09:02:04','2026-03-03 09:02:04',3),(18,7,'interview_2','Interview scheduled for March 19, 2026, 3:37 pm at https://maps.app.goo.gl/kdJ5ogjUcy1gZtP28. Notes: good',NULL,'2026-03-03 09:35:27','2026-03-03 09:35:27',3),(19,7,'offer','ok','offers/cxA8ttsmv58Faz1hSSrDwDtqEUlbtoSf2DL5imS3.docx','2026-03-03 09:36:31','2026-03-03 09:36:31',3),(20,8,'submitted','Initial application synchronization.',NULL,'2026-03-04 03:51:17','2026-03-04 03:51:17',12),(21,8,'written_test','ok',NULL,'2026-03-04 03:53:27','2026-03-04 03:53:27',3),(22,8,'interview_1','Interview scheduled for March 4, 2026, 9:59 am at droga pharma rufael. Notes: ok',NULL,'2026-03-04 03:54:17','2026-03-04 03:54:17',3),(23,8,'interview_2','Interview scheduled for March 4, 2026, 10:17 am at https://maps.app.goo.gl/kdJ5ogjUcy1gZtP28. Notes: dgf',NULL,'2026-03-04 04:12:41','2026-03-04 04:12:41',3),(24,8,'offer','ok','offers/SdQABRUEkvdqSQJ0nSKTVSGfzBjskC5oBbMU1LK3.pdf','2026-03-04 04:13:50','2026-03-04 04:13:50',3),(25,9,'pooled','Auto-routed to Candidate Pool: Background/Education does not match job category (Information Technology).',NULL,'2026-03-04 05:52:42','2026-03-04 05:52:42',13),(26,9,'written_test','please come to in office',NULL,'2026-03-04 05:57:07','2026-03-04 05:57:07',3),(27,9,'written_test','please come to in office',NULL,'2026-03-04 05:57:12','2026-03-04 05:57:12',3),(28,9,'interview_1','Interview scheduled for March 6, 2026, 1:05 pm at https://maps.app.goo.gl/kdJ5ogjUcy1gZtP28. Notes: please see our office for interview',NULL,'2026-03-04 06:13:34','2026-03-04 06:13:34',3),(29,9,'interview_2','Interview scheduled for March 5, 2026, 12:00 am at https://maps.app.goo.gl/kdJ5ogjUcy1gZtP28. Notes: asdfasdf',NULL,'2026-03-04 06:15:03','2026-03-04 06:15:03',3),(30,9,'offer','do you agreee',NULL,'2026-03-04 06:15:24','2026-03-04 06:15:24',3),(31,10,'pooled','Auto-routed to Candidate Pool: Background/Education does not match job category (Information Technology).',NULL,'2026-03-05 07:55:14','2026-03-05 07:55:14',3),(32,11,'pooled','Auto-routed to Candidate Pool: Background/Education does not match job category (Information Technology).',NULL,'2026-03-05 08:42:10','2026-03-05 08:42:10',13),(33,12,'submitted','Initial application synchronization.',NULL,'2026-03-05 09:34:19','2026-03-05 09:34:19',13),(34,9,'hired','ok congratulation you are hired in Droga',NULL,'2026-03-05 09:37:02','2026-03-05 09:37:02',3),(35,13,'submitted','this is the my firs job to in developer coding so give me the opportunity and i appreciate you',NULL,'2026-03-06 05:02:06','2026-03-06 05:02:06',3),(36,14,'pooled','Auto-routed to Candidate Pool: Background/Education does not match job category (Information Technology).',NULL,'2026-03-06 08:00:52','2026-03-06 08:00:52',11),(37,14,'written_test','please come Monday 12 pm',NULL,'2026-03-06 08:03:05','2026-03-06 08:03:05',3),(38,14,'interview_1','Interview scheduled for March 8, 2026, 12:00 am at . Notes: in writing test you have 90% mark',NULL,'2026-03-06 08:07:38','2026-03-06 08:07:38',3);
/*!40000 ALTER TABLE `application_status_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `job_posting_id` bigint unsigned NOT NULL,
  `candidate_id` bigint unsigned NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'submitted',
  `feedback` text COLLATE utf8mb4_unicode_ci,
  `test_score` double DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `applications_job_posting_id_foreign` (`job_posting_id`),
  KEY `applications_candidate_id_foreign` (`candidate_id`),
  CONSTRAINT `applications_candidate_id_foreign` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE,
  CONSTRAINT `applications_job_posting_id_foreign` FOREIGN KEY (`job_posting_id`) REFERENCES `job_postings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (1,1,1,NULL,'pooled',NULL,NULL,'2026-03-03 00:15:52','2026-03-03 00:15:52'),(2,2,1,NULL,'pooled',NULL,NULL,'2026-03-03 00:23:22','2026-03-03 00:23:22'),(3,2,2,NULL,'interview_2','Interview scheduled for March 11, 2026, 2:33 pm at https://maps.app.goo.gl/kdJ5ogjUcy1gZtP28. Notes: ok i will see you in office',NULL,'2026-03-03 00:45:47','2026-03-03 05:34:44'),(4,3,3,'this is the best position of me','submitted',NULL,NULL,'2026-03-03 07:13:17','2026-03-03 07:13:17'),(5,3,4,'good','hired','ok you are hired in the droga',NULL,'2026-03-03 07:16:39','2026-03-03 07:54:51'),(6,3,5,'yes plesae hire me','pooled',NULL,NULL,'2026-03-03 08:51:51','2026-03-03 08:51:51'),(7,2,5,'yes plese hire me aSAP','offer','ok',NULL,'2026-03-03 08:59:32','2026-03-03 09:36:31'),(8,2,6,'test','offer','ok',NULL,'2026-03-04 03:51:17','2026-03-04 04:13:50'),(9,3,7,'dfasdfasdf','hired','ok congratulation you are hired in Droga',NULL,'2026-03-04 05:52:41','2026-03-05 09:37:02'),(10,1,3,'ok','pooled',NULL,NULL,'2026-03-05 07:55:14','2026-03-05 07:55:14'),(11,1,7,'ok','pooled',NULL,NULL,'2026-03-05 08:42:10','2026-03-05 08:42:10'),(12,4,7,'sdf','submitted',NULL,NULL,'2026-03-05 09:34:19','2026-03-05 09:34:19'),(13,4,3,'this is the my firs job to in developer coding so give me the opportunity and i appreciate you','submitted',NULL,NULL,'2026-03-06 05:02:06','2026-03-06 05:02:06'),(14,4,5,'this is dagi','interview_1','Interview scheduled for March 8, 2026, 12:00 am at . Notes: in writing test you have 90% mark',NULL,'2026-03-06 08:00:52','2026-03-06 08:07:38');
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidates`
--

DROP TABLE IF EXISTS `candidates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `age` int DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `professional_background` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `years_of_experience` int NOT NULL DEFAULT '0',
  `cv_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `institution_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cgpa` decimal(3,2) DEFAULT NULL,
  `current_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `work_experience` json DEFAULT NULL,
  `qualifications` json DEFAULT NULL,
  `certifications` json DEFAULT NULL,
  `languages` json DEFAULT NULL,
  `skills` json DEFAULT NULL,
  `experience_certificates` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `candidates_email_unique` (`email`),
  KEY `candidates_user_id_foreign` (`user_id`),
  CONSTRAINT `candidates_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidates`
--

LOCK TABLES `candidates` WRITE;
/*!40000 ALTER TABLE `candidates` DISABLE KEYS */;
INSERT INTO `candidates` VALUES (1,1,'dagi man',22,'dagimmengestu5@gmail.com',NULL,'Male','test',6,'cvs/2dE0qS6WHv1nV2VcyJXaAJjYQocbXSfAkJ5QLYXd.pdf','SOftware enginering',3.50,'droga pharma','2026-03-03 00:15:52','2026-03-03 00:23:22',NULL,NULL,NULL,NULL,NULL,NULL),(2,5,'user',21,'dagi5tube@gmail.com',NULL,'Male','this is in the good',5,'cvs/vfORRtGoaGOpYkX1CHPpQFsuWgNSu8unx94o0Dn1.pdf','computer enginering',4.00,'droga','2026-03-03 00:45:47','2026-03-03 00:45:47',NULL,NULL,NULL,NULL,NULL,NULL),(3,3,'Dagi Man',225,'dagitach@gmail.com','0921548721','Male','developer coder',2,'cvs/Ekxwe4LuatbkndOC06L7YB33fmedzfAXTnOmBZfz.pdf','droga',2.00,'addis abeba','2026-03-03 07:13:17','2026-03-06 05:02:06',NULL,NULL,NULL,NULL,NULL,NULL),(4,10,'ዳግም መንግስቱ',26,'dagimmengistuz5@gmail.com','+251915151542','Male','software enginering',6,'cvs/GgSqFiTUhpkoWJfZC2qTURwQw3SObtAbxflIPpwV.pdf','misrak',3.50,'paster','2026-03-03 07:16:39','2026-03-03 07:16:39',NULL,NULL,NULL,NULL,NULL,NULL),(5,11,'etago',24,'hnsh0977@gmail.com','0987323222','Male','pharmacist',3,'cvs/bvj98l7jhqmFyhNB5SMUY5bQUaxrHODRrmwbAjvQ.pdf','AAU',3.90,'yeka','2026-03-03 08:51:51','2026-03-06 08:00:52',NULL,NULL,NULL,NULL,NULL,NULL),(6,12,'dagim',24,'dagim@drogapharma.com','+251915151542','Male','backend Developer',3,'cvs/1enIaDTuxQ3RhxfMQtYB5MrDclGkH6ONNZijIZ33.pdf','misrak',3.50,'paster','2026-03-04 03:51:17','2026-03-04 05:12:51','[{\"title\": \"backend developer\", \"company\": \"manage host\", \"duration\": \"2012 - 2025\", \"description\": \"i have more exprianced\"}, {\"title\": \"frontend\", \"company\": \"create react\", \"duration\": \"2012 - 2045\", \"description\": \"ok i will do\"}]','[{\"year\": \"\", \"degree\": \"\", \"institution\": \"\"}]','[{\"id\": null, \"name\": null, \"issuer\": null}]','[]','[{\"name\": \"snifing\", \"level\": \"Beginner\"}]','[{\"name\": \"\", \"file_path\": \"\"}]'),(7,13,'heaven',24,'hr@drogapharma.com','0987323222','Male','web developer',3,'cvs/0txPPgVo6a5uGXSIviJsDrMd3GuJBVNz091QcBZx.pdf','aa',3.90,'aa','2026-03-04 05:52:41','2026-03-05 09:49:19','[{\"title\": \"hr manager\", \"company\": \"droga\", \"duration\": \"2023 - 2026\", \"description\": \"this is hard work to hr manager\"}]','[{\"gpa\": \"3.6\", \"year\": \"\", \"degree\": \"Bachler of since \", \"subject\": \"Management \", \"institution\": \"AAU\", \"graduation_date\": \"2024-06-05\"}]','[{\"id\": \"netwebup.com\", \"name\": \"Developer\", \"issuer\": \"Udacity\"}]','[{\"fluency\": \"Fluent\", \"language\": \"english\"}, {\"fluency\": \"Fluent\", \"language\": \"Amharic\"}, {\"fluency\": \"Fluent\", \"language\": \"French\"}]','[{\"name\": \"litsning\", \"level\": \"Intermediate\"}, {\"name\": \"cominication\", \"level\": \"Intermediate\"}]','[]');
/*!40000 ALTER TABLE `candidates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `website_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (1,'Droga Pharma','https://drogapharma.com','2026-02-28 10:05:04','2026-02-28 10:16:45'),(2,'Ema Construction','https://drogacoffee.com','2026-02-28 10:05:04','2026-03-03 10:10:32'),(3,'Droga Consulting','https://drogatranslog.com','2026-02-28 10:05:04','2026-03-03 00:19:23'),(4,'Droga Pharmacy','https://drogapharma.com','2026-02-28 10:15:24','2026-03-03 10:10:45'),(5,'Trust','https://drogacoffee.com','2026-02-28 10:15:24','2026-03-03 10:11:27'),(6,'Droga Physiotherapy','https://drogatranslog.com','2026-02-28 10:15:24','2026-03-03 10:12:15');
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_user`
--

DROP TABLE IF EXISTS `company_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_user` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `company_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `company_user_user_id_company_id_unique` (`user_id`,`company_id`),
  KEY `company_user_company_id_foreign` (`company_id`),
  CONSTRAINT `company_user_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `company_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_user`
--

LOCK TABLES `company_user` WRITE;
/*!40000 ALTER TABLE `company_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `company_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `departments_company_id_foreign` (`company_id`),
  CONSTRAINT `departments_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'IT & Software Development',1,'2026-02-28 10:05:04','2026-02-28 10:05:04'),(2,'Quality Control',1,'2026-02-28 10:05:04','2026-02-28 10:05:04'),(3,'Sales & Marketing',1,'2026-02-28 10:05:04','2026-02-28 10:05:04'),(4,'Human Resources',1,'2026-02-28 10:05:04','2026-02-28 10:05:04'),(5,'Supply Chain',2,'2026-02-28 10:05:04','2026-02-28 10:05:04'),(6,'Roastery Operations',2,'2026-02-28 10:05:04','2026-02-28 10:05:04'),(7,'Retail Sales',2,'2026-02-28 10:05:04','2026-02-28 10:05:04'),(8,'Quality Assurance',2,'2026-02-28 10:05:04','2026-02-28 10:05:04'),(9,'Fleet Management',3,'2026-02-28 10:05:04','2026-02-28 10:05:04'),(10,'Warehouse Operations',3,'2026-02-28 10:05:04','2026-02-28 10:05:04'),(11,'Distribution',3,'2026-02-28 10:05:04','2026-02-28 10:05:04'),(12,'IT & Software Development',4,'2026-02-28 10:15:24','2026-02-28 10:15:24'),(13,'Quality Control',4,'2026-02-28 10:15:24','2026-02-28 10:15:24'),(14,'Sales & Marketing',4,'2026-02-28 10:15:24','2026-02-28 10:15:24'),(15,'Human Resources',4,'2026-02-28 10:15:24','2026-02-28 10:15:24'),(16,'Supply Chain',5,'2026-02-28 10:15:24','2026-02-28 10:15:24'),(17,'Roastery Operations',5,'2026-02-28 10:15:24','2026-02-28 10:15:24'),(18,'Retail Sales',5,'2026-02-28 10:15:24','2026-02-28 10:15:24'),(19,'Quality Assurance',5,'2026-02-28 10:15:24','2026-02-28 10:15:24'),(20,'Fleet Management',6,'2026-02-28 10:15:24','2026-02-28 10:15:24'),(21,'Warehouse Operations',6,'2026-02-28 10:15:24','2026-02-28 10:15:24'),(22,'Distribution',6,'2026-02-28 10:15:24','2026-02-28 10:15:24');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interviews`
--

DROP TABLE IF EXISTS `interviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interviews` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `application_id` bigint unsigned NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scheduled_at` datetime NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_link` text COLLATE utf8mb4_unicode_ci,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'scheduled',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `interviews_application_id_foreign` (`application_id`),
  CONSTRAINT `interviews_application_id_foreign` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interviews`
--

LOCK TABLES `interviews` WRITE;
/*!40000 ALTER TABLE `interviews` DISABLE KEYS */;
INSERT INTO `interviews` VALUES (1,3,'interview_2','2026-03-11 14:33:00','https://maps.app.goo.gl/kdJ5ogjUcy1gZtP28',NULL,'ok i will see you in office','scheduled','2026-03-03 05:34:44','2026-03-03 05:34:44'),(2,5,'interview_1','2026-03-04 14:38:00','https://maps.app.goo.gl/kdJ5ogjUcy1gZtP28',NULL,'ok you arr pass to interview','scheduled','2026-03-03 07:39:25','2026-03-03 07:39:25'),(3,5,'interview_2','2026-03-03 14:40:00','https://maps.app.goo.gl/kdJ5ogjUcy1gZtP28',NULL,'no','scheduled','2026-03-03 07:40:15','2026-03-03 07:40:15'),(4,7,'interview_1','2026-03-03 05:03:00','https://maps.app.goo.gl/kdJ5ogjUcy1gZtP28',NULL,'come in office','scheduled','2026-03-03 09:02:04','2026-03-03 09:02:04'),(5,7,'interview_2','2026-03-19 15:37:00','https://maps.app.goo.gl/kdJ5ogjUcy1gZtP28',NULL,'good','scheduled','2026-03-03 09:35:27','2026-03-03 09:35:27'),(6,8,'interview_1','2026-03-04 09:59:00','droga pharma rufael',NULL,'ok','scheduled','2026-03-04 03:54:17','2026-03-04 03:54:17'),(7,8,'interview_2','2026-03-04 10:17:00','https://maps.app.goo.gl/kdJ5ogjUcy1gZtP28',NULL,'dgf','scheduled','2026-03-04 04:12:41','2026-03-04 04:12:41'),(8,9,'interview_1','2026-03-06 13:05:00','https://maps.app.goo.gl/kdJ5ogjUcy1gZtP28',NULL,'please see our office for interview','scheduled','2026-03-04 06:13:34','2026-03-04 06:13:34'),(9,9,'interview_2','2026-03-05 00:00:00','https://maps.app.goo.gl/kdJ5ogjUcy1gZtP28',NULL,'asdfasdf','scheduled','2026-03-04 06:15:03','2026-03-04 06:15:03'),(10,14,'interview_1','2026-03-08 00:00:00',NULL,NULL,'in writing test you have 90% mark','scheduled','2026-03-06 08:07:38','2026-03-06 08:07:38');
/*!40000 ALTER TABLE `interviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_postings`
--

DROP TABLE IF EXISTS `job_postings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_postings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `job_requisition_id` bigint unsigned DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `tags` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employment_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_internal` tinyint(1) NOT NULL DEFAULT '0',
  `is_external` tinyint(1) NOT NULL DEFAULT '0',
  `deadline` datetime DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'created',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `core_requirements` text COLLATE utf8mb4_unicode_ci,
  `education_level` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `experience_level` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `job_postings_job_requisition_id_foreign` (`job_requisition_id`),
  CONSTRAINT `job_postings_job_requisition_id_foreign` FOREIGN KEY (`job_requisition_id`) REFERENCES `job_requisitions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_postings`
--

LOCK TABLES `job_postings` WRITE;
/*!40000 ALTER TABLE `job_postings` DISABLE KEYS */;
INSERT INTO `job_postings` VALUES (1,2,'junior pharmasist','this is the best to correct','pharmacist, health, docter','Pharmaceutical & Healthcare','Addis Ababa','Freelance',1,1,'2026-03-18 00:00:00','posted','2026-03-02 23:48:46','2026-03-05 07:57:49','I think you are the excelence job|AND i will do it in your mindset|more medicen equpment knowladge|keep it up','Tvet, Certificate, Masters Degree','Junior'),(2,3,'IT manager','this is the it manager','Information Technology , software enginering , management, it',NULL,'Addis Ababa','Full-Time',0,1,'2026-03-19 00:00:00','posted','2026-03-03 00:22:05','2026-03-03 00:22:29','|||','Certificate, Diploma, Masters Degree','Intermediate'),(3,4,'IT officer','ይህ መልዕክት ማለት፦\n\n“Site Publisher ተወግዷል (deprecated ሆኗል)” ማለት ነው።\n\nበቀላሉ ማብራሪያ፦\n\nበ cPanel & WHM version 134 ውስጥ Site Publisher የሚባለው የድረ-ገጽ መፍጠሪያ ከአሁን በኋላ አይገኝም።\n\nነገር ግን ከዚህ በፊት በ Site Publisher የተፈጠሩ ድረ-ገጾች መስራታቸውን ይቀጥላሉ። (አይጠፉም)\n\nአዲስ ድረ-ገጽ ለመፍጠር ወይም ለመሻሻል ግን Sitejet የሚባለውን አዲስና ዘመናዊ የድረ-ገጽ መገንቢያ መጠቀም እንዲመከር ነው።\n\nእርስዎ በ cPanel ውስጥ Sitejet ካልተገኘልዎት የሆስቲንግ አቅራቢዎን (hosting provider) መጠየቅ ይኖርብዎታል።\n\nአጠቃላይ ማለት፦\nSite Publisher አሁን አይጠቀምም፤ በተፈጠሩት ድረ-ገጾች ግን ችግኝ የለም። አዲስ ስራ ለመስራት Sitejet መጠቀም አለብዎት።\n\nhow to connect react frontend and laravel backend give me the proccess\n\n\n\n### 5.1 Book Detail ([pages/book_detail.php](file:///c:/xampp/htdocs/LMS1/pages/book_detail.php))\nDeep dive into a specific book\'s metadata.\n\n| Element | Icon | Action/Logic | Description |\n| :--- | :--- | :--- | :--- |\n| Request Borrow | - | index.php?request_book_id=N| Main action to start a loan. |\n| Back Link | ri-arrow-left-line| javascript:history.back()| Navigates to previous view. |\n\n### 5.2 User Profile ([pages/profile.php](file:///c:/xampp/htdocs/LMS1/pages/profile.php))\nPersonal account settings and security.\n\n| Element | Icon | Action/Logic | Description |\n| :--- | :--- | :--- | :--- |\n| Update Profile | - | Form Submit | Saves name, email, and location. |\n| Change Password | - | Form Submit | Updates security credentials. |\n| Profile Image | - | File Upload | Updates user avatar. |\n\nconvert to word file\n\nYour Word file is ready:\n\n? Download the LMS1 System Documentation\n\nIf you want a more professional formatted version (with tables exactly like your original structure, icons column, page paths, styling, header/footer, logo, etc.), tell me and I will generate a fully designed documentation version.','Information Technology',NULL,'Addis Ababa','Full-Time',1,1,'2026-03-10 00:00:00','posted','2026-03-03 06:47:24','2026-03-03 07:56:57','|||','Tvet, Certificate, Diploma, Masters Degree','Junior'),(4,1,'Backend Developer for Laravel','A high-impact role building our scalable healthcare ecosystem. \n\nHello heaven,\nThere has been a synchronization update in your application for the IT officer position.\n\nYour current status is now: WRITTEN TEST\n\nFeedback from our Talent Acquisition Team:\n\n\"please come to in office\"\n\nView My Application\nYou can monitor the full chronological history of your application nodes in your profile.\n\nBest regards, The Droga Group Talent Acquisition Team\n\nIf you\'re having trouble clicking the \"View My Application\" button, copy and paste the URL below into your web browser: http://localhost:5173/profile','backend , developer,',NULL,'Adama','Full-Time',0,1,'2026-03-05 00:00:00','closed','2026-03-04 06:07:26','2026-03-06 08:16:22','|||','Masters Degree','Senior');
/*!40000 ALTER TABLE `job_postings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_requisitions`
--

DROP TABLE IF EXISTS `job_requisitions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_requisitions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employment_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `budget_status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending_hr',
  `reject_comment` text COLLATE utf8mb4_unicode_ci,
  `user_id` bigint unsigned NOT NULL,
  `jd_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `company_id` bigint unsigned DEFAULT NULL,
  `department_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `job_requisitions_user_id_foreign` (`user_id`),
  KEY `job_requisitions_company_id_foreign` (`company_id`),
  KEY `job_requisitions_department_id_foreign` (`department_id`),
  CONSTRAINT `job_requisitions_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL,
  CONSTRAINT `job_requisitions_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `job_requisitions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_requisitions`
--

LOCK TABLES `job_requisitions` WRITE;
/*!40000 ALTER TABLE `job_requisitions` DISABLE KEYS */;
INSERT INTO `job_requisitions` VALUES (1,'Backend Developer for Laravel','A high-impact role building our scalable healthcare ecosystem.','Information Technology','Addis Ababa','Full-time','approved','approved',NULL,1,NULL,'2026-02-28 10:16:59','2026-02-28 10:16:59',3,NULL),(2,'junior pharmasist','this is the best to correct','Information Technology','Addis Ababa','Full-time','approved','approved',NULL,1,'jds/tarzqOyRS99hDqmDzqt8P4i6JjFQxQGDkouhLLry.docx','2026-03-02 23:33:54','2026-03-02 23:34:28',1,2),(3,'IT manager','this is the it manager','Information Technology','Addis Ababa','Full-time','approved','approved',NULL,1,'jds/8e3D2F3wKhIdBbSmZNZy7rwk2yJCJQXt1botgrhl.pdf','2026-03-03 00:20:29','2026-03-03 00:20:48',3,9),(4,'IT officer','this is the best postion','Information Technology','Addis Ababa','Full-time','approved','approved',NULL,6,'jds/mhcVBvxOA39dHOfsdHg5T2oZoyutvEp98fKgkbGq.docx','2026-03-03 06:15:29','2026-03-03 06:17:21',3,10),(5,'Nurce','this is the best position for our them','Pharmaceutical & Healthcare','Addis Ababa','Full-time','rejected','rejected','their is no budget please ask in jun 12',6,'jds/ziJbILQEgSOzTC9gry5UaX8cwRw52QDj84JhLisb.pdf','2026-03-06 07:11:38','2026-03-06 07:13:58',3,10);
/*!40000 ALTER TABLE `job_requisitions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1,'default','{\"uuid\":\"cc5e93ac-b964-499a-bef6-aed1612dd960\",\"displayName\":\"App\\\\Notifications\\\\GenericNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:11;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:37:\\\"App\\\\Notifications\\\\GenericNotification\\\":3:{s:8:\\\"\\u0000*\\u0000title\\\";s:31:\\\"TA Team responded to your offer\\\";s:10:\\\"\\u0000*\\u0000message\\\";s:73:\\\"The TA team replied regarding your offer for IT manager: \\\"stay interview\\\"\\\";s:2:\\\"id\\\";s:36:\\\"0c7c38b1-498f-4e92-b7b5-887c161851f6\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\",\"batchId\":null},\"createdAt\":1772604516,\"delay\":null}',0,NULL,1772604517,1772604517),(2,'default','{\"uuid\":\"e29cbb7f-fcd5-4db9-abf4-8407ed30b4fd\",\"displayName\":\"App\\\\Notifications\\\\GenericNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:12;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:37:\\\"App\\\\Notifications\\\\GenericNotification\\\":3:{s:8:\\\"\\u0000*\\u0000title\\\";s:31:\\\"TA Team responded to your offer\\\";s:10:\\\"\\u0000*\\u0000message\\\";s:81:\\\"The TA team replied regarding your offer for IT manager: \\\"hi bro how was you day\\\"\\\";s:2:\\\"id\\\";s:36:\\\"fe6b5e90-28bf-4935-a383-ee6329f3a003\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\",\"batchId\":null},\"createdAt\":1772608490,\"delay\":null}',0,NULL,1772608490,1772608490),(3,'default','{\"uuid\":\"301afc54-c84c-4add-85b9-20c2d8cb9f2e\",\"displayName\":\"App\\\\Notifications\\\\OfferComment\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:1;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:30:\\\"App\\\\Notifications\\\\OfferComment\\\":5:{s:10:\\\"\\u0000*\\u0000comment\\\";s:17:\\\"ok i will see you\\\";s:16:\\\"\\u0000*\\u0000candidateName\\\";s:5:\\\"dagim\\\";s:11:\\\"\\u0000*\\u0000jobTitle\\\";s:10:\\\"IT manager\\\";s:16:\\\"\\u0000*\\u0000applicationId\\\";i:8;s:2:\\\"id\\\";s:36:\\\"3788ecd8-a440-422d-87ca-94cc22f322ba\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:4:\\\"mail\\\";}}\",\"batchId\":null},\"createdAt\":1772613715,\"delay\":null}',0,NULL,1772613715,1772613715),(4,'default','{\"uuid\":\"21d8f46f-ea8d-460f-abaf-4a5f2a6ffbc5\",\"displayName\":\"App\\\\Notifications\\\\OfferComment\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:1;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:30:\\\"App\\\\Notifications\\\\OfferComment\\\":5:{s:10:\\\"\\u0000*\\u0000comment\\\";s:17:\\\"ok i will see you\\\";s:16:\\\"\\u0000*\\u0000candidateName\\\";s:5:\\\"dagim\\\";s:11:\\\"\\u0000*\\u0000jobTitle\\\";s:10:\\\"IT manager\\\";s:16:\\\"\\u0000*\\u0000applicationId\\\";i:8;s:2:\\\"id\\\";s:36:\\\"3788ecd8-a440-422d-87ca-94cc22f322ba\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\",\"batchId\":null},\"createdAt\":1772613715,\"delay\":null}',0,NULL,1772613715,1772613715),(5,'default','{\"uuid\":\"84484b5a-3d83-49d1-a399-6f34d6bb0b5c\",\"displayName\":\"App\\\\Notifications\\\\OfferComment\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:2;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:30:\\\"App\\\\Notifications\\\\OfferComment\\\":5:{s:10:\\\"\\u0000*\\u0000comment\\\";s:17:\\\"ok i will see you\\\";s:16:\\\"\\u0000*\\u0000candidateName\\\";s:5:\\\"dagim\\\";s:11:\\\"\\u0000*\\u0000jobTitle\\\";s:10:\\\"IT manager\\\";s:16:\\\"\\u0000*\\u0000applicationId\\\";i:8;s:2:\\\"id\\\";s:36:\\\"ec3d3c17-6831-4619-82a2-53b00bc0b13e\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:4:\\\"mail\\\";}}\",\"batchId\":null},\"createdAt\":1772613716,\"delay\":null}',0,NULL,1772613716,1772613716),(6,'default','{\"uuid\":\"b288fc29-a90c-4e0b-9be3-2e9ae0cb7fef\",\"displayName\":\"App\\\\Notifications\\\\OfferComment\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:2;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:30:\\\"App\\\\Notifications\\\\OfferComment\\\":5:{s:10:\\\"\\u0000*\\u0000comment\\\";s:17:\\\"ok i will see you\\\";s:16:\\\"\\u0000*\\u0000candidateName\\\";s:5:\\\"dagim\\\";s:11:\\\"\\u0000*\\u0000jobTitle\\\";s:10:\\\"IT manager\\\";s:16:\\\"\\u0000*\\u0000applicationId\\\";i:8;s:2:\\\"id\\\";s:36:\\\"ec3d3c17-6831-4619-82a2-53b00bc0b13e\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\",\"batchId\":null},\"createdAt\":1772613716,\"delay\":null}',0,NULL,1772613716,1772613716),(7,'default','{\"uuid\":\"e79ea9ed-6628-4db9-b737-b34225e0fd21\",\"displayName\":\"App\\\\Notifications\\\\OfferComment\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:3;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:30:\\\"App\\\\Notifications\\\\OfferComment\\\":5:{s:10:\\\"\\u0000*\\u0000comment\\\";s:17:\\\"ok i will see you\\\";s:16:\\\"\\u0000*\\u0000candidateName\\\";s:5:\\\"dagim\\\";s:11:\\\"\\u0000*\\u0000jobTitle\\\";s:10:\\\"IT manager\\\";s:16:\\\"\\u0000*\\u0000applicationId\\\";i:8;s:2:\\\"id\\\";s:36:\\\"5b91f76c-ff66-41bc-b95a-509f8065d238\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:4:\\\"mail\\\";}}\",\"batchId\":null},\"createdAt\":1772613716,\"delay\":null}',0,NULL,1772613716,1772613716),(8,'default','{\"uuid\":\"340c3263-751b-4880-a7b5-62780b4674bc\",\"displayName\":\"App\\\\Notifications\\\\OfferComment\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:3;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:30:\\\"App\\\\Notifications\\\\OfferComment\\\":5:{s:10:\\\"\\u0000*\\u0000comment\\\";s:17:\\\"ok i will see you\\\";s:16:\\\"\\u0000*\\u0000candidateName\\\";s:5:\\\"dagim\\\";s:11:\\\"\\u0000*\\u0000jobTitle\\\";s:10:\\\"IT manager\\\";s:16:\\\"\\u0000*\\u0000applicationId\\\";i:8;s:2:\\\"id\\\";s:36:\\\"5b91f76c-ff66-41bc-b95a-509f8065d238\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\",\"batchId\":null},\"createdAt\":1772613716,\"delay\":null}',0,NULL,1772613716,1772613716),(9,'default','{\"uuid\":\"21a1351e-9e8b-484c-81e1-574e4fa66950\",\"displayName\":\"App\\\\Notifications\\\\OfferComment\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:4;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:30:\\\"App\\\\Notifications\\\\OfferComment\\\":5:{s:10:\\\"\\u0000*\\u0000comment\\\";s:17:\\\"ok i will see you\\\";s:16:\\\"\\u0000*\\u0000candidateName\\\";s:5:\\\"dagim\\\";s:11:\\\"\\u0000*\\u0000jobTitle\\\";s:10:\\\"IT manager\\\";s:16:\\\"\\u0000*\\u0000applicationId\\\";i:8;s:2:\\\"id\\\";s:36:\\\"dc61e607-8013-4081-b2ba-273eb2ac5b98\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:4:\\\"mail\\\";}}\",\"batchId\":null},\"createdAt\":1772613716,\"delay\":null}',0,NULL,1772613716,1772613716),(10,'default','{\"uuid\":\"63ce0290-ceed-42b3-a92f-110b25f6e48f\",\"displayName\":\"App\\\\Notifications\\\\OfferComment\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:4;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:30:\\\"App\\\\Notifications\\\\OfferComment\\\":5:{s:10:\\\"\\u0000*\\u0000comment\\\";s:17:\\\"ok i will see you\\\";s:16:\\\"\\u0000*\\u0000candidateName\\\";s:5:\\\"dagim\\\";s:11:\\\"\\u0000*\\u0000jobTitle\\\";s:10:\\\"IT manager\\\";s:16:\\\"\\u0000*\\u0000applicationId\\\";i:8;s:2:\\\"id\\\";s:36:\\\"dc61e607-8013-4081-b2ba-273eb2ac5b98\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\",\"batchId\":null},\"createdAt\":1772613716,\"delay\":null}',0,NULL,1772613716,1772613716),(11,'default','{\"uuid\":\"7709ad38-ad6b-4bd3-aaf1-95fb264715a8\",\"displayName\":\"App\\\\Notifications\\\\OfferComment\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:5;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:30:\\\"App\\\\Notifications\\\\OfferComment\\\":5:{s:10:\\\"\\u0000*\\u0000comment\\\";s:17:\\\"ok i will see you\\\";s:16:\\\"\\u0000*\\u0000candidateName\\\";s:5:\\\"dagim\\\";s:11:\\\"\\u0000*\\u0000jobTitle\\\";s:10:\\\"IT manager\\\";s:16:\\\"\\u0000*\\u0000applicationId\\\";i:8;s:2:\\\"id\\\";s:36:\\\"32537c79-14e3-4421-baa5-06907e50a63e\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:4:\\\"mail\\\";}}\",\"batchId\":null},\"createdAt\":1772613716,\"delay\":null}',0,NULL,1772613716,1772613716),(12,'default','{\"uuid\":\"6656a6ed-8427-4953-afd5-cbb1613ed757\",\"displayName\":\"App\\\\Notifications\\\\OfferComment\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:5;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:30:\\\"App\\\\Notifications\\\\OfferComment\\\":5:{s:10:\\\"\\u0000*\\u0000comment\\\";s:17:\\\"ok i will see you\\\";s:16:\\\"\\u0000*\\u0000candidateName\\\";s:5:\\\"dagim\\\";s:11:\\\"\\u0000*\\u0000jobTitle\\\";s:10:\\\"IT manager\\\";s:16:\\\"\\u0000*\\u0000applicationId\\\";i:8;s:2:\\\"id\\\";s:36:\\\"32537c79-14e3-4421-baa5-06907e50a63e\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\",\"batchId\":null},\"createdAt\":1772613716,\"delay\":null}',0,NULL,1772613716,1772613716),(13,'default','{\"uuid\":\"5523d5df-2885-4cc7-bc6c-72c517f49145\",\"displayName\":\"App\\\\Notifications\\\\GenericNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:13;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:37:\\\"App\\\\Notifications\\\\GenericNotification\\\":3:{s:8:\\\"\\u0000*\\u0000title\\\";s:31:\\\"TA Team responded to your offer\\\";s:10:\\\"\\u0000*\\u0000message\\\";s:88:\\\"The TA team replied regarding your offer for IT officer: \\\"what do you think about offer\\\"\\\";s:2:\\\"id\\\";s:36:\\\"2094f845-f0c0-4510-b93c-7a756afe6b01\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\",\"batchId\":null},\"createdAt\":1772615788,\"delay\":null}',0,NULL,1772615788,1772615788),(14,'default','{\"uuid\":\"1b2ed106-0604-495a-9c97-569976315089\",\"displayName\":\"App\\\\Notifications\\\\OfferComment\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:1;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:30:\\\"App\\\\Notifications\\\\OfferComment\\\":5:{s:10:\\\"\\u0000*\\u0000comment\\\";s:47:\\\"i accept the offer i will get in office march 7\\\";s:16:\\\"\\u0000*\\u0000candidateName\\\";s:6:\\\"heaven\\\";s:11:\\\"\\u0000*\\u0000jobTitle\\\";s:10:\\\"IT officer\\\";s:16:\\\"\\u0000*\\u0000applicationId\\\";i:9;s:2:\\\"id\\\";s:36:\\\"d232925a-2b5b-40fc-9c55-74f8a9d125d2\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:4:\\\"mail\\\";}}\",\"batchId\":null},\"createdAt\":1772615830,\"delay\":null}',0,NULL,1772615830,1772615830),(15,'default','{\"uuid\":\"3a4b800e-2ae1-4a21-a653-cac615f590ae\",\"displayName\":\"App\\\\Notifications\\\\OfferComment\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:1;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:30:\\\"App\\\\Notifications\\\\OfferComment\\\":5:{s:10:\\\"\\u0000*\\u0000comment\\\";s:47:\\\"i accept the offer i will get in office march 7\\\";s:16:\\\"\\u0000*\\u0000candidateName\\\";s:6:\\\"heaven\\\";s:11:\\\"\\u0000*\\u0000jobTitle\\\";s:10:\\\"IT officer\\\";s:16:\\\"\\u0000*\\u0000applicationId\\\";i:9;s:2:\\\"id\\\";s:36:\\\"d232925a-2b5b-40fc-9c55-74f8a9d125d2\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\",\"batchId\":null},\"createdAt\":1772615830,\"delay\":null}',0,NULL,1772615830,1772615830),(16,'default','{\"uuid\":\"424a90de-7274-406a-b221-5573b6f699e3\",\"displayName\":\"App\\\\Notifications\\\\OfferComment\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:2;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:30:\\\"App\\\\Notifications\\\\OfferComment\\\":5:{s:10:\\\"\\u0000*\\u0000comment\\\";s:47:\\\"i accept the offer i will get in office march 7\\\";s:16:\\\"\\u0000*\\u0000candidateName\\\";s:6:\\\"heaven\\\";s:11:\\\"\\u0000*\\u0000jobTitle\\\";s:10:\\\"IT officer\\\";s:16:\\\"\\u0000*\\u0000applicationId\\\";i:9;s:2:\\\"id\\\";s:36:\\\"f5d8861d-3b45-4e71-ae94-1f82b0cb699e\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:4:\\\"mail\\\";}}\",\"batchId\":null},\"createdAt\":1772615830,\"delay\":null}',0,NULL,1772615830,1772615830),(17,'default','{\"uuid\":\"bb5109d9-0f7e-4dd2-9bf3-49e6a20ad0d8\",\"displayName\":\"App\\\\Notifications\\\\OfferComment\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:2;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:30:\\\"App\\\\Notifications\\\\OfferComment\\\":5:{s:10:\\\"\\u0000*\\u0000comment\\\";s:47:\\\"i accept the offer i will get in office march 7\\\";s:16:\\\"\\u0000*\\u0000candidateName\\\";s:6:\\\"heaven\\\";s:11:\\\"\\u0000*\\u0000jobTitle\\\";s:10:\\\"IT officer\\\";s:16:\\\"\\u0000*\\u0000applicationId\\\";i:9;s:2:\\\"id\\\";s:36:\\\"f5d8861d-3b45-4e71-ae94-1f82b0cb699e\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\",\"batchId\":null},\"createdAt\":1772615830,\"delay\":null}',0,NULL,1772615830,1772615830),(18,'default','{\"uuid\":\"1361b68e-3d09-4b1f-ba1f-976a4b698fdd\",\"displayName\":\"App\\\\Notifications\\\\OfferComment\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:3;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:30:\\\"App\\\\Notifications\\\\OfferComment\\\":5:{s:10:\\\"\\u0000*\\u0000comment\\\";s:47:\\\"i accept the offer i will get in office march 7\\\";s:16:\\\"\\u0000*\\u0000candidateName\\\";s:6:\\\"heaven\\\";s:11:\\\"\\u0000*\\u0000jobTitle\\\";s:10:\\\"IT officer\\\";s:16:\\\"\\u0000*\\u0000applicationId\\\";i:9;s:2:\\\"id\\\";s:36:\\\"060c9d13-d458-4c4f-bbe2-c02d4a4a7b52\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:4:\\\"mail\\\";}}\",\"batchId\":null},\"createdAt\":1772615830,\"delay\":null}',0,NULL,1772615830,1772615830),(19,'default','{\"uuid\":\"62cf274f-eae2-4620-9947-f1912d63811c\",\"displayName\":\"App\\\\Notifications\\\\OfferComment\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:3;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:30:\\\"App\\\\Notifications\\\\OfferComment\\\":5:{s:10:\\\"\\u0000*\\u0000comment\\\";s:47:\\\"i accept the offer i will get in office march 7\\\";s:16:\\\"\\u0000*\\u0000candidateName\\\";s:6:\\\"heaven\\\";s:11:\\\"\\u0000*\\u0000jobTitle\\\";s:10:\\\"IT officer\\\";s:16:\\\"\\u0000*\\u0000applicationId\\\";i:9;s:2:\\\"id\\\";s:36:\\\"060c9d13-d458-4c4f-bbe2-c02d4a4a7b52\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\",\"batchId\":null},\"createdAt\":1772615830,\"delay\":null}',0,NULL,1772615830,1772615830),(20,'default','{\"uuid\":\"519830e7-2477-4ef2-81f8-4aedb172fdab\",\"displayName\":\"App\\\\Notifications\\\\OfferComment\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:4;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:30:\\\"App\\\\Notifications\\\\OfferComment\\\":5:{s:10:\\\"\\u0000*\\u0000comment\\\";s:47:\\\"i accept the offer i will get in office march 7\\\";s:16:\\\"\\u0000*\\u0000candidateName\\\";s:6:\\\"heaven\\\";s:11:\\\"\\u0000*\\u0000jobTitle\\\";s:10:\\\"IT officer\\\";s:16:\\\"\\u0000*\\u0000applicationId\\\";i:9;s:2:\\\"id\\\";s:36:\\\"8565d8e8-5e9c-4f4b-8cd2-4ca29acf7db2\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:4:\\\"mail\\\";}}\",\"batchId\":null},\"createdAt\":1772615830,\"delay\":null}',0,NULL,1772615830,1772615830),(21,'default','{\"uuid\":\"4d0d44a5-0f74-4103-ab70-c39350eb3b93\",\"displayName\":\"App\\\\Notifications\\\\OfferComment\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:4;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:30:\\\"App\\\\Notifications\\\\OfferComment\\\":5:{s:10:\\\"\\u0000*\\u0000comment\\\";s:47:\\\"i accept the offer i will get in office march 7\\\";s:16:\\\"\\u0000*\\u0000candidateName\\\";s:6:\\\"heaven\\\";s:11:\\\"\\u0000*\\u0000jobTitle\\\";s:10:\\\"IT officer\\\";s:16:\\\"\\u0000*\\u0000applicationId\\\";i:9;s:2:\\\"id\\\";s:36:\\\"8565d8e8-5e9c-4f4b-8cd2-4ca29acf7db2\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\",\"batchId\":null},\"createdAt\":1772615830,\"delay\":null}',0,NULL,1772615830,1772615830),(22,'default','{\"uuid\":\"a0ccf495-d171-40b5-9ed0-77f7a9d4c286\",\"displayName\":\"App\\\\Notifications\\\\OfferComment\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:5;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:30:\\\"App\\\\Notifications\\\\OfferComment\\\":5:{s:10:\\\"\\u0000*\\u0000comment\\\";s:47:\\\"i accept the offer i will get in office march 7\\\";s:16:\\\"\\u0000*\\u0000candidateName\\\";s:6:\\\"heaven\\\";s:11:\\\"\\u0000*\\u0000jobTitle\\\";s:10:\\\"IT officer\\\";s:16:\\\"\\u0000*\\u0000applicationId\\\";i:9;s:2:\\\"id\\\";s:36:\\\"83de525e-22b3-40fc-9743-ddbca5b2150d\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:4:\\\"mail\\\";}}\",\"batchId\":null},\"createdAt\":1772615830,\"delay\":null}',0,NULL,1772615830,1772615830),(23,'default','{\"uuid\":\"ca79ace9-e5a3-4b5d-95a8-32ee4f540411\",\"displayName\":\"App\\\\Notifications\\\\OfferComment\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:5;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:30:\\\"App\\\\Notifications\\\\OfferComment\\\":5:{s:10:\\\"\\u0000*\\u0000comment\\\";s:47:\\\"i accept the offer i will get in office march 7\\\";s:16:\\\"\\u0000*\\u0000candidateName\\\";s:6:\\\"heaven\\\";s:11:\\\"\\u0000*\\u0000jobTitle\\\";s:10:\\\"IT officer\\\";s:16:\\\"\\u0000*\\u0000applicationId\\\";i:9;s:2:\\\"id\\\";s:36:\\\"83de525e-22b3-40fc-9743-ddbca5b2150d\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\",\"batchId\":null},\"createdAt\":1772615830,\"delay\":null}',0,NULL,1772615830,1772615830);
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0000_01_01_000000_create_roles_table',1),(2,'0001_01_01_000000_create_users_table',1),(3,'0001_01_01_000001_create_cache_table',1),(4,'0001_01_01_000002_create_jobs_table',1),(5,'2026_02_24_093803_create_personal_access_tokens_table',1),(6,'2026_02_24_093936_create_job_requisitions_table',1),(7,'2026_02_24_093937_create_candidates_table',1),(8,'2026_02_24_093937_create_job_postings_table',1),(9,'2026_02_24_093938_create_applications_table',1),(10,'2026_02_24_093939_create_interviews_table',1),(11,'2026_02_24_093939_create_offers_table',1),(12,'2026_02_24_093940_create_onboarding_plans_table',1),(13,'2026_02_24_093941_create_talent_pool_table',1),(14,'2026_02_24_110258_add_category_location_to_job_requisitions',1),(15,'2026_02_24_141349_add_age_to_candidates_table',1),(16,'2026_02_25_080033_create_application_status_histories_table',1),(17,'2026_02_25_095131_add_oauth_otp_to_users_table',1),(18,'2026_02_25_095756_add_oauth_and_otp_to_users_table',1),(19,'2026_02_26_083746_add_user_id_to_application_status_histories_table',1),(20,'2026_02_26_095022_create_notifications_table',1),(21,'2026_02_26_134201_update_job_requisitions_workflow',1),(22,'2026_02_27_055023_create_companies_table',1),(23,'2026_02_27_055030_create_departments_table',1),(24,'2026_02_27_055041_add_company_and_department_id_to_job_requisitions_table',1),(25,'2026_02_27_130000_update_job_postings_table',1),(26,'2026_02_27_163000_add_org_fields_to_users_table',1),(27,'2026_02_28_064259_make_job_requisition_id_nullable_in_job_postings_table',1),(28,'2026_02_28_065558_recreate_job_postings_table_fresh',1),(29,'2026_02_28_101341_add_document_path_to_application_status_histories_table',1),(30,'2026_02_28_123416_add_core_requirements_to_job_postings_table',2),(31,'2026_02_28_130145_add_website_url_to_companies_table',2),(32,'2026_02_28_153000_add_education_and_experience_to_job_postings',2),(33,'2026_03_03_094045_add_category_to_job_postings_table',3),(34,'2026_03_03_095902_add_description_to_applications_table',4),(35,'2026_03_03_113451_create_application_messages_table',5),(36,'2026_03_03_134406_add_is_read_to_application_messages_table',6),(37,'2026_03_04_000000_create_company_user_table',7),(38,'2026_03_04_070822_add_detailed_profile_fields_to_candidates_table',8),(39,'2026_03_04_074730_add_experience_certificates_to_candidates_table',9),(40,'2026_03_06_100711_add_reject_comment_to_job_requisitions_table',10),(41,'2026_03_06_140000_add_address_link_to_interviews_table',11);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_id` bigint unsigned NOT NULL,
  `data` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES ('01ee2239-720c-43ce-bff8-5165c3b61f26','App\\Notifications\\OfferComment','App\\Models\\User',5,'{\"title\":\"Offer Response: etago\",\"message\":\"etago responded to their offer for IT manager: \\\"ok but i will in the office not come\\\"\",\"application_id\":7}',NULL,'2026-03-03 09:37:40','2026-03-03 09:37:40'),('02ec5bea-cdd0-45d7-9f57-a49a75072344','App\\Notifications\\InterviewScheduled','App\\Models\\Candidate',4,'{\"interview_id\":3,\"application_id\":5,\"job_title\":\"IT officer\",\"scheduled_at\":\"2026-03-03 14:40\",\"location\":\"https:\\/\\/maps.app.goo.gl\\/kdJ5ogjUcy1gZtP28\",\"message\":\"Your interview for IT officer is scheduled for Mar 03, 2026\"}',NULL,'2026-03-03 07:40:18','2026-03-03 07:40:18'),('03991a0f-5b0a-4ae6-8b51-e04dcd221343','App\\Notifications\\ApplicationStatusUpdated','App\\Models\\Candidate',7,'{\"application_id\":9,\"title\":\"Application Status Updated\",\"message\":\"The status of your application for IT officer has been updated to hired\",\"status\":\"hired\",\"feedback\":\"ok congratulation you are hired in Droga\"}',NULL,'2026-03-05 09:37:04','2026-03-05 09:37:04'),('03d8492f-ae93-4516-9e89-41195a64fc4d','App\\Notifications\\InterviewScheduled','App\\Models\\Candidate',5,'{\"interview_id\":4,\"application_id\":7,\"job_title\":\"IT manager\",\"scheduled_at\":\"2026-03-03 05:03\",\"location\":\"https:\\/\\/maps.app.goo.gl\\/kdJ5ogjUcy1gZtP28\",\"message\":\"Your interview for IT manager is scheduled for Mar 03, 2026\"}',NULL,'2026-03-03 09:02:07','2026-03-03 09:02:07'),('08842734-2e7b-45af-9c2e-7c158b656599','App\\Notifications\\OfferComment','App\\Models\\User',3,'{\"title\":\"Offer Response: etago\",\"message\":\"etago responded to their offer for IT manager: \\\"ok i will see you\\\"\",\"application_id\":7,\"candidate_name\":\"etago\",\"type\":\"offer_message\"}','2026-03-04 08:47:15','2026-03-03 11:02:35','2026-03-04 08:47:15'),('0996fdd8-369e-4b1d-86af-11b4f5236634','App\\Notifications\\RequisitionHRApproved','App\\Models\\User',1,'{\"requisition_id\":3,\"title\":\"IT manager\",\"status\":\"pending_ceo\",\"message\":\"HR has authorized your requisition. Awaiting CEO sign-off.\"}','2026-03-04 03:51:56','2026-03-03 00:20:41','2026-03-04 03:51:56'),('0c4ae2b4-59f8-4311-8d84-82d7bcb4c63e','App\\Notifications\\RequisitionHRApproved','App\\Models\\User',1,'{\"requisition_id\":2,\"title\":\"junior pharmasist\",\"status\":\"pending_ceo\",\"message\":\"HR has authorized your requisition. Awaiting CEO sign-off.\"}','2026-03-04 03:51:56','2026-03-02 23:34:12','2026-03-04 03:51:56'),('0eec5d12-f206-4739-8b8e-87e1fac2f121','App\\Notifications\\OfferComment','App\\Models\\User',1,'{\"title\":\"Offer Response: etago\",\"message\":\"etago responded to their offer for IT manager: \\\"ok\\\"\",\"application_id\":7,\"candidate_name\":\"etago\",\"type\":\"offer_message\"}','2026-03-04 03:51:56','2026-03-03 11:02:11','2026-03-04 03:51:56'),('1511a3d3-c458-4621-ad9a-5437785e2483','App\\Notifications\\InterviewScheduled','App\\Models\\User',1,'{\"interview_id\":5,\"application_id\":7,\"job_title\":\"IT manager\",\"scheduled_at\":\"2026-03-19 15:37\",\"location\":\"https:\\/\\/maps.app.goo.gl\\/kdJ5ogjUcy1gZtP28\",\"message\":\"Interview scheduled for etago on Mar 19, 2026\"}','2026-03-04 03:51:56','2026-03-03 09:35:30','2026-03-04 03:51:56'),('17349484-ecbb-4032-a994-502c392e84b8','App\\Notifications\\RequisitionApproved','App\\Models\\User',6,'{\"requisition_id\":4,\"title\":\"IT officer\",\"status\":\"approved\",\"message\":\"Hiring requisition approved by executive layer.\"}',NULL,'2026-03-03 06:17:23','2026-03-03 06:17:23'),('1d7372f1-0ee0-429d-9fa3-3ee683800f58','App\\Notifications\\RequisitionReadyForPosting','App\\Models\\User',3,'{\"requisition_id\":4,\"title\":\"IT officer\",\"status\":\"approved\",\"message\":\"New requisition approved and ready for posting.\"}','2026-03-03 06:20:57','2026-03-03 06:17:24','2026-03-03 06:20:57'),('1e4ba1c3-7366-41c6-b157-7fafa631e49d','App\\Notifications\\OfferComment','App\\Models\\User',4,'{\"title\":\"Offer Response: etago\",\"message\":\"etago responded to their offer for IT manager: \\\"ok please answer me\\\"\",\"application_id\":7,\"candidate_name\":\"etago\",\"type\":\"offer_message\"}',NULL,'2026-03-03 09:50:17','2026-03-03 09:50:17'),('209ffd0a-b4d5-4795-8d08-1efb95b86762','App\\Notifications\\RequisitionCreated','App\\Models\\User',3,'{\"requisition_id\":4,\"title\":\"IT officer\",\"status\":\"pending_hr\",\"message\":\"New requisition submitted and awaiting approval.\"}','2026-03-03 06:20:57','2026-03-03 06:15:31','2026-03-03 06:20:57'),('228530e2-25dc-4ed6-a177-05d7595e0ca9','App\\Notifications\\ApplicationStatusUpdated','App\\Models\\Candidate',7,'{\"application_id\":9,\"title\":\"Application Status Updated\",\"message\":\"The status of your application for IT officer has been updated to written test\",\"status\":\"written_test\",\"feedback\":\"please come to in office\"}',NULL,'2026-03-04 05:57:10','2026-03-04 05:57:10'),('31ff82b7-0c67-4f20-a98f-8633afcdcd93','App\\Notifications\\OfferComment','App\\Models\\User',3,'{\"title\":\"Offer Response: etago\",\"message\":\"etago responded to their offer for IT manager: \\\"ok but i will in the office not come\\\"\",\"application_id\":7}','2026-03-03 09:38:10','2026-03-03 09:37:39','2026-03-03 09:38:10'),('3287f4c8-f7fd-4439-a5f9-a57b6059740a','App\\Notifications\\OfferComment','App\\Models\\User',2,'{\"title\":\"Offer Response: etago\",\"message\":\"etago responded to their offer for IT manager: \\\"ok i will see you\\\"\",\"application_id\":7,\"candidate_name\":\"etago\",\"type\":\"offer_message\"}',NULL,'2026-03-03 11:02:35','2026-03-03 11:02:35'),('35306a9c-5e99-46a0-9838-7f5c0c3ecf17','App\\Notifications\\OfferComment','App\\Models\\User',3,'{\"title\":\"Offer Response: etago\",\"message\":\"etago responded to their offer for IT manager: \\\"ok please answer me\\\"\",\"application_id\":7,\"candidate_name\":\"etago\",\"type\":\"offer_message\"}','2026-03-03 09:50:33','2026-03-03 09:50:16','2026-03-03 09:50:33'),('3989d10b-984b-497a-8c1d-9b73865ee509','App\\Notifications\\ApplicationSubmitted','App\\Models\\Candidate',6,'{\"application_id\":8,\"title\":\"Application Received\",\"message\":\"We have received your application for IT manager\",\"status\":\"submitted\"}',NULL,'2026-03-04 03:51:24','2026-03-04 03:51:24'),('3eae0324-6c78-414b-a79f-050dd9179381','App\\Notifications\\InterviewScheduled','App\\Models\\User',6,'{\"interview_id\":3,\"application_id\":5,\"job_title\":\"IT officer\",\"scheduled_at\":\"2026-03-03 14:40\",\"location\":\"https:\\/\\/maps.app.goo.gl\\/kdJ5ogjUcy1gZtP28\",\"message\":\"Interview scheduled for \\u12f3\\u130d\\u121d \\u1218\\u1295\\u130d\\u1235\\u1271 on Mar 03, 2026\"}',NULL,'2026-03-03 07:40:18','2026-03-03 07:40:18'),('472127f0-8ba9-400a-8f8f-97a4efc11978','App\\Notifications\\InterviewScheduled','App\\Models\\User',1,'{\"interview_id\":7,\"application_id\":8,\"job_title\":\"IT manager\",\"scheduled_at\":\"2026-03-04 10:17\",\"location\":\"https:\\/\\/maps.app.goo.gl\\/kdJ5ogjUcy1gZtP28\",\"message\":\"Interview scheduled for dagim on Mar 04, 2026\"}','2026-03-04 04:20:39','2026-03-04 04:12:45','2026-03-04 04:20:39'),('4dd71ae8-07f9-4fc4-8566-8f7703cd90fc','App\\Notifications\\OfferComment','App\\Models\\User',4,'{\"title\":\"Offer Response: etago\",\"message\":\"etago responded to their offer for IT manager: \\\"ok i will see you\\\"\",\"application_id\":7,\"candidate_name\":\"etago\",\"type\":\"offer_message\"}',NULL,'2026-03-03 11:02:37','2026-03-03 11:02:37'),('4f4351bf-b969-4c15-8f1f-873beb478211','App\\Notifications\\RequisitionApproved','App\\Models\\User',1,'{\"requisition_id\":3,\"title\":\"IT manager\",\"status\":\"approved\",\"message\":\"Hiring requisition approved by executive layer.\"}','2026-03-04 03:51:56','2026-03-03 00:20:50','2026-03-04 03:51:56'),('51e7ca54-c59f-4841-b5b1-113152da63f6','App\\Notifications\\OfferComment','App\\Models\\User',3,'{\"title\":\"Offer Response: etago\",\"message\":\"etago responded to their offer for IT manager: \\\"ok\\\"\",\"application_id\":7,\"candidate_name\":\"etago\",\"type\":\"offer_message\"}','2026-03-04 08:47:15','2026-03-03 11:02:13','2026-03-04 08:47:15'),('54050871-e1b2-4f3f-b1e8-b613a42bf695','App\\Notifications\\GenericNotification','App\\Models\\User',11,'{\"title\":\"TA Team responded to your offer\",\"message\":\"The TA team replied regarding your offer for IT manager: \\\"ok were did you come\\\"\"}','2026-03-03 09:53:27','2026-03-03 09:50:55','2026-03-03 09:53:27'),('54d6b6d6-744d-4152-be0c-4264f6566ab3','App\\Notifications\\ApplicationSubmitted','App\\Models\\Candidate',7,'{\"application_id\":9,\"title\":\"Application Received\",\"message\":\"We have received your application for IT officer\",\"status\":\"pooled\"}',NULL,'2026-03-04 05:52:44','2026-03-04 05:52:44'),('56c05b16-7a73-4929-bcb5-cc1a9d2cbfe4','App\\Notifications\\InterviewScheduled','App\\Models\\User',1,'{\"type\":\"interview\",\"title\":\"Interview Scheduled\",\"interview_id\":10,\"application_id\":14,\"job_title\":\"Backend Developer for Laravel\",\"scheduled_at\":\"2026-03-08\",\"location\":null,\"message\":\"Interview scheduled for etago on Mar 08, 2026\"}','2026-03-06 08:18:48','2026-03-06 08:07:43','2026-03-06 08:18:48'),('58fbfba5-3dcf-4095-809d-4b888d7e0f7e','App\\Notifications\\RequisitionPendingHR','App\\Models\\User',8,'{\"requisition_id\":5,\"title\":\"Nurce\",\"status\":\"pending_hr\",\"message\":\"New requisition submitted for your review.\"}','2026-03-06 07:31:33','2026-03-06 07:12:03','2026-03-06 07:31:33'),('5988341c-a098-4faf-ad22-1a916cef0166','App\\Notifications\\InterviewScheduled','App\\Models\\Candidate',5,'{\"interview_id\":5,\"application_id\":7,\"job_title\":\"IT manager\",\"scheduled_at\":\"2026-03-19 15:37\",\"location\":\"https:\\/\\/maps.app.goo.gl\\/kdJ5ogjUcy1gZtP28\",\"message\":\"Your interview for IT manager is scheduled for Mar 19, 2026\"}',NULL,'2026-03-03 09:35:29','2026-03-03 09:35:29'),('5ae34425-6342-4e37-9066-3617caeb7822','App\\Notifications\\OfferStageNotification','App\\Models\\User',6,'{\"type\":\"offer_stage_notification\",\"message\":\"ok the heaven is come in jun 23\",\"candidate_name\":\"heaven\",\"job_title\":\"IT officer\",\"sender_name\":\"dagi man\",\"application_id\":9}','2026-03-06 07:10:04','2026-03-04 10:21:31','2026-03-06 07:10:04'),('5bf6c919-0d9e-4e26-9d9f-09eb8b382ebc','App\\Notifications\\OfferComment','App\\Models\\User',2,'{\"title\":\"Offer Response: etago\",\"message\":\"etago responded to their offer for IT manager: \\\"ok\\\"\",\"application_id\":7,\"candidate_name\":\"etago\",\"type\":\"offer_message\"}',NULL,'2026-03-03 11:02:12','2026-03-03 11:02:12'),('5c476b27-55f3-40c1-b47d-485cc414550f','App\\Notifications\\InterviewScheduled','App\\Models\\User',6,'{\"interview_id\":8,\"application_id\":9,\"job_title\":\"IT officer\",\"scheduled_at\":\"2026-03-06 13:05\",\"location\":\"https:\\/\\/maps.app.goo.gl\\/kdJ5ogjUcy1gZtP28\",\"message\":\"Interview scheduled for heaven on Mar 06, 2026\"}',NULL,'2026-03-04 06:13:38','2026-03-04 06:13:38'),('61aeac19-d181-4229-9170-63e03efd1f39','App\\Notifications\\OfferComment','App\\Models\\User',4,'{\"title\":\"Offer Response: etago\",\"message\":\"etago responded to their offer for IT manager: \\\"ok\\\"\",\"application_id\":7,\"candidate_name\":\"etago\",\"type\":\"offer_message\"}',NULL,'2026-03-03 11:02:13','2026-03-03 11:02:13'),('61e9bdbb-f4c9-451e-bd7d-9aafd8666fb3','App\\Notifications\\ApplicationStatusUpdated','App\\Models\\Candidate',7,'{\"application_id\":9,\"title\":\"Application Status Updated\",\"message\":\"The status of your application for IT officer has been updated to offer\",\"status\":\"offer\",\"feedback\":\"do you agreee\"}',NULL,'2026-03-04 06:15:27','2026-03-04 06:15:27'),('6519c18b-93c9-4ef3-bf26-d0dfd259c715','App\\Notifications\\ApplicationSubmitted','App\\Models\\Candidate',7,'{\"application_id\":11,\"title\":\"Application Received\",\"message\":\"We have received your application for junior pharmasist\",\"status\":\"pooled\"}',NULL,'2026-03-05 08:42:12','2026-03-05 08:42:12'),('6951eeee-354f-47b4-b3cf-5385b254da31','App\\Notifications\\GenericNotification','App\\Models\\User',11,'{\"title\":\"TA Team responded to your offer\",\"message\":\"The TA team replied regarding your offer for IT manager: \\\"and could you change to the backend to in your project\\\"\"}','2026-03-03 10:48:56','2026-03-03 10:46:44','2026-03-03 10:48:56'),('69b7ab26-3da6-40f9-abb2-26aaf3c9784c','App\\Notifications\\OfferComment','App\\Models\\User',5,'{\"title\":\"Offer Response: etago\",\"message\":\"etago responded to their offer for IT manager: \\\"ok\\\"\",\"application_id\":7,\"candidate_name\":\"etago\",\"type\":\"offer_message\"}',NULL,'2026-03-03 11:02:14','2026-03-03 11:02:14'),('6ac95ede-eea4-446b-aa5b-9c254a481d7c','App\\Notifications\\InterviewScheduled','App\\Models\\Candidate',2,'{\"interview_id\":1,\"application_id\":3,\"job_title\":\"IT manager\",\"scheduled_at\":\"2026-03-11 14:33\",\"location\":\"https:\\/\\/maps.app.goo.gl\\/kdJ5ogjUcy1gZtP28\",\"message\":\"Your interview for IT manager is scheduled for Mar 11, 2026\"}',NULL,'2026-03-03 05:34:46','2026-03-03 05:34:46'),('6db69ce1-c532-4d4b-8e7b-b682902f8607','App\\Notifications\\OfferComment','App\\Models\\User',4,'{\"title\":\"Offer Response: etago\",\"message\":\"etago responded to their offer for IT manager: \\\"ok but i will in the office not come\\\"\",\"application_id\":7}',NULL,'2026-03-03 09:37:39','2026-03-03 09:37:39'),('6f5f4863-94a8-4a35-b4f1-8376d748d40f','App\\Notifications\\OfferComment','App\\Models\\User',1,'{\"title\":\"Offer Response: etago\",\"message\":\"etago responded to their offer for IT manager: \\\"ok but i will in the office not come\\\"\",\"application_id\":7}','2026-03-04 03:51:56','2026-03-03 09:37:38','2026-03-04 03:51:56'),('74079b5b-9745-4953-90d4-cd80ed78e038','App\\Notifications\\InterviewScheduled','App\\Models\\Candidate',7,'{\"interview_id\":8,\"application_id\":9,\"job_title\":\"IT officer\",\"scheduled_at\":\"2026-03-06 13:05\",\"location\":\"https:\\/\\/maps.app.goo.gl\\/kdJ5ogjUcy1gZtP28\",\"message\":\"Your interview for IT officer is scheduled for Mar 06, 2026\"}',NULL,'2026-03-04 06:13:37','2026-03-04 06:13:37'),('7786ddda-f582-46cb-9e6b-6095d925525f','App\\Notifications\\OfferComment','App\\Models\\User',5,'{\"title\":\"Offer Response: etago\",\"message\":\"etago responded to their offer for IT manager: \\\"ok i will see you\\\"\",\"application_id\":7,\"candidate_name\":\"etago\",\"type\":\"offer_message\"}',NULL,'2026-03-03 11:02:37','2026-03-03 11:02:37'),('79a5edad-eac9-4b9a-a51c-320c0c8afa62','App\\Notifications\\InterviewScheduled','App\\Models\\User',6,'{\"interview_id\":9,\"application_id\":9,\"job_title\":\"IT officer\",\"scheduled_at\":\"2026-03-05\",\"location\":\"https:\\/\\/maps.app.goo.gl\\/kdJ5ogjUcy1gZtP28\",\"message\":\"Interview scheduled for heaven on Mar 05, 2026\"}','2026-03-06 07:08:37','2026-03-04 06:15:06','2026-03-06 07:08:37'),('7b955bab-c48f-48c3-a1a0-3fa4fd0aaa33','App\\Notifications\\ApplicationStatusUpdated','App\\Models\\Candidate',5,'{\"application_id\":14,\"title\":\"Application Status Updated\",\"message\":\"The status of your application for Backend Developer for Laravel has been updated to written test\",\"type\":\"status_update\",\"status\":\"written_test\",\"feedback\":\"please come Monday 12 pm\"}',NULL,'2026-03-06 08:03:07','2026-03-06 08:03:07'),('81ee1672-55c3-4dc1-ae20-ecc344d17042','App\\Notifications\\GenericNotification','App\\Models\\User',11,'{\"title\":\"TA Team responded to your offer\",\"message\":\"The TA team replied regarding your offer for IT manager: \\\"ate brather how are you\\\"\"}','2026-03-03 10:48:56','2026-03-03 10:46:15','2026-03-03 10:48:56'),('869fd3d5-3fb5-4b8a-91ec-43d524dab777','App\\Notifications\\InterviewScheduled','App\\Models\\User',1,'{\"interview_id\":1,\"application_id\":3,\"job_title\":\"IT manager\",\"scheduled_at\":\"2026-03-11 14:33\",\"location\":\"https:\\/\\/maps.app.goo.gl\\/kdJ5ogjUcy1gZtP28\",\"message\":\"Interview scheduled for user on Mar 11, 2026\"}','2026-03-04 03:51:56','2026-03-03 05:34:47','2026-03-04 03:51:56'),('8ea6847c-bc1e-49de-b2e6-626f0ec37cde','App\\Notifications\\GenericNotification','App\\Models\\User',11,'{\"title\":\"TA Team responded to your offer\",\"message\":\"The TA team replied regarding your offer for IT manager: \\\"oo so i post the offer in my admin\\\"\"}','2026-03-03 10:31:37','2026-03-03 10:31:00','2026-03-03 10:31:37'),('9229a7b1-26c8-4a05-88cb-84d55f8dc2bb','App\\Notifications\\ApplicationStatusUpdated','App\\Models\\Candidate',7,'{\"application_id\":9,\"title\":\"Application Status Updated\",\"message\":\"The status of your application for IT officer has been updated to written test\",\"status\":\"written_test\",\"feedback\":\"please come to in office\"}',NULL,'2026-03-04 05:57:15','2026-03-04 05:57:15'),('96a3badd-08c6-46ad-b339-918f7a23daf8','App\\Notifications\\InterviewScheduled','App\\Models\\Candidate',7,'{\"interview_id\":9,\"application_id\":9,\"job_title\":\"IT officer\",\"scheduled_at\":\"2026-03-05\",\"location\":\"https:\\/\\/maps.app.goo.gl\\/kdJ5ogjUcy1gZtP28\",\"message\":\"Your interview for IT officer is scheduled for Mar 05, 2026\"}',NULL,'2026-03-04 06:15:05','2026-03-04 06:15:05'),('9f6a19eb-b3e9-469e-8cbe-7f063f8b5458','App\\Notifications\\InterviewScheduled','App\\Models\\Candidate',5,'{\"type\":\"interview\",\"title\":\"Interview Scheduled\",\"interview_id\":10,\"application_id\":14,\"job_title\":\"Backend Developer for Laravel\",\"scheduled_at\":\"2026-03-08\",\"location\":null,\"message\":\"Your interview for Backend Developer for Laravel is scheduled for Mar 08, 2026\"}',NULL,'2026-03-06 08:07:41','2026-03-06 08:07:41'),('a2fed7c3-07d4-409f-974c-c3f7b64ca584','App\\Notifications\\RequisitionPendingCEO','App\\Models\\User',8,'{\"requisition_id\":4,\"title\":\"IT officer\",\"status\":\"pending_ceo\",\"message\":\"New requisition awaiting your approval.\"}',NULL,'2026-03-03 06:16:48','2026-03-03 06:16:48'),('a7cd5833-424c-49d0-b0cb-2b72c263de61','App\\Notifications\\ApplicationSubmitted','App\\Models\\Candidate',5,'{\"application_id\":14,\"title\":\"Application Received\",\"message\":\"We have received your application for Backend Developer for Laravel\",\"type\":\"application\",\"status\":\"pooled\"}',NULL,'2026-03-06 08:00:54','2026-03-06 08:00:54'),('a9403824-7f3d-4b83-98ae-919dff8ab68b','App\\Notifications\\InterviewScheduled','App\\Models\\Candidate',6,'{\"interview_id\":6,\"application_id\":8,\"job_title\":\"IT manager\",\"scheduled_at\":\"2026-03-04 09:59\",\"location\":\"droga pharma rufael\",\"message\":\"Your interview for IT manager is scheduled for Mar 04, 2026\"}',NULL,'2026-03-04 03:54:20','2026-03-04 03:54:20'),('ab41c3b9-c17a-46b7-a193-a59165bbfa37','App\\Notifications\\RequisitionHRApproved','App\\Models\\User',6,'{\"requisition_id\":4,\"title\":\"IT officer\",\"status\":\"pending_ceo\",\"message\":\"HR has authorized your requisition. Awaiting CEO sign-off.\"}','2026-03-06 07:10:21','2026-03-03 06:16:49','2026-03-06 07:10:21'),('add2291d-4b95-4cbc-b95b-b88bbf21f666','App\\Notifications\\OfferComment','App\\Models\\User',2,'{\"title\":\"Offer Response: etago\",\"message\":\"etago responded to their offer for IT manager: \\\"ok but i will in the office not come\\\"\",\"application_id\":7}',NULL,'2026-03-03 09:37:38','2026-03-03 09:37:38'),('b704f2f0-fe90-4928-8300-7a0ece3334c6','App\\Notifications\\OfferComment','App\\Models\\User',1,'{\"title\":\"Offer Response: etago\",\"message\":\"etago responded to their offer for IT manager: \\\"ok i will see you\\\"\",\"application_id\":7,\"candidate_name\":\"etago\",\"type\":\"offer_message\"}','2026-03-04 03:51:56','2026-03-03 11:02:33','2026-03-04 03:51:56'),('b7e273c3-a154-4469-824c-dd62ea929a54','App\\Notifications\\ApplicationSubmitted','App\\Models\\Candidate',7,'{\"application_id\":12,\"title\":\"Application Received\",\"message\":\"We have received your application for Backend Developer for Laravel\",\"status\":\"submitted\"}',NULL,'2026-03-05 09:34:21','2026-03-05 09:34:21'),('c28d3eff-5ecb-492d-8b32-edeee3e2ac70','App\\Notifications\\InterviewScheduled','App\\Models\\Candidate',4,'{\"interview_id\":2,\"application_id\":5,\"job_title\":\"IT officer\",\"scheduled_at\":\"2026-03-04 14:38\",\"location\":\"https:\\/\\/maps.app.goo.gl\\/kdJ5ogjUcy1gZtP28\",\"message\":\"Your interview for IT officer is scheduled for Mar 04, 2026\"}',NULL,'2026-03-03 07:39:28','2026-03-03 07:39:28'),('c5e040ac-f0bf-4663-bfd2-a35246fcc1c9','App\\Notifications\\InterviewScheduled','App\\Models\\User',1,'{\"interview_id\":4,\"application_id\":7,\"job_title\":\"IT manager\",\"scheduled_at\":\"2026-03-03 05:03\",\"location\":\"https:\\/\\/maps.app.goo.gl\\/kdJ5ogjUcy1gZtP28\",\"message\":\"Interview scheduled for etago on Mar 03, 2026\"}','2026-03-04 03:51:56','2026-03-03 09:02:08','2026-03-04 03:51:56'),('c6f5dbd6-357c-4669-8070-d7e213159799','App\\Notifications\\OfferComment','App\\Models\\User',1,'{\"title\":\"Offer Response: etago\",\"message\":\"etago responded to their offer for IT manager: \\\"ok please answer me\\\"\",\"application_id\":7,\"candidate_name\":\"etago\",\"type\":\"offer_message\"}','2026-03-04 03:51:56','2026-03-03 09:50:14','2026-03-04 03:51:56'),('c7e426a2-9d04-48d4-983b-cce56bbbd8ed','App\\Notifications\\OfferComment','App\\Models\\User',2,'{\"title\":\"Offer Response: etago\",\"message\":\"etago responded to their offer for IT manager: \\\"ok please answer me\\\"\",\"application_id\":7,\"candidate_name\":\"etago\",\"type\":\"offer_message\"}',NULL,'2026-03-03 09:50:15','2026-03-03 09:50:15'),('c7f7291a-b4e8-42e2-9629-9c69b6c5c6ec','App\\Notifications\\ApplicationStatusUpdated','App\\Models\\Candidate',6,'{\"application_id\":8,\"title\":\"Application Status Updated\",\"message\":\"The status of your application for IT manager has been updated to offer\",\"status\":\"offer\",\"feedback\":\"ok\"}',NULL,'2026-03-04 04:13:52','2026-03-04 04:13:52'),('d012081f-706c-46b9-81b6-61b71472e5b4','App\\Notifications\\RequisitionReadyForPosting','App\\Models\\User',3,'{\"requisition_id\":3,\"title\":\"IT manager\",\"status\":\"approved\",\"message\":\"New requisition approved and ready for posting.\"}','2026-03-03 06:20:57','2026-03-03 00:20:50','2026-03-03 06:20:57'),('d1163ae1-752b-4417-a264-a6471e3103fb','App\\Notifications\\RequisitionCreated','App\\Models\\User',3,'{\"requisition_id\":3,\"title\":\"IT manager\",\"status\":\"pending_hr\",\"message\":\"New requisition submitted and awaiting approval.\"}','2026-03-03 00:21:08','2026-03-03 00:20:31','2026-03-03 00:21:08'),('d2c50bb3-97af-4aa3-bafc-658016d6acde','App\\Notifications\\ApplicationSubmitted','App\\Models\\Candidate',3,'{\"application_id\":10,\"title\":\"Application Received\",\"message\":\"We have received your application for junior pharmasist\",\"status\":\"pooled\"}',NULL,'2026-03-05 07:55:52','2026-03-05 07:55:52'),('d92da12d-b541-406d-9a67-b49a2a87147b','App\\Notifications\\OfferComment','App\\Models\\User',5,'{\"title\":\"Offer Response: etago\",\"message\":\"etago responded to their offer for IT manager: \\\"ok please answer me\\\"\",\"application_id\":7,\"candidate_name\":\"etago\",\"type\":\"offer_message\"}',NULL,'2026-03-03 09:50:17','2026-03-03 09:50:17'),('dcb06909-a017-45a9-ba96-86a0be705696','App\\Notifications\\InterviewScheduled','App\\Models\\User',6,'{\"interview_id\":2,\"application_id\":5,\"job_title\":\"IT officer\",\"scheduled_at\":\"2026-03-04 14:38\",\"location\":\"https:\\/\\/maps.app.goo.gl\\/kdJ5ogjUcy1gZtP28\",\"message\":\"Interview scheduled for \\u12f3\\u130d\\u121d \\u1218\\u1295\\u130d\\u1235\\u1271 on Mar 04, 2026\"}',NULL,'2026-03-03 07:39:29','2026-03-03 07:39:29'),('e94e7673-de93-4495-af80-1ce284b494f4','App\\Notifications\\InterviewScheduled','App\\Models\\User',1,'{\"interview_id\":6,\"application_id\":8,\"job_title\":\"IT manager\",\"scheduled_at\":\"2026-03-04 09:59\",\"location\":\"droga pharma rufael\",\"message\":\"Interview scheduled for dagim on Mar 04, 2026\"}','2026-03-04 04:11:28','2026-03-04 03:54:21','2026-03-04 04:11:28'),('ec4be608-9bcc-41ed-beab-4f3bad89844a','App\\Notifications\\ApplicationSubmitted','App\\Models\\Candidate',3,'{\"application_id\":13,\"title\":\"Application Received\",\"message\":\"We have received your application for Backend Developer for Laravel\",\"status\":\"submitted\"}',NULL,'2026-03-06 05:02:43','2026-03-06 05:02:43'),('f542f250-d9a5-452f-8838-8e9bb86b2656','App\\Notifications\\ApplicationStatusUpdated','App\\Models\\Candidate',6,'{\"application_id\":8,\"title\":\"Application Status Updated\",\"message\":\"The status of your application for IT manager has been updated to written test\",\"status\":\"written_test\",\"feedback\":\"ok\"}',NULL,'2026-03-04 03:53:30','2026-03-04 03:53:30'),('f7004fae-d56a-4eca-84bf-c94f783d3225','App\\Notifications\\RequisitionRejected','App\\Models\\User',6,'{\"requisition_id\":5,\"title\":\"Nurce\",\"status\":\"rejected\",\"reject_comment\":\"their is no budget please ask in jun 12\",\"message\":\"Hiring requisition has been rejected. Feedback: their is no budget please ask in jun 12\"}','2026-03-06 07:18:42','2026-03-06 07:14:03','2026-03-06 07:18:42'),('f7c8419d-3133-4d50-bee0-c099dd40dd9d','App\\Notifications\\RequisitionApproved','App\\Models\\User',1,'{\"requisition_id\":2,\"title\":\"junior pharmasist\",\"status\":\"approved\",\"message\":\"Hiring requisition approved by executive layer.\"}','2026-03-04 03:51:56','2026-03-02 23:34:30','2026-03-04 03:51:56'),('ff073198-ae3b-4381-83d0-8648f5af35b9','App\\Notifications\\InterviewScheduled','App\\Models\\Candidate',6,'{\"interview_id\":7,\"application_id\":8,\"job_title\":\"IT manager\",\"scheduled_at\":\"2026-03-04 10:17\",\"location\":\"https:\\/\\/maps.app.goo.gl\\/kdJ5ogjUcy1gZtP28\",\"message\":\"Your interview for IT manager is scheduled for Mar 04, 2026\"}',NULL,'2026-03-04 04:12:45','2026-03-04 04:12:45');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offers`
--

DROP TABLE IF EXISTS `offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `application_id` bigint unsigned NOT NULL,
  `salary` decimal(15,2) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `offer_letter_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `offers_application_id_foreign` (`application_id`),
  CONSTRAINT `offers_application_id_foreign` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offers`
--

LOCK TABLES `offers` WRITE;
/*!40000 ALTER TABLE `offers` DISABLE KEYS */;
/*!40000 ALTER TABLE `offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `onboarding_plans`
--

DROP TABLE IF EXISTS `onboarding_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `onboarding_plans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `checklist` json DEFAULT NULL,
  `orientation_date` date DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'not_started',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `onboarding_plans_user_id_foreign` (`user_id`),
  CONSTRAINT `onboarding_plans_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboarding_plans`
--

LOCK TABLES `onboarding_plans` WRITE;
/*!40000 ALTER TABLE `onboarding_plans` DISABLE KEYS */;
/*!40000 ALTER TABLE `onboarding_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',1,'auth_token','c8e9918d66a043cf4f8f33b0982acecdec90519d054691750e3a7244f17a6d35','[\"*\"]',NULL,NULL,'2026-02-28 10:07:24','2026-02-28 10:07:24'),(2,'App\\Models\\User',1,'auth_token','fd978c297c8b45be84eb4720a60dabd0afd46d83c5711b0bb42019970ad272d4','[\"*\"]','2026-02-28 10:11:58',NULL,'2026-02-28 10:07:31','2026-02-28 10:11:58'),(3,'App\\Models\\User',1,'auth_token','ec77481ac9a6e3699f89e7a00e52deac92423fbcb319634771bba5fe4295b746','[\"*\"]','2026-02-28 10:09:20',NULL,'2026-02-28 10:08:49','2026-02-28 10:09:20'),(4,'App\\Models\\User',1,'auth_token','459763b26e41d3ee63d1a2b96b1c82dd6d1f2ef7fc263b44cef5ee27dddeefdb','[\"*\"]','2026-03-01 18:09:51',NULL,'2026-02-28 10:12:10','2026-03-01 18:09:51'),(5,'App\\Models\\User',1,'auth_token','2c7c1a48e452127b3bdd49ae4a61570073aeffc314c8d5eb28bc90bc72c4b932','[\"*\"]','2026-02-27 06:49:28',NULL,'2026-02-28 10:18:33','2026-02-27 06:49:28'),(6,'App\\Models\\User',1,'auth_token','9b0ff8993ddf4bf53b773637f9113bd31e0e53640411ed954fcb8d47375bc696','[\"*\"]','2026-03-02 23:49:41',NULL,'2026-03-02 22:37:57','2026-03-02 23:49:41'),(7,'App\\Models\\User',1,'auth_token','fe31fa24e54ee933f8995bf0f09ac7928a78038103d114489ca8106e7e0ea2f0','[\"*\"]','2026-03-02 23:24:49',NULL,'2026-03-02 22:38:13','2026-03-02 23:24:49'),(8,'App\\Models\\User',1,'auth_token','154b816739f9383d508ff33f3cc9ae8df28d60943f09aef0b43fa4a8e98b68f8','[\"*\"]','2026-03-03 00:46:27',NULL,'2026-03-02 23:25:27','2026-03-03 00:46:27'),(9,'App\\Models\\User',1,'auth_token','20fbceab609d73d092e8730e6fcb52e1aa719bb770ee652a5c6e6c7a93b82686','[\"*\"]','2026-03-03 00:03:21',NULL,'2026-03-02 23:55:07','2026-03-03 00:03:21'),(10,'App\\Models\\User',1,'auth_token','e626cae81521f3ff6423f18182db229e74a32b1a58e23ad08dc44ec3962b72f7','[\"*\"]','2026-03-05 06:45:32',NULL,'2026-03-03 00:04:19','2026-03-05 06:45:32'),(11,'App\\Models\\User',3,'auth_token','c4697362d1a57e936d0ab3e8eaa324fd9a3f999c96da78bcff7bfc36f466e28f','[\"*\"]','2026-03-04 07:21:15',NULL,'2026-03-03 00:14:41','2026-03-04 07:21:15'),(12,'App\\Models\\User',1,'auth_token','e53de95b38e8180cd96eb72d34a1db193f3e9eae16ce7d97ef65164a1b830926','[\"*\"]','2026-03-03 00:39:36',NULL,'2026-03-03 00:39:33','2026-03-03 00:39:36'),(13,'App\\Models\\User',5,'auth_token','17a6b0ae577864a08505ecfba336a3a4e97c2d4e3bf5ce70b6d0630530b882bf','[\"*\"]','2026-03-03 00:50:07',NULL,'2026-03-03 00:44:15','2026-03-03 00:50:07'),(14,'App\\Models\\User',6,'auth_token','24b09599859cff9a82cd20e27168618dc0772819edae026e76bb12bed1dbd79f','[\"*\"]','2026-03-03 05:36:18',NULL,'2026-03-03 00:46:50','2026-03-03 05:36:18'),(15,'App\\Models\\User',7,'auth_token','0ee85a9398caa9894cc547e6af3e53b0d4c4887be9d52f59d05b2988a65ac0e3','[\"*\"]','2026-03-03 05:37:18',NULL,'2026-03-03 05:37:08','2026-03-03 05:37:18'),(16,'App\\Models\\User',8,'auth_token','c75d4c658385419f529512035ca2724f3049321ef593d58f4919b66573a3b135','[\"*\"]','2026-03-03 05:37:38',NULL,'2026-03-03 05:37:33','2026-03-03 05:37:38'),(17,'App\\Models\\User',3,'auth_token','fb69cf935606fd458816bbedc7def79f0d3a606eff766c4366d3234d35104cdd','[\"*\"]','2026-03-03 05:37:58',NULL,'2026-03-03 05:37:54','2026-03-03 05:37:58'),(18,'App\\Models\\User',9,'auth_token','621918321844c8fc4cbbea65095fff842ab5db1de14c30e8a4d43eb39d2925cc','[\"*\"]','2026-03-03 05:38:21',NULL,'2026-03-03 05:38:15','2026-03-03 05:38:21'),(19,'App\\Models\\User',1,'auth_token','3280a33e7f573098c7931587655cecc0d362a2d6398c18f7c0e7ce35161ea5b3','[\"*\"]','2026-03-04 09:02:31',NULL,'2026-03-03 05:38:42','2026-03-04 09:02:31'),(20,'App\\Models\\User',6,'auth_token','b75a92656d17ab6254f07feef0926811f21453ed795b0c344c1a421aa3f397fb','[\"*\"]','2026-03-03 06:06:15',NULL,'2026-03-03 06:05:25','2026-03-03 06:06:15'),(21,'App\\Models\\User',6,'auth_token','0dad31d442578a695c0d1b43418d9bc5096b1275e1bae9d5faaad6f8d2733cf7','[\"*\"]','2026-03-03 06:15:36',NULL,'2026-03-03 06:06:25','2026-03-03 06:15:36'),(22,'App\\Models\\User',7,'auth_token','f3df8becdd56b0f043ddfb3e13f70287498982cebcf3a400f7dac2e9d2097690','[\"*\"]','2026-03-03 06:16:52',NULL,'2026-03-03 06:15:57','2026-03-03 06:16:52'),(23,'App\\Models\\User',8,'auth_token','55327ef6b1a2702a1b2128a9d8eda55abc113046600435c57add2a74266897c2','[\"*\"]','2026-03-03 06:17:51',NULL,'2026-03-03 06:17:06','2026-03-03 06:17:51'),(24,'App\\Models\\User',3,'auth_token','0b45d5624d609f24266958d8ae09b4bc29ed3fcb4b7652eefe385c2d73162189','[\"*\"]','2026-03-03 06:18:35',NULL,'2026-03-03 06:18:11','2026-03-03 06:18:35'),(25,'App\\Models\\User',5,'auth_token','ff042475d606b3cff7691572ea1720edfe4d51c922b27e993b49fb75742f6f2a','[\"*\"]','2026-03-03 06:20:15',NULL,'2026-03-03 06:20:00','2026-03-03 06:20:15'),(26,'App\\Models\\User',3,'auth_token','1cf3e3a99e564afd80c8bc6f0517cc4e9014c1c8a27c6bc3fadfd8c1628fe536','[\"*\"]','2026-03-03 07:14:45',NULL,'2026-03-03 06:20:40','2026-03-03 07:14:45'),(27,'App\\Models\\User',10,'auth_token','1cff4b9ec946f48e0cc409eb4c20e114218a66ff5a5aba018418e7b2d7541dd8','[\"*\"]','2026-03-03 07:16:39',NULL,'2026-03-03 07:15:31','2026-03-03 07:16:39'),(28,'App\\Models\\User',5,'auth_token','32cbfd99b601c2dee79b8753c96bcd881b192da8bd12cdf4868cd92f9c978c81','[\"*\"]','2026-03-03 07:37:29',NULL,'2026-03-03 07:21:06','2026-03-03 07:37:29'),(29,'App\\Models\\User',3,'auth_token','f4b0dcffb46d802c7f29bfe14f29bb76f56e8d2301634792894dd97a9e1c5562','[\"*\"]','2026-03-03 08:34:07',NULL,'2026-03-03 07:37:44','2026-03-03 08:34:07'),(30,'App\\Models\\User',10,'auth_token','3ced435f1fe9d87a7c30e14ea37ed73872afa544ef352c8919597303ebb7e9f2','[\"*\"]','2026-03-03 08:35:46',NULL,'2026-03-03 08:34:33','2026-03-03 08:35:46'),(31,'App\\Models\\User',6,'auth_token','6e941c8fa4ed2f578e20a1f9637c077e39917ba984c783a754a92a78a923e414','[\"*\"]','2026-03-03 08:43:16',NULL,'2026-03-03 08:39:15','2026-03-03 08:43:16'),(32,'App\\Models\\User',10,'auth_token','06b4d6a61ccf4711cd891151ebb4af8ff6c71077b308020f4efd3be496c25314','[\"*\"]','2026-03-03 08:54:46',NULL,'2026-03-03 08:49:00','2026-03-03 08:54:46'),(33,'App\\Models\\User',11,'auth_token','23a4e8d595a992e41a8b9f38165ab468fe3d74126f036bb3e6ed84af20d794f7','[\"*\"]','2026-03-04 03:09:14',NULL,'2026-03-03 08:58:21','2026-03-04 03:09:14'),(34,'App\\Models\\User',12,'auth_token','3305fa20ebc3e5a12beb0bb809f9b082817821ea65efdea466fc8c3ca383d650','[\"*\"]','2026-03-04 05:41:55',NULL,'2026-03-04 03:49:32','2026-03-04 05:41:55'),(35,'App\\Models\\User',13,'auth_token','b31d910ebd6de469a6ff80cd8577361ee7fcd5280e9df076ae911ff53a976626','[\"*\"]','2026-03-04 05:57:45',NULL,'2026-03-04 05:50:33','2026-03-04 05:57:45'),(36,'App\\Models\\User',13,'auth_token','74de49cc2d35f9ee9a42c2e6d55bb89285b2cd45375d2f060840f1a7b9a5b207','[\"*\"]','2026-03-04 06:17:10',NULL,'2026-03-04 06:10:33','2026-03-04 06:17:10'),(37,'App\\Models\\User',3,'auth_token','b804e7d63c52ed45d229a46c66bfa8ddb05eb7ab9e309d237717493e3f2fd175','[\"*\"]','2026-03-04 08:59:09',NULL,'2026-03-04 08:46:43','2026-03-04 08:59:09'),(38,'App\\Models\\User',3,'auth_token','b365b60549b75480aec6874d793c783150b988ffbe48736e17f7ab21ba9f6451','[\"*\"]','2026-03-06 08:59:23',NULL,'2026-03-04 08:59:54','2026-03-06 08:59:23'),(39,'App\\Models\\User',1,'auth_token','e64d631c2859c601456d2063678e01876669662f5b178b121666f1c9083cd7d5','[\"*\"]','2026-03-05 03:12:46',NULL,'2026-03-04 09:41:05','2026-03-05 03:12:46'),(40,'App\\Models\\User',13,'auth_token','763b164ea5f36f8a0032b0f9c5d82f9d5a3801cb860dcea4453c6ca8e760626c','[\"*\"]','2026-03-06 06:47:17',NULL,'2026-03-04 09:44:11','2026-03-06 06:47:17'),(41,'App\\Models\\User',1,'auth_token','3ede66f36d628e9ba6dfb36f2a2ddbe9f0cc723933168245607ca6fc357a6e09','[\"*\"]','2026-03-06 07:21:15',NULL,'2026-03-05 06:11:21','2026-03-06 07:21:15'),(42,'App\\Models\\User',6,'auth_token','252f31dbba8ce94ab57841dddabdece0e07cfc47ff5a51775ccb82d51b4311b4','[\"*\"]','2026-03-06 07:00:10',NULL,'2026-03-06 07:00:03','2026-03-06 07:00:10'),(43,'App\\Models\\User',7,'auth_token','2be160ddf9de3299115c00ce4ae1f4b779eb1be587a27d2b7b017e7478c11dcb','[\"*\"]','2026-03-06 07:00:50',NULL,'2026-03-06 07:00:43','2026-03-06 07:00:50'),(44,'App\\Models\\User',8,'auth_token','7bfe84ad69ee7501017554dd10da1917e6d9e005d3f2a6f1083fb69faf98a4ae','[\"*\"]','2026-03-06 07:07:30',NULL,'2026-03-06 07:06:44','2026-03-06 07:07:30'),(45,'App\\Models\\User',6,'auth_token','3ca5fbb2bbdad4f8b204e87f6ec5e94b34c681e3c6d712c61a7a5377b9c54df0','[\"*\"]','2026-03-06 07:12:06',NULL,'2026-03-06 07:08:13','2026-03-06 07:12:06'),(46,'App\\Models\\User',7,'auth_token','d279f8b86d8a5791c4153eb5e675fa17ad36c19bb09289280fb62070a1be6b96','[\"*\"]','2026-03-06 07:17:34',NULL,'2026-03-06 07:12:24','2026-03-06 07:17:34'),(47,'App\\Models\\User',6,'auth_token','ea2adb90aee1dda9e468c9ca1b771f39456ea50a997a354ad2c157327702597c','[\"*\"]','2026-03-06 07:20:17',NULL,'2026-03-06 07:18:04','2026-03-06 07:20:17'),(48,'App\\Models\\User',8,'auth_token','c76f9a9ad3ce0a5ed85008942e431a2bb5c51586eeef0f8b9ccbe381aa7f878a','[\"*\"]','2026-03-06 07:38:08',NULL,'2026-03-06 07:21:13','2026-03-06 07:38:08'),(49,'App\\Models\\User',1,'auth_token','5bfca7cacbc539334a282c84b0eac043b8e2fc2c59a33530bc25f1404c9f37fa','[\"*\"]','2026-03-06 08:59:15',NULL,'2026-03-06 07:22:00','2026-03-06 08:59:15'),(50,'App\\Models\\User',3,'auth_token','3a3461060943dce712af94ce35e034b90e4c9ec8a64bb5a61f69b8aa5da0e371','[\"*\"]','2026-03-06 07:54:32',NULL,'2026-03-06 07:41:20','2026-03-06 07:54:32'),(51,'App\\Models\\User',11,'auth_token','8c71145916314546a51ef0c939d3e1cd5663095c719b240b2811598b66c213fd','[\"*\"]','2026-03-06 08:01:02',NULL,'2026-03-06 07:55:19','2026-03-06 08:01:02'),(52,'App\\Models\\User',3,'auth_token','c92e1d2c1d3f0bad5d662beeeabe20777479cf39858d7a378124deb8a674256b','[\"*\"]','2026-03-06 08:08:55',NULL,'2026-03-06 08:01:45','2026-03-06 08:08:55'),(53,'App\\Models\\User',1,'auth_token','669885336da6063bce3aeeceb5f0f1b40e70763622e38093fe08aea8f41499d1','[\"*\"]','2026-03-06 08:59:01',NULL,'2026-03-06 08:09:26','2026-03-06 08:59:01');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin','2026-02-28 10:15:23','2026-02-28 10:15:23'),(2,'hiring_manager','2026-02-28 10:15:23','2026-02-28 10:15:23'),(4,'candidate','2026-02-28 10:15:23','2026-02-28 10:15:23'),(5,'ta_team','2026-02-28 10:15:23','2026-02-28 10:15:23'),(6,'ceo_approver','2026-03-03 05:47:27','2026-03-03 05:47:27'),(7,'hr_approver','2026-03-03 05:47:27','2026-03-03 05:47:27');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `talent_pool`
--

DROP TABLE IF EXISTS `talent_pool`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `talent_pool` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `candidate_id` bigint unsigned NOT NULL,
  `tags` text COLLATE utf8mb4_unicode_ci,
  `skills` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `talent_pool_candidate_id_foreign` (`candidate_id`),
  CONSTRAINT `talent_pool_candidate_id_foreign` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `talent_pool`
--

LOCK TABLES `talent_pool` WRITE;
/*!40000 ALTER TABLE `talent_pool` DISABLE KEYS */;
/*!40000 ALTER TABLE `talent_pool` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `github_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `otp_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` bigint unsigned DEFAULT NULL,
  `company_id` bigint unsigned DEFAULT NULL,
  `department_id` bigint unsigned DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_id_foreign` (`role_id`),
  KEY `users_company_id_foreign` (`company_id`),
  KEY `users_department_id_foreign` (`department_id`),
  CONSTRAINT `users_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL,
  CONSTRAINT `users_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'dagi man','dagimmengestu5@gmail.com','2026-02-28 10:07:24','107317391175792783034',NULL,'https://lh3.googleusercontent.com/a/ACg8ocI6jSfQeGrtmSBWiivMDLfdXKKuf5fcvr_cxjPrtoQcp58RZgQ=s96-c',NULL,'$2y$12$1Cq20b3QdavySPLUco8/MOtDPLicvTujkVeQu7nNAfpUM19fztNRu',1,NULL,NULL,'i0PF6UIrxH8xq0Og8hEItU7LXrS54vdzkUNVvvV4PkA0s9Zej0oz626ITIaP','2026-02-28 10:07:24','2026-03-02 22:37:24'),(2,'Admin User','admin@drogasms.com',NULL,NULL,NULL,NULL,NULL,'$2y$12$buDS1brt97AJA0sdyoXQSONRj/zyEtAM45wXv.1SB038i5woQ9zGa',1,NULL,NULL,NULL,'2026-02-28 10:15:24','2026-02-28 10:15:24'),(3,'Dagi Man','dagitach@gmail.com','2026-03-03 00:14:00','117921724486601724789',NULL,'https://lh3.googleusercontent.com/a/ACg8ocLfFm7lv38gOREO-4U7_Hele3pB72BaTjxrqiMI1eQgbJ0aQQ=s96-c',NULL,'$2y$12$fIEhGA9PpgrxIer7oTqlkearAO/VgkszJXfJbeE5JtAIFqFyNRB0i',5,3,9,NULL,'2026-02-28 10:16:46','2026-03-04 09:52:57'),(4,'USER','dagi5tech@gmail.com',NULL,NULL,NULL,NULL,'309196','$2y$12$OvYCxLh4YePgwdUDLUs7Fe3/2YhtX0zivUnZVNbPQeduwDAoSQp66',5,1,1,NULL,'2026-03-03 00:41:47','2026-03-03 06:19:06'),(5,'user','dagi5tube@gmail.com','2026-03-03 00:43:51','110157186115568034044',NULL,'https://lh3.googleusercontent.com/a/ACg8ocKigsiLWnBze-wNedLHdgAv80xm0KA6bIs5DYcK2ku-rgRuVw=s96-c',NULL,'$2y$12$emwju2C7ShhtVzJFeRhimOpu9gtPrQ0w.8WklgN10cVuHBJYkAbdi',5,1,1,NULL,'2026-03-03 00:43:25','2026-03-03 06:20:00'),(6,'Dave Man','daveman191919@gmail.com','2026-03-03 00:46:50','110048223626684486149',NULL,'https://lh3.googleusercontent.com/a/ACg8ocI-6QfDhgSvpzWdyP1g80HrV5uPMYuzpzagxdhzApG1gPdPbQ=s96-c',NULL,'$2y$12$CCO122wVtWWZrdkY1Om1ueAtPsHqv7PPlapoHH9foRnTI7UPdO52S',2,3,10,NULL,'2026-03-03 00:46:50','2026-03-03 05:39:22'),(7,'Dagi Tech','dagitech6@gmail.com','2026-03-03 05:37:08','113953802478606182871',NULL,'https://lh3.googleusercontent.com/a/ACg8ocLApS8T6FpiL83nS2ysVOsgtY6MbDFqSA23grwgrez5HW-zEg=s96-c',NULL,'$2y$12$xQT/Pt8XzsUkzlU9LYAS9uk63VOjU4x11hUH/5wONSd5JJf6rPlv.',7,3,9,NULL,'2026-03-03 05:37:08','2026-03-03 06:04:33'),(8,'Surafel Tefera','surafeltefera1978@gmail.com','2026-03-03 05:37:33','100571687353465832027',NULL,'https://lh3.googleusercontent.com/a/ACg8ocLf2xq0agvebU4BjD2lYUs3xBYJsOAs7_NfjCYxb1rqFGRHSQ=s96-c',NULL,'$2y$12$z9mDFbwEIae7DmWmaJmOIufuI/MJE3N5MKtp0gWZakF2HVxKfnDiW',6,3,11,NULL,'2026-03-03 05:37:33','2026-03-03 06:04:51'),(9,'Dagi Tube','tubedagi5@gmail.com','2026-03-03 05:38:15','104320957743754043060',NULL,'https://lh3.googleusercontent.com/a/ACg8ocJ4bZJs2HIUjoE7Ir9DGQCd8HySyq66kXjI_vHQ--z6EeHKMA=s96-c',NULL,'$2y$12$9OkxsQCizai8nL97nUy61e3dvGXL41JI5eHOrkq7O1CYRN8R/4b9S',4,NULL,NULL,NULL,'2026-03-03 05:38:15','2026-03-03 05:38:15'),(10,'ዳግም መንግስቱ','dagimmengistuz5@gmail.com','2026-03-03 07:15:31','106701036556187190552',NULL,'https://lh3.googleusercontent.com/a/ACg8ocLO-_y7I4tvXp4yuo1Q7HLoa_gIVWqse8TuAPBEoylRdySG0w=s96-c',NULL,'$2y$12$JeDvRBM1bX1EjajChRW69ubt3Nycy/vZ9pUVrmdcHbjIYCrLQCtPC',4,NULL,NULL,NULL,'2026-03-03 07:15:31','2026-03-03 07:15:31'),(11,'etago','hnsh0977@gmail.com','2026-03-03 08:57:52',NULL,NULL,NULL,NULL,'$2y$12$NVHM1XQtr0BumjCdXibl5ucpJjPWbh/UielF4VaOEAeipdP2f9k6m',4,NULL,NULL,NULL,'2026-03-03 08:57:22','2026-03-03 08:57:52'),(12,'dagim','dagim@drogapharma.com','2026-03-04 03:48:49',NULL,NULL,NULL,NULL,'$2y$12$z83FjWJBVZ74QdGCkwawoerXBcDubjNP3p1ZASglOhRNFzUgnk09K',4,NULL,NULL,NULL,'2026-03-04 03:47:47','2026-03-04 03:48:49'),(13,'heaven','hr@drogapharma.com','2026-03-04 05:50:01',NULL,NULL,NULL,NULL,'$2y$12$au9Gy183fltB4LsXgUZZ.uQe7MOzwaQvJCXSBPH2dt3DW5.rGxL4e',4,NULL,NULL,NULL,'2026-03-04 05:49:27','2026-03-04 05:50:01');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-06 15:45:07
