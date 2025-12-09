CREATE DATABASE IF NOT EXISTS mith_final_project;
USE mith_final_project;

DROP TABLE IF EXISTS product;

CREATE TABLE product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(191) NOT NULL,        -- real MITH perfume name
  collection VARCHAR(191) NOT NULL,  -- e.g. Signature / One Fine Day
  scent_family VARCHAR(100) NOT NULL,
  size_ml INT NOT NULL,
  price_thb DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(255)             -- bottle image URL
);

INSERT INTO product
  (name, collection, scent_family, size_ml, price_thb, description, image_url)
VALUES

('Heritage Oud', 'Heritage', 'Woody Oud', 50, 4500.00,
 'Elegant oud and woods with subtle sweetness, made for evening wear.',
 'https://mithbangkok.com/wp-content/uploads/2025/08/Heritage-Oud-2-768x960.webp'),

('One Fine Day : Thai Tea', 'One Fine Day', 'Gourmand Tea', 30, 2200.00,
 'Sweet Thai tea accord with milk, vanilla and soft woods.',
 'https://mithbangkok.com/wp-content/uploads/2025/09/ofd-thai-tea-2-768x768.webp'),

('One Fine Day : Mango Sticky Rice', 'One Fine Day', 'Gourmand Fruity', 30, 2200.00,
 'Playful mango, coconut and rice note that smells like Thai dessert.',
 'https://mithbangkok.com/wp-content/uploads/2025/09/mango-sticky-rice-2-768x768.webp'),

('Pistachio & Vetiver', 'Signature', 'Gourmand Woody', 50, 3600.00,
 'Creamy nutty tone over green vetiver and soft woods, unisex.',
 'https://mithbangkok.com/wp-content/uploads/2025/06/pitachio-velvet-768x768.webp'),

('Blue Wood Elixir', 'Signature', 'Woody Aromatic', 50, 3600.00,
 'Cool woody fragrance with fresh aromatic facets and a smooth base.',
 'https://mithbangkok.com/wp-content/uploads/2025/05/bluewood-elixir-768x768.webp'),

('NUDE', 'Signature', 'Musky Skin Scent', 50, 3600.00,
 'Clean skin-like musk with soft floral accents, very easy to wear.',
 'https://mithbangkok.com/wp-content/uploads/2025/04/nude-5-768x768.webp'),

('Golden Sand', 'Signature', 'Oriental Gourmand', 50, 3900.00,
 'Soft rice, creamy sweetness and warm woods for a cozy everyday scent.',
 'https://mithbangkok.com/wp-content/uploads/2023/11/Golden-Sand.jpg'),

('Golden Hour', 'Anniversary', 'Amber Floral', 50, 4200.00,
 'Warm glowing perfume with sweet floral notes, inspired by sunset light.',
 'https://mithbangkok.com/wp-content/uploads/2025/10/golden-hour-03-300x300.webp'),

('Ruddy Sparkle Exclusive', 'Sparkle Series', 'Fruity Floral', 50, 3600.00,
 'Juicy red fruits and bright flowers with a smooth musky base.',
 'https://mithbangkok.com/wp-content/uploads/2025/08/ruddy-sparkle-exclusive-1-300x300.webp');