CREATE DATABASE IF NOT EXISTS MITH_Final_Project;
USE MITH_Final_Project;

CREATE TABLE IF NOT EXISTS product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  collection VARCHAR(255),
  scent_family VARCHAR(255),
  size_ml INT,
  price_thb DECIMAL(10,2),
  description TEXT,
  image_url TEXT
);

INSERT INTO product (name, collection, scent_family, size_ml, price_thb, description, image_url) VALUES
('Heritage Oud', 'Heritage', 'Woody Oud', 50, 4500.00, 'Elegant oud and woods with subtle sweetness, made for evening wear.', 'https://mithbangkok.com/wp-content/uploads/2025/08/heritage-oud.jpg'),
('One Fine Day : Thai Tea', 'One Fine Day', 'Gourmand Tea', 30, 2200.00, 'Sweet Thai tea accord with milk, vanilla and soft woods.', 'https://mithbangkok.com/wp-content/uploads/2025/09/thai-tea.jpg'),
('One Fine Day : Mango Sticky Rice', 'One Fine Day', 'Gourmand Fruity', 30, 2200.00, 'Playful mango, coconut and rice note that smells like Thai dessert.', 'https://mithbangkok.com/wp-content/uploads/2025/09/mango-sticky-rice.jpg'),
('Pistachio & Vetiver', 'Signature', 'Gourmand Woody', 50, 3600.00, 'Creamy nutty tone over green vetiver and soft woods, unisex.', 'https://mithbangkok.com/wp-content/uploads/2025/06/pistachio-vetiver.jpg'),
('Blue Wood Elixir', 'Signature', 'Woody Aromatic', 50, 3600.00, 'Cool woody fragrance with fresh aromatic facets and a smooth base.', 'https://mithbangkok.com/wp-content/uploads/2025/05/blue-wood-elixir.jpg'),
('NUDE', 'Signature', 'Musky Skin Scent', 50, 3600.00, 'Clean skin-like musk with soft floral accents, very easy to wear.', 'https://mithbangkok.com/wp-content/uploads/2025/04/nude.jpg'),
('Golden Sand', 'Signature', 'Oriental Gourmand', 50, 3900.00, 'Soft rice, creamy sweetness and warm woods for a cozy vibe.', 'https://mithbangkok.com/wp-content/uploads/2023/11/golden-sand.jpg'),
('Golden Hour', 'Anniversary', 'Amber Floral', 50, 4200.00, 'Warm glowing perfume with sweet floral notes, inspired by sunset.', 'https://mithbangkok.com/wp-content/uploads/2025/10/golden-hour.jpg'),
('Ruddy Sparkle Exclusive', 'Sparkle Series', 'Fruity Floral', 50, 3600.00, 'Juicy red fruits and bright flowers with a smooth base.', 'https://mithbangkok.com/wp-content/uploads/2025/08/ruddy-sparkle.jpg');
