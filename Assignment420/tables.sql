drop table if exists word;
drop table if exists part;

create table part
(
	id int unsigned not null auto_increment,
	part varchar(255) not null,
	primary key(id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

create table word
(
	id int unsigned not null auto_increment,
	word varchar(255) not null,
	part_id int unsigned not null,
	definition longtext not null,
	primary key(id),
	constraint part_fk foreign key(part_id) references part(id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;
