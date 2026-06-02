CREATE DATABASE IF NOT EXISTS gta_cars
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gta_cars;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  brand VARCHAR(120),
  price DECIMAL(10, 2),
  speed INT,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS car_votes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  car_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_car_votes_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_car_votes_car
    FOREIGN KEY (car_id) REFERENCES cars(id)
    ON DELETE CASCADE,
  UNIQUE KEY unique_user_car_vote (user_id, car_id)
);

INSERT INTO cars (name, brand, price, speed, description, image_url) VALUES
  (
    'Pegassi Zentorno',
    'Pegassi',
    725000.00,
    213,
    'Supercar Santos Car inspiree de Los Santos, rapide et stable.',
    '../frontend/assets/zentorno.jpg'
  ),
  (
    'Grotti Turismo R',
    'Grotti',
    500000.00,
    210,
    'Sportive elegante avec une acceleration nerveuse.',
    '../frontend/assets/turismo-r.jpg'
  ),
  (
    'Karin Sultan RS',
    'Karin',
    795000.00,
    188,
    'Compacte sportive parfaite pour les courses urbaines.',
    '../frontend/assets/sultan-rs.jpg'
  ),
  (
    'Bravado Banshee',
    'Bravado',
    105000.00,
    190,
    'Classique puissante au style Santos Car intemporel.',
    '../frontend/assets/banshee.jpg'
  ),
  (
    'Pfister Comet',
    'Pfister',
    100000.00,
    193,
    'Sportive agile et fiable pour les trajets rapides.',
    '../frontend/assets/comet.jpg'
  );
