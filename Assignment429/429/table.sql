drop table if exists user;
drop table if exists password;

create table password
(
	id int unsigned not null auto_increment,
	password  longtext not null,
	primary key(id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

create table user
(
	id int unsigned not null auto_increment,
	user_name varchar(255) not null,
  display_name varchar(255) not null,
  manager boolean not null,
	password_id int unsigned not null,
	primary key(id),
	constraint password_fk foreign key(password_id) references password(id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;
