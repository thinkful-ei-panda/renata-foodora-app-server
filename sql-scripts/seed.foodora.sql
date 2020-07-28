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
('Leroy', 'Jenkins', 'lejenkins@gmail.com', null, 'wowrules', '12345', null, null, 'IN')

INSERT INTO foodora_restaurant (username, password, restaurant_name, restaurant_address, city, zip, state, phone, url, email)
VALUES
('zumbo', 'thebestintown', 'Zumbo Sweets', '123 Whatever Ln', 'Dallas', '12122', null, null, 'www.zumbo.com', 'zumbo@gmail.com'),
('hkGordon', 'hellkitchenftw', 'HK', '674 5th Ave', 'NY', '23533', 'NY', '888-654-8989', 'www.hk.com', 'hkgordon@gmail.com'),
('Los Mocahetes', 'loschicos', 'Los Mocahetes', '3242 Moore Ln', 'Dallas', '23566', '987-563-2334', 'www.losmocha.com', 'losmocha@gmail.com'),
('walsmart', 'weneedmorewalmart', 'Walsmart', '234234 Again Ln', 'NY', '23422', '324-233-2423', 'www.walsmart.com', 'walsmart@gmail.com'),
('picodegalo', 'salsaisawesome', 'Pico de Galo', '43 Nothing Ln', 'Indianapolis', '65687', null, null, 'www.picodegalo.com', 'picodegalo@gmail.com'),


INSERT INTO foodora_dish (dish_name, price)
VALUES
('Ceasar Salad', '12'),
('Bunless Burger', '9'),
('Croissant', '5'),
('Italian Pasta', '21'),
('Salsa and quejo', '15'),
('Pollo loco', '35'),
('Omelete with SourCream', '58'),
('Mini Napoleons (caviar)', '100'),
('Scallops with Potato', '45'),
('Salmon Trout Tartare', '75'),
('Crispy Potato Galette with Dill Cream', '80'),
('Roasted Fingerling Potato and Pressed Caviar Canapes', '95'),
('Cauliflower Fritters', '29'),
('Sorrel Mousse with Lemon Cream', '54'),
('Celery Root Remoulade with Scallops and Caviar', '97'),
('Deviled Eggs', '39'),
('Potato Wedgers', '19'),
('Bruschetta', '7'),
('Calliflower Fritters', '16'),
('Cobb Salad', '20'),
('Grilled Eggplant Salad', '11'),
('Slow-Cooker Curried Butternut Squash Soup', '27'),
('Escalivada', '31'),
('Chipotle-Orange Broccoli & Tofu', '44'),
('Fattoush Salad', '50'),
('Raw Vegan Zoodles with Romesco', '67')


INSERT INTO foodora_tag (name)
VALUES
  ('Gluten Free'),
  ('Peanut Allergy'),
  ('Keto'),
  ('Pescetarians'),
  ('Paleo'),
  ('Low Calorie'),
  ('Low Salt'),
  ('Low Carb'),
  ('Low Sugar'),
  ('Shell Fish Allergy'),
  ('Sugar Free'),
  ('Salt Free'),
  ('Lactose Free'),
  ('Soy Intolerance'),
  ('Fish Allergy'),
  ('Vegetarian'),
  ('Vegan')

COMMIT;