create table users (
  id character (40) not null,
  username character (120) not null,
  email character (120),
  phone character (45),
  date_of_birth date,
  primary key (id)
);

insert into users (id, username, email, phone, date_of_birth) values ('ironman', 'tony.stark', 'tony.stark@gmail.com', '0987654321', '1963-03-25');
insert into users (id, username, email, phone, date_of_birth) values ('spiderman', 'peter.parker', 'peter.parker@gmail.com', '0987654321', '1962-08-25');
insert into users (id, username, email, phone, date_of_birth) values ('wolverine', 'james.howlett', 'james.howlett@gmail.com', '0987654321', '1974-11-16');
