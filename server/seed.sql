TRUNCATE TABLE hotels RESTART IDENTITY CASCADE;

INSERT INTO hotels (title, description, image_path, latitude, longitude, price, rating, review_count) VALUES
('Green Leaf Residency', 'Situated in the heart of upscale RS Puram, this boutique hotel features well-appointed executive rooms and complimentary breakfast. Guests enjoy serene garden seating and modern business facilities. The property is just 1.5 km away from Brookefields Mall.', 'uploads/seed/hotel1.jpeg', 11.008500, 76.948000, 3200.00, 4.3, 145),

('Race Course Retreat', 'Nestled along the tree-lined promenades of Race Course, this premium stay offers spacious luxury suites, a fitness studio, and multi-cuisine fine dining. It provides a peaceful ambiance with scenic walking paths right outside. Coimbatore Railway Junction is only 2 km away.', 'uploads/seed/hotel2.jpeg', 11.001200, 76.974500, 5800.00, 4.8, 520),

('Marutham Grand Stay', 'Located in bustling Gandhipuram, this contemporary hotel offers 24-hour room service, high-speed Wi-Fi, and quick access to major commercial hubs. A pure vegetarian restaurant serves authentic South Indian delicacies on site. The hotel is within walking distance of the central bus terminal and 2.5 km from the railway station.', 'uploads/seed/hotel3.jpeg', 11.018200, 76.965400, 2800.00, 4.1, 230),

('Peelamedu Airport Stay', 'Positioned strategically in Peelamedu, this modern business hotel features soundproof rooms, banquet facilities, and round-the-clock airport transfers. It is an ideal stop for corporate travelers and visiting families alike. Coimbatore International Airport is just 3 km from the entrance.', 'uploads/seed/hotel4.jpeg', 11.031500, 77.025600, 4200.00, 4.4, 310),

('Saibaba Heights Inn', 'A comfortable family hotel situated in peaceful Saibaba Colony, offering clean air-conditioned rooms, ample car parking, and travel desk assistance. Guests can unwind on the rooftop terrace with pleasant city views. The landmark Ganga Hospital and NSR Road shopping street are less than 1 km away.', 'uploads/seed/hotel5.jpeg', 11.026700, 76.943100, 2400.00, 3.8, 85),

('Avinashi Gateway Hotel', 'A grand luxury property located on prominent Avinashi Road, boasting an outdoor swimming pool, luxury spa, and extensive conference halls. The hotel offers gourmet international cuisine and personalized concierge care. Fun Republic Mall is situated only 800 meters down the boulevard.', 'uploads/seed/hotel6.jpeg', 11.038900, 77.042300, 7500.00, 4.7, 460),

('Singanallur Lake View Stay', 'Overlooking the scenic Singanallur water body, this tranquil retreat provides eco-friendly cottages, open-air lawns, and bird-watching decks. Enjoy healthy regional meals prepared fresh daily with locally sourced ingredients. Singanallur Bus Stand and the Trichy Road highway are just 1.2 km away.', 'uploads/seed/hotel7.jpeg', 10.998400, 77.021000, 2100.00, 3.9, 64),

('Noyyal Breeze Residency', 'Centrally situated near Ukkadam, this affordable hotel features bright, tidy guest rooms, complimentary Wi-Fi, and quick check-in services. The property provides easy transit connections across the city and southern suburbs. Coimbatore Railway Junction is located only 1.8 km to the north.', 'uploads/seed/hotel8.jpeg', 10.987500, 76.958200, 1800.00, 3.6, 42),

('Brookefield View Suites', 'Located on the boundary of RS Puram, these premium serviced apartments offer kitchenettes, dedicated workstations, and daily housekeeping. Ideal for long-term travelers and families looking for home-style comfort. Brookefields Mall and its entertainment multiplex are just 400 meters away.', 'uploads/seed/hotel9.jpeg', 11.011200, 76.956700, 3600.00, 4.5, 195),

('Siruvani Comforts', 'A budget-friendly hotel in Gandhipuram equipped with air-conditioned executive rooms, elevator access, and doctor-on-call services. It offers convenience for shoppers visiting nearby textile and jewelry showrooms. The main railway junction is conveniently accessible within a 10-minute drive.', 'uploads/seed/hotel10.jpeg', 11.015400, 76.969800, 2900.00, 3.7, 78),

('Kongu Heritage Haven', 'A heritage-style boutique hotel in the quiet lanes of Race Course, adorned with traditional architecture, wooden courtyards, and Kerala-style verandahs. Guests can enjoy authentic Kongu cuisine and private Ayurvedic wellness sessions. The property is conveniently situated 3 km from Brookefields Mall.', 'uploads/seed/hotel11.jpeg', 11.004500, 76.979200, 6400.00, 4.6, 280),

('Kovai Palms Executive', 'A stylish business hotel located near Nava India on Avinashi Road, offering rooftop dining, gym access, and modern multimedia meeting rooms. It sits in close proximity to Coimbatore leading IT parks and college campuses. Fun Republic Mall and medical centers are within a 5-minute radius.', 'uploads/seed/hotel12.jpeg', 11.024100, 77.001800, 4600.00, 4.2, 160);
