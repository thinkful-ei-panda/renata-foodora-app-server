BEGIN;

TRUNCATE
foodora_user,
foodora_restaurant,
foodora_dish,
foodora_tag,
foodora_dish_has_tag
RESTART IDENTITY CASCADE;


INSERT INTO foodora_user (first_name, last_name, email, user_address, password, zip, city, phone, state)
VALUES
('Kate', 'Robertson', 'kater@gmail.com', '2304 Covid Ln', 'thepassword', '12123', 'Los Angeles', '222-222-2222', 'CA'),
('Doug', 'Junior', 'djunior@gmail.com', '34 Memory Ln', 'whatever', null, null, null, null),
('Bob', 'Short', 'bobshort@gmail.com', null, 'eatfresh', null, null, null, null),
('James', 'Hetfield', 'jahe@gmail.com', '23 James Ln', 'metallica', '32234', 'LA', '123-123-2222', 'CA'),
('Dave', 'Grohl', 'daveg@gmail.com', '342 Junior Ct', 'foofighters', '34234', 'NY', '234-234-1212', 'NY'),
('Leroy', 'Jenkins', 'lejenkins@gmail.com', null, 'wowrules', '12345', null, null, 'IN');

INSERT INTO foodora_restaurant (username, password, restaurant_name, restaurant_address, city, zip, state, phone, url, email)
VALUES
('zumbo', 'thebestintown', 'Zumbo Sweets', '123 Whatever Ln', 'Dallas', '12122', null, null, 'www.zumbo.com', 'zumbo@gmail.com'),
('hkgordon', 'hellkitchenftw', 'HK', '674 5th Ave', 'NY', '23533', 'NY', '888-654-8989', 'www.hk.com', 'hkgordon@gmail.com'),
('losmocahetes', 'loschicos', 'Los Mocahetes', '3242 Moore Ln', 'Dallas', '23566', 'TX', '987-563-2334', 'www.losmocha.com', 'losmocha@gmail.com'),
('walsmart', 'weneedmorewalmart', 'Walsmart', '234234 Again Ln', 'NY', '23422', 'NY', '324-233-2423', 'www.walsmart.com', 'walsmart@gmail.com'),
('picodegalo', 'salsaisawesome', 'Pico de Galo', '43 Nothing Ln', 'Indianapolis', '65687', null, null, 'www.picodegalo.com', 'picodegalo@gmail.com');


INSERT INTO foodora_dish (dish_name, price, restaurant_id)
VALUES
('Ceasar Salad', 12, 3),
('Bunless Burger', 9, 5),
('Croissant', 5, 3),
('Italian Pasta', 21, 1),
('Salsa and quejo', 15, 3),
('Pollo loco', 35, 2),
('Omelete with SourCream', 58, 2),
('Mini Napoleons with Caviar sauce', 100, 5),
('Scallops with Potato', 45, 4),
('Salmon Trout Tartare', 75, 4),
('Crispy Potato Galette with Dill Cream', 80, 1),
('Roasted Fingerling Potato and Pressed Caviar Canapes', 95, 2),
('Cauliflower Fritters', 29, 3),
('Sorrel Mousse with Lemon Cream', 54, 3),
('Celery Root Remoulade with Scallops and Caviar', 97, 5),
('Deviled Eggs', 39, 5),
('Potato Wedgers', 19, 1),
('Bruschetta', 7, 2),
('Calliflower Fritters', 16, 3),
('Cobb Salad', 20, 4),
('Grilled Eggplant Salad', 11, 5),
('Slow-Cooker Curried Butternut Squash Soup', 27, 1),
('Escalivada', 31, 2),
('Chipotle-Orange Broccoli & Tofu', 44, 3),
('Fattoush Salad', 50, 4),
('Raw Vegan Zoodles with Romesco', 67, 5); --26


INSERT INTO foodora_tag (name)
VALUES
  ('Gluten Free'),  -- 1
  ('Peanut Allergy'), 
  ('Keto'), -- 3
  ('Pescetarians'),
  ('Paleo'), -- 5
  ('Low Calorie'),
  ('Low Salt'), -- 7
  ('Low Carb'),
  ('Low Sugar'), -- 9
  ('Shell Fish Allergy'),
  ('Sugar Free'), --11
  ('Salt Free'),
  ('Lactose Free'), --13
  ('Soy Intolerance'),
  ('Fish Allergy'),--15
  ('Vegetarian'),
  ('Vegan'); --17

  INSERT INTO foodora_dish_has_tag (dish_id, tag_id)
  VALUES
  (1, 1),
  (1, 2),
  (1, 15),
  (1, 13),
  (1, 5),
  (1, 7),
  (1, 8),
  (1, 12),
  (1, 10),
  (1, 11),
  (2, 3),
  (2, 9),
  (2, 5),
  (2, 9),
  (2, 10),
  (2, 12),
  (2, 14),
  (2, 15),
  (2, 17),
  (2, 1),
  (3, 2),
  (3, 3),
  (3, 4),
  (3, 5),
  (3, 6),
  (3, 7),
  (3, 12),
  (3, 15),
  (3, 11),
  (3, 9);

  



COMMIT;