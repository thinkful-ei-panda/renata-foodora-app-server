CREATE TABLE foodora_user (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    user_address TEXT,
    zip INTEGER,
    city TEXT,
    phone INTEGER,
    state TEXT
);