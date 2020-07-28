CREATE TABLE foodora_dish (
    id SERIAL PRIMARY KEY,
    dish_name TEXT NOT NULL,
    name TEXT
        REFERENCES foodora_restaurant(restaurant_name) ON DELETE CASCADE NOT NULL,
    restaurant_id INTEGER
        REFERENCES foodora_restaurant(id) ON DELETE CASCADE NOT NULL,
    price INTEGER NOT NULL
);

ALTER TABLE foodora_dish_has_tag
    ADD COLLUMN
    dish_id INTEGER REFERENCES foodora_dish(id)
    ON DELETE SET NULL;