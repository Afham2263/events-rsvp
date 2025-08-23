create extension if not exists pgcrypto;

do $$ begin
    if not exists (select 1 from pg_type where typname = 'rsvp_status') then
        create type rsvp_status as enum ('Yes','No','Maybe');
    end if;
end $$;

drop table if exists rsvps cascade;
drop table if exists events cascade;
drop table if exists users cascade;

create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date date not null,
  city text not null,
  created_by uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table rsvps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  status rsvp_status not null,
  created_at timestamptz not null default now(),
  unique (user_id, event_id)
);

create index idx_rsvps_event on rsvps(event_id);
create index idx_rsvps_user on rsvps(user_id);

insert into users (name, email)
values
  ('Aisha Khan','aisha@example.com'),
  ('Ravi Patel','ravi@example.com'),
  ('Neha Gupta','neha@example.com'),
  ('Arjun Mehta','arjun@example.com'),
  ('Sara Ali','sara@example.com'),
  ('Kabir Singh','kabir@example.com'),
  ('Meera Nair','meera@example.com'),
  ('Vikram Desai','vikram@example.com'),
  ('Priya Sharma','priya@example.com'),
  ('Imran Qureshi','imran@example.com');

insert into events (title, description, date, city, created_by)
values
  ('Tech Meetup Delhi','Monthly JS and TS talks','2025-09-10','Delhi',(select id from users where email='aisha@example.com')),
  ('Data Science Jam','Hands-on ML mini-projects','2025-09-15','Bengaluru',(select id from users where email='ravi@example.com')),
  ('Startup Pitch Night','Early-stage founders pitching','2025-09-20','Hyderabad',(select id from users where email='neha@example.com')),
  ('Open Source Sprint','Contribute to OSS in teams','2025-09-25','Pune',(select id from users where email='arjun@example.com')),
  ('Product Design Huddle','UX reviews and Figma tips','2025-10-01','Mumbai',(select id from users where email='sara@example.com'));

insert into rsvps (user_id, event_id, status)
select u.id, e.id, s.status::rsvp_status
from (
  values
    ('aisha@example.com','Tech Meetup Delhi','Yes'),
    ('ravi@example.com','Tech Meetup Delhi','Maybe'),
    ('neha@example.com','Tech Meetup Delhi','No'),
    ('arjun@example.com','Tech Meetup Delhi','Yes'),
    ('sara@example.com','Data Science Jam','Yes'),
    ('kabir@example.com','Data Science Jam','Maybe'),
    ('meera@example.com','Data Science Jam','Yes'),
    ('vikram@example.com','Data Science Jam','No'),
    ('priya@example.com','Startup Pitch Night','Yes'),
    ('imran@example.com','Startup Pitch Night','Maybe'),
    ('aisha@example.com','Startup Pitch Night','Yes'),
    ('ravi@example.com','Startup Pitch Night','Yes'),
    ('neha@example.com','Open Source Sprint','Maybe'),
    ('arjun@example.com','Open Source Sprint','Yes'),
    ('sara@example.com','Open Source Sprint','Yes'),
    ('kabir@example.com','Product Design Huddle','No'),
    ('meera@example.com','Product Design Huddle','Maybe'),
    ('vikram@example.com','Product Design Huddle','Yes'),
    ('priya@example.com','Product Design Huddle','Yes'),
    ('imran@example.com','Product Design Huddle','Yes')
) as s(email, title, status)
join users u on u.email = s.email
join events e on e.title = s.title;

select u.name, e.title, r.status
from rsvps r
join users u on u.id = r.user_id
join events e on e.id = r.event_id
order by e.date, u.name;
