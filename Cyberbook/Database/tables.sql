USE `edxapp_csmh`;

CREATE TABLE `export_course_content_and_skill_validation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` varchar(100) NOT NULL,
  `xblock_id` varchar(200) NOT NULL,
  `section` varchar(100) DEFAULT NULL,
  `subsection` varchar(100) DEFAULT NULL,
  `unit` varchar(100) DEFAULT NULL,
  `type_of_xblock` varchar(200) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `sub_title` varchar(200) DEFAULT NULL,
  `text` text,
  `question` varchar(500) DEFAULT NULL,
  `choices` text,
  `image_url` text,
  `correct_answer` varchar(200) DEFAULT NULL,
  `hint` text,
  `problem_name` varchar(200) DEFAULT NULL,
  `skillname` varchar(200) DEFAULT NULL,
  `html_url` varchar(300) DEFAULT NULL,
  `brd_url` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=844 DEFAULT CHARSET=utf8;


CREATE TABLE `skill_mapping` (
  `assessment_id` varchar(150) NOT NULL,
  `location` text NOT NULL,
  PRIMARY KEY (`assessment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `module_skillname` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `xblock_id` varchar(200) NOT NULL,
  `type` varchar(45) NOT NULL,
  `skillname` varchar(200) NOT NULL,
  `location` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `xblock_id` (`xblock_id`)
) ENGINE=InnoDB AUTO_INCREMENT=275 DEFAULT CHARSET=utf8;


CREATE TABLE `pastel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `email` varchar(80) DEFAULT NULL,
  `pastel_student_id` varchar(100) DEFAULT NULL,
  `school` varchar(45) DEFAULT NULL,
  `class` varchar(45) DEFAULT NULL,
  `course_id` varchar(45) DEFAULT NULL,
  `condition` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



CREATE TABLE `temporary_probability` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_pastel_id` varchar(50) DEFAULT NULL,
  `skillname` varchar(100) DEFAULT NULL,
  `correctness` int(11) DEFAULT NULL,
  `timestamp` varchar(50) DEFAULT NULL,
  `probability` varchar(45) DEFAULT NULL,
  `opportunity_counts` int(11) DEFAULT NULL,
  `problem_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `init_parameters_bkt` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `l` varchar(45) DEFAULT NULL,
  `s` varchar(45) DEFAULT NULL,
  `t` varchar(45) DEFAULT NULL,
  `g` varchar(45) DEFAULT NULL,
  `skillname` varchar(45) DEFAULT NULL,
  `course_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;


CREATE TABLE `condition_course_match` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `condition_name` varchar(100) DEFAULT NULL,
  `course_id` varchar(100) DEFAULT NULL,
  `enable_dynamic` int(11) DEFAULT NULL,
  `enable_hiding` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;