-- donorconnect.users definition

CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `frist_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `prefered_hospital_id` int DEFAULT NULL,
  `avatar_url` text,
  `role_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `users_role_fk` (`role_id`),
  CONSTRAINT `users_role_fk` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`)
)  



-- donorconnect.`role` definition

CREATE TABLE `role` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name_key` varchar(20) DEFAULT NULL,
  `role_name_display_key` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;







-- donorconnect.payments definition

CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `donor_id` int DEFAULT NULL,
  `recipient_id` int DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','completed','failed') DEFAULT 'pending',
  `transaction_id` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `donor_id` (`donor_id`),
  KEY `recipient_id` (`recipient_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`donor_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




-- donorconnect.notifications definition

CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `donation_requests_id` int DEFAULT NULL,
  `notification_type_id` int DEFAULT NULL,
  `status` enum('sent','failed','pending') DEFAULT 'pending',
  `sent_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `donation_requests_id` (`donation_requests_id`),
  KEY `notification_type_id` (`notification_type_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`donation_requests_id`) REFERENCES `donation_requests` (`donation_requests_id`) ON DELETE CASCADE,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`notification_type_id`) REFERENCES `notification_type` (`notification_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



-- donorconnect.notification_type definition

CREATE TABLE `notification_type` (
  `notification_type_id` int NOT NULL AUTO_INCREMENT,
  `notification_type_key` varchar(30) DEFAULT NULL,
  `notification_type_display_display_name` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`notification_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;






-- donorconnect.donor_profiles definition

CREATE TABLE `donor_profiles` (
  `donro_profile_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `blood_group` enum('A+','A-','B+','B-','O+','O-','AB+','AB-') NOT NULL,
  `city` varchar(50) NOT NULL,
  `preferred_hospital` varchar(100) DEFAULT NULL,
  `availability` tinyint(1) DEFAULT '1',
  `donation_type_id` int NOT NULL,
  `donation_fee` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`donro_profile_id`),
  KEY `user_id` (`user_id`),
  KEY `donation_type_id` (`donation_type_id`),
  CONSTRAINT `donor_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `donor_profiles_ibfk_2` FOREIGN KEY (`donation_type_id`) REFERENCES `donation_type` (`donation_type_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





-- donorconnect.donation_type definition

CREATE TABLE `donation_type` (
  `donation_type_id` int NOT NULL AUTO_INCREMENT,
  `donation_type_key` varchar(20) DEFAULT NULL,
  `donation_type_display_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`donation_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




-- donorconnect.donation_requests definition

CREATE TABLE `donation_requests` (
  `donation_requests_id` int NOT NULL AUTO_INCREMENT,
  `recipient_id` int DEFAULT NULL,
  `donor_id` int DEFAULT NULL,
  `message` text,
  `status` enum('pending','accepted','declined','completed') DEFAULT 'pending',
  `contact_method` enum('email','sms','whatsapp') DEFAULT 'email',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`donation_requests_id`),
  KEY `recipient_id` (`recipient_id`),
  KEY `donor_id` (`donor_id`),
  CONSTRAINT `donation_requests_ibfk_1` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `donation_requests_ibfk_2` FOREIGN KEY (`donor_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




