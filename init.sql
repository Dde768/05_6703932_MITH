-- Create DB (if not exists)
CREATE DATABASE IF NOT EXISTS MITH_Final_Project;
USE MITH_Final_Project;

-- Start fresh
DROP TABLE IF EXISTS product;

CREATE TABLE product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(191) NOT NULL,        -- real MITH perfume name
  collection VARCHAR(191) NOT NULL,  -- e.g. Signature / One Fine Day
  scent_family VARCHAR(100) NOT NULL,
  size_ml INT NOT NULL,
  price_thb DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(255)             -- bottle image URL (you can fill later)
);

INSERT INTO product
  (name, collection, scent_family, size_ml, price_thb, description, image_url)
VALUES

-- 4
('Heritage Oud', 'Heritage', 'Woody Oud', 50, 4500.00,
 'Elegant oud and woods with subtle sweetness, made for evening wear.',
 ''),

-- 5
('One Fine Day : Thai Tea', 'One Fine Day', 'Gourmand Tea', 30, 2200.00,
 'Sweet Thai tea accord with milk, vanilla and soft woods.',
 ''),

-- 6
('One Fine Day : Mango Sticky Rice', 'One Fine Day', 'Gourmand Fruity', 30, 2200.00,
 'Playful mango, coconut and rice note that smells like Thai dessert.',
 ''),

-- 7
('Pistachio & Vetiver', 'Signature', 'Gourmand Woody', 50, 3600.00,
 'Creamy nutty tone over green vetiver and soft woods, unisex.',
 ''),

-- 8
('Blue Wood Elixir', 'Signature', 'Woody Aromatic', 50, 3600.00,
 'Cool woody fragrance with fresh aromatic facets and a smooth base.',
 ''),

-- 9
('NUDE', 'Signature', 'Musky Skin Scent', 50, 3600.00,
 'Clean skin-like musk with soft floral accents, very easy to wear.',
 '');
