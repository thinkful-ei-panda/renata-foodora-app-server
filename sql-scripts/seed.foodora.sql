BEGIN;

TRUNCATE
foodora_dish,
foodora_restaurants,
foodora_users
RESTART IDENTITY CASCADE;


INSERT INTO foodora_users (first_name, last_name, email, user_address, password, zip, city, phone, state)
VALUES
('Kate', 'Robertson', 'kater@gmail.com', '2304 Covid Ln', 'thepassword', '12123', 'Los Angeles', '222-222-2222', 'CA'),
('Doug', 'Junior', 'djunior@gmail.com', '34 Memory Ln', 'whatever', null, null, null, null),
('Bob', 'Short', 'bobshort@gmail.com', null, 'eatfresh', null, null, null, null),
('James', 'Hetfield', 'jahe@gmail.com', '23 James Ln', 'metallica', '32234', 'LA', '123-123-2222', 'CA'),
('Dave', 'G', 'daveg@gmail.com', '342 Junior Ct', 'foofighters', '34234', 'NY', '234-234-1212', 'NY'),
('Leroy', 'Jenkins', 'lejenkins@gmail.com', null, 'wowrules', '12345', null, null, 'IN')


INSERT INTO foodora_restaurant (username, password, restaurant_name, restaurant_address, city, zip, state, phone, url, email)
VALUES
('Zumbo', 'thebestintown', 'Zumbo Sweets', '123 Whatever Ln', 'Dallas', '12122', null, null, 'www.zumbo.com', 'zumbo@gmail.com'),
('HKGordon', 'hellkitchenftw', 'HK', '674 5th Ave', 'NY', '23533', 'NY', '888-654-8989', 'www.hk.com', 'hkgordon@gmail.com'),
('Los Mocahetes', 'loschicos', 'Los Mocahetes', '3242 Moore Ln', 'Dallas', '23566', '987-563-2334', 'www.losmocha.com', 'losmocha@gmail.com'),
('walsmart', 'weneedmorewalmart', 'Walsmart', '234234 Again Ln', 'NY', '23422', '324-233-2423', 'www.walsmart.com', 'walsmart@gmail.com'),
('picodegalo', 'salsaisawesome', 'Pico de Galo', '43 Nothing Ln', 'Indianapolis', '65687', null, null, 'www.picodegalo.com', 'picodegalo@gmail.com'),



COMMIT;