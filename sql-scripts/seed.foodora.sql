BEGIN;

TRUNCATE
dish_has_tag,
tag,
dish,
restaurant
RESTART IDENTITY CASCADE;

INSERT INTO restaurant (username, password, name, phone)
VALUES
('zumbo', 'thebestintown', 'Zumbo Eatery', '222-222-2222'),
('hkgordon', 'hellkitchenftw', 'HK', '317-233-1122'),
('losmocahetes', 'loschicos', 'Los Mocahetes', '333-333-3333'),
('walsmart', 'weneedmorewalmart', 'Walsmart', '206-123-4567'),
('picodegalo', 'salsaisawesome', 'Pico de Galo', '202-123-1234'),
('terra', 'terraisbest', 'Terra', '234-234-2323'),
('oliviaitaly', 'italy22', 'Olivia Italian Eatery', '234-234-2222'),
('Taste of Italy', 'tasteitaly11', 'Taste of Italy', '233-345-4566'),
('jackgrill', 'jackgrill123', 'Jack & Grill', '345-356-2222'),
('asianbistro', 'thebistro202', 'Asian Bistro', '203-567-2342');

INSERT INTO dish (name, price, restaurant_id)
VALUES
('Ceasar Salad', 12, 3),
('Bunless Burger', 9, 5),
('Croissant', 5, 9),
('Italian Pasta', 21, 1),
('Salsa and quejo', 15, 6),
('Pollo loco', 35, 2),
('Omelete with SourCream', 58, 7),
('Mini Napoleons with Caviar sauce', 100, 8),
('Scallops with Potato', 45, 10),
('Salmon Trout Tartare', 75, 4),
('Crispy Potato Galette with Dill Cream', 80, 1),
('Roasted Fingerling Potato and Pressed Caviar Canapes', 95, 9),
('Cauliflower Fritters', 29, 3),
('Sorrel Mousse with Lemon Cream', 54, 6),
('Celery Root Remoulade with Scallops and Caviar', 97, 5),
('Deviled Eggs', 39, 7),
('Potato Wedgers', 19, 8),
('Bruschetta', 7, 2),
('Calliflower Fritters', 16, 3),
('Cobb Salad', 20, 4),
('Grilled Eggplant Salad', 11, 10),
('Slow-Cooker Curried Butternut Squash Soup', 27, 1),
('Escalivada', 31, 2),
('Chipotle-Orange Broccoli & Tofu', 44, 3),
('Fattoush Salad', 50, 4),
('Raw Vegan Zoodles with Romesco', 67, 9); --26


INSERT INTO tag (tag)
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

  INSERT INTO dish_has_tag (dish_id, tag_id)
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
  (2, 4),
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
  (3, 9),
  (4, 4),
  (4, 5),
  (4, 6),
  (4, 7),
  (4, 8),
  (4, 9),
  (4, 10),
  (4, 11),
  (4, 12),
  (4, 14),
  (5, 17),
  (5, 16),
  (5, 15),
  (5, 14),
  (5, 13),
  (5, 12),
  (5, 11),
  (5, 10),
  (5, 9),
  (5, 8),
  (6, 1),
  (6, 2),
  (6, 3),
  (6, 4),
  (6, 5),
  (6, 6),
  (6, 7),
  (6, 8),
  (6, 9),
  (6, 10),
  (7, 5),
  (7, 6),
  (7, 7),
  (7, 8),
  (7, 9),
  (7, 10),
  (7, 12),
  (7, 11),
  (7, 13),
  (7, 14),
  (7, 15),
  (8, 10),
  (8, 11),
  (8, 12),
  (8, 13),
  (8, 14),
  (8, 15),
  (8, 2),
  (8, 3),
  (8, 4),
  (8, 5),
  (8, 6),
  (9, 1),
  (9, 2),
  (9, 3),
  (9, 4),
  (9, 5),
  (9, 6),
  (9, 7),
  (9, 8),
  (9, 9),
  (9, 10),
  (10, 17),
  (10, 16),
  (10, 15),
  (10, 14),
  (10, 13),
  (10, 12),
  (10, 11),
  (10, 10),
  (10, 5),
  (10, 6),
  (11, 5),
  (11, 6),
  (11, 1),
  (11, 2),
  (11, 3),
  (11, 4),
  (11, 10),
  (11, 11),
  (11, 12),
  (11, 13),
  (11, 14),
  (12, 2),
  (12, 1),
  (12, 4),
  (12, 5),
  (12, 15),
  (12, 16),
  (12, 17),
  (12, 8),
  (12, 9),
  (12, 3),
  (13, 3),
  (13, 4),
  (13, 5),
  (13, 6),
  (13, 7),
  (13, 9),
  (13, 1),
  (13, 10),
  (13, 11),
  (13, 12),
  (14, 7),
  (14, 8),
  (14, 11),
  (14, 12),
  (14, 13),
  (14, 15),
  (14, 16),
  (14, 17),
  (14, 1),
  (14, 2),
  (14, 3),
  (15, 16),
  (15, 1),
  (15, 14),
  (15, 11),
  (15, 12),
  (15, 2),
  (15, 3),
  (15, 4),
  (15, 5),
  (15, 6),
  (15, 7),
  (16, 9),
  (16, 8),
  (16, 7),
  (16, 6),
  (16, 4),
  (16, 5),
  (16, 3),
  (16, 2),
  (16, 11),
  (16, 15),
  (16, 17),
  (17, 1),
  (17, 2),
  (17, 3),
  (17, 4),
  (17, 5),
  (17, 17),
  (17, 16),
  (17, 15),
  (17, 14),
  (17, 13),
  (17, 12),
  (18, 1),
  (18, 2),
  (18, 3),
  (18, 4),
  (18, 5),
  (18, 6),
  (18, 7),
  (18, 8),
  (18, 16),
  (18, 15),
  (18, 13),
  (19, 7),
  (19, 8),
  (19, 9),
  (19, 10),
  (19, 11),
  (19, 12),
  (19, 13),
  (19, 14),
  (19, 15),
  (19, 16),
  (19, 17),
  (20, 1),
  (20, 2),
  (20, 3),
  (20, 4),
  (20, 5),
  (20, 6),
  (20, 7),
  (20, 8),
  (20, 9),
  (20, 10),
  (20, 11),
  (21, 17),
  (21, 16),
  (21, 15),
  (21, 14),
  (21, 13),
  (21, 12),
  (21, 11),
  (21, 10),
  (21, 9),
  (21, 8),
  (22, 9),
  (22, 10),
  (22, 11),
  (22, 12),
  (22, 14),
  (22, 15),
  (22, 16),
  (22, 17),
  (22, 1),
  (22, 2),
  (23, 2),
  (23, 3),
  (23, 4),
  (23, 5),
  (23, 6),
  (23, 7),
  (23, 8),
  (23, 9),
  (23, 10),
  (23, 12),
  (23, 14),
  (24, 1),
  (24, 2),
  (24, 3),
  (24, 4),
  (24, 5),
  (24, 6),
  (24, 7),
  (24, 8),
  (24, 9),
  (24, 16),
  (24, 17),
  (25, 9),
  (25, 10),
  (25, 11),
  (25, 12),
  (25, 14),
  (25, 13),
  (25, 15),
  (25, 16),
  (25, 17),
  (25, 2),
  (25, 5),
  (26, 1),
  (26, 2),
  (26, 3),
  (26, 4),
  (26, 5),
  (26, 6),
  (26, 7),
  (26, 8),
  (26, 9),
  (26, 11),
  (26, 15);

COMMIT;