TRUNCATE TABLE hotels, reviews RESTART IDENTITY CASCADE;

INSERT INTO hotels (title, description, image_path, latitude, longitude, price, rating, review_count, area, rooms_available) VALUES
('Green Leaf Residency', 'Situated in the heart of upscale RS Puram, this boutique hotel features well-appointed executive rooms and complimentary breakfast. Guests enjoy serene garden seating and modern business facilities. The property is just 1.5 km away from Brookefields Mall.', 'uploads/seed/hotel1.jpeg', 11.008500, 76.948000, 3200.00, 4.5, 4, 'RS Puram', 8),

('Race Course Retreat', 'Nestled along the tree-lined promenades of Race Course, this premium stay offers spacious luxury suites, a fitness studio, and multi-cuisine fine dining. It provides a peaceful ambiance with scenic walking paths right outside. Coimbatore Railway Junction is only 2 km away.', 'uploads/seed/hotel2.jpeg', 11.001200, 76.974500, 5800.00, 4.8, 4, 'Race Course', 4),

('Marutham Grand Stay', 'Located in bustling Gandhipuram, this contemporary hotel offers 24-hour room service, high-speed Wi-Fi, and quick access to major commercial hubs. A pure vegetarian restaurant serves authentic South Indian delicacies on site. The hotel is within walking distance of the central bus terminal and 2.5 km from the railway station.', 'uploads/seed/hotel3.jpeg', 11.018200, 76.965400, 2800.00, 4.0, 3, 'Gandhipuram', 12),

('Peelamedu Airport Stay', 'Positioned strategically in Peelamedu, this modern business hotel features soundproof rooms, banquet facilities, and round-the-clock airport transfers. It is an ideal stop for corporate travelers and visiting families alike. Coimbatore International Airport is just 3 km from the entrance.', 'uploads/seed/hotel4.jpeg', 11.031500, 77.025600, 4200.00, 4.5, 4, 'Peelamedu', 6),

('Saibaba Heights Inn', 'A comfortable family hotel situated in peaceful Saibaba Colony, offering clean air-conditioned rooms, ample car parking, and travel desk assistance. Guests can unwind on the rooftop terrace with pleasant city views. The landmark Ganga Hospital and NSR Road shopping street are less than 1 km away.', 'uploads/seed/hotel5.jpeg', 11.026700, 76.943100, 2400.00, 3.7, 3, 'Saibaba Colony', 0),

('Avinashi Gateway Hotel', 'A grand luxury property located on prominent Avinashi Road, boasting an outdoor swimming pool, luxury spa, and extensive conference halls. The hotel offers gourmet international cuisine and personalized concierge care. Fun Republic Mall is situated only 800 meters down the boulevard.', 'uploads/seed/hotel6.jpeg', 11.038900, 77.042300, 7500.00, 4.8, 4, 'Avinashi Road', 15),

('Singanallur Lake View Stay', 'Overlooking the scenic Singanallur water body, this tranquil retreat provides eco-friendly cottages, open-air lawns, and bird-watching decks. Enjoy healthy regional meals prepared fresh daily with locally sourced ingredients. Singanallur Bus Stand and the Trichy Road highway are just 1.2 km away.', 'uploads/seed/hotel7.jpeg', 10.998400, 77.021000, 2100.00, 4.0, 3, 'Singanallur', 5),

('Noyyal Breeze Residency', 'Centrally situated near Ukkadam, this affordable hotel features bright, tidy guest rooms, complimentary Wi-Fi, and quick check-in services. The property provides easy transit connections across the city and southern suburbs. Coimbatore Railway Junction is located only 1.8 km to the north.', 'uploads/seed/hotel8.jpeg', 10.987500, 76.958200, 1800.00, 3.7, 3, 'Ukkadam', 9),

('Brookefield View Suites', 'Located on the boundary of RS Puram, these premium serviced apartments offer kitchenettes, dedicated workstations, and daily housekeeping. Ideal for long-term travelers and families looking for home-style comfort. Brookefields Mall and its entertainment multiplex are just 400 meters away.', 'uploads/seed/hotel9.jpeg', 11.011200, 76.956700, 3600.00, 4.5, 4, 'RS Puram', 3),

('Siruvani Comforts', 'A budget-friendly hotel in Gandhipuram equipped with air-conditioned executive rooms, elevator access, and doctor-on-call services. It offers convenience for shoppers visiting nearby textile and jewelry showrooms. The main railway junction is conveniently accessible within a 10-minute drive.', 'uploads/seed/hotel10.jpeg', 11.015400, 76.969800, 2900.00, 3.7, 3, 'Gandhipuram', 7),

('Kongu Heritage Haven', 'A heritage-style boutique hotel in the quiet lanes of Race Course, adorned with traditional architecture, wooden courtyards, and Kerala-style verandahs. Guests can enjoy authentic Kongu cuisine and private Ayurvedic wellness sessions. The property is conveniently situated 3 km from Brookefields Mall.', 'uploads/seed/hotel11.jpeg', 11.004500, 76.979200, 6400.00, 4.8, 4, 'Race Course', 2),

('Kovai Palms Executive', 'A stylish business hotel located near Nava India on Avinashi Road, offering rooftop dining, gym access, and modern multimedia meeting rooms. It sits in close proximity to Coimbatore leading IT parks and college campuses. Fun Republic Mall and medical centers are within a 5-minute radius.', 'uploads/seed/hotel12.jpeg', 11.024100, 77.001800, 4600.00, 4.3, 4, 'Avinashi Road', 10);

INSERT INTO reviews (hotel_id, name, rating, comment) VALUES
-- Hotel 1 (avg 4.5, count 4)
(1, 'Ananya Iyer', 5, 'Loved the calm environment in RS Puram. Breakfast was delicious!'),
(1, 'Karthik Raja', 4, 'Very comfortable stay, close to Brookefields. Friendly staff.'),
(1, 'Suresh Kumar', 4, 'Neat executive rooms and good Wi-Fi speed. Would visit again.'),
(1, 'Deepa V', 5, 'Serene garden seating and excellent hospitality. Highly recommended.'),

-- Hotel 2 (avg 4.8, count 4)
(2, 'Praveen Chandran', 5, 'Exceptional luxury suites right by Race Course. Morning walks were amazing.'),
(2, 'Meera Krishnan', 5, 'The food at the multi-cuisine restaurant was outstanding.'),
(2, 'Ganesh Moorthy', 4, 'Very close to Coimbatore Junction. Premium amenities and peaceful vibe.'),
(2, 'Swathi R', 5, 'Top-notch hospitality and pristine rooms. One of the best stays in Coimbatore.'),

-- Hotel 3 (avg 4.0, count 3)
(3, 'Ramesh Babu', 4, 'Best location in Gandhipuram. Authentic South Indian vegetarian food.'),
(3, 'Pooja Shankar', 4, 'Walking distance from the bus stand. Clean rooms and 24hr room service.'),
(3, 'Venkatesh N', 4, 'Prompt service and comfortable beds. Great value for commercial travel.'),

-- Hotel 4 (avg 4.5, count 4)
(4, 'Arun Prakash', 5, 'Airport transfer was seamless and on time. Soundproof rooms worked great.'),
(4, 'Lakshmi Narayanan', 4, 'Perfect for catching an early flight from Peelamedu airport.'),
(4, 'Vijay Anand', 4, 'Spacious business rooms and great banquet facilities.'),
(4, 'Divya Mohan', 5, 'Courteous staff and quick check-in process. Very satisfied!'),

-- Hotel 5 (avg 3.7, count 3)
(5, 'Manoj Kumar', 4, 'Peaceful locality in Saibaba Colony. Clean air conditioning and ample parking.'),
(5, 'Revathi S', 4, 'Rooftop terrace has great city views. Very family-friendly environment.'),
(5, 'Bala Subramaniam', 3, 'Decent budget stay near Ganga Hospital. Helpful travel desk.'),

-- Hotel 6 (avg 4.8, count 4)
(6, 'Siddharth Rao', 5, 'Grand property on Avinashi Road! The swimming pool and spa are world-class.'),
(6, 'Nithya Menon', 5, 'Celebrated an anniversary here. The gourmet food and ambiance were superb.'),
(6, 'Kishore V', 4, 'Large conference halls and well-trained concierge team.'),
(6, 'Priya Raghavan', 5, 'Walking distance to Fun Republic Mall. Superb luxury experience.'),

-- Hotel 7 (avg 4.0, count 3)
(7, 'Gokul Nath', 4, 'Scenic lake view in Singanallur. Fresh organic meals served with warmth.'),
(7, 'Aishwarya G', 4, 'Loved the eco-cottages and peaceful bird-watching deck.'),
(7, 'Madhavan T', 4, 'Quiet escape from the city rush while being close to Trichy Road.'),

-- Hotel 8 (avg 3.7, count 3)
(8, 'Sanjay Verma', 4, 'Economical stay near Ukkadam bus stand. Quick transit across Coimbatore.'),
(8, 'Hemalatha B', 3, 'Basic clean rooms, good Wi-Fi, and courteous front desk staff.'),
(8, 'Dinesh S', 4, 'Decent budget choice near railway station with good transport access.'),

-- Hotel 9 (avg 4.5, count 4)
(9, 'Kavitha Selvam', 5, 'Spacious serviced apartments right next to Brookefields Mall!'),
(9, 'Rajesh Kannan', 4, 'Equipped kitchenette and comfortable workstation. Ideal for long stays.'),
(9, 'Harish Patel', 5, 'Felt like a home away from home. Excellent housekeeping service.'),
(9, 'Sneha Murthy', 4, 'Centrally located in RS Puram with secure parking.'),

-- Hotel 10 (avg 3.7, count 3)
(10, 'Saravanan M', 4, 'Great spot for shopping around Gandhipuram cloth markets.'),
(10, 'Keerthana D', 3, 'Modest amenities but very clean rooms and attentive staff.'),
(10, 'Mohan Raj', 4, 'Value for money in central Coimbatore. Doctor on call was reassuring.'),

-- Hotel 11 (avg 4.8, count 4)
(11, 'Aravind Swaminathan', 5, 'Authentic Kerala-style architecture and traditional Kongu culinary spread.'),
(11, 'Vidya Ramasamy', 5, 'The wooden courtyard and Ayurvedic massage was truly rejuvenating.'),
(11, 'Sundar Raman', 4, 'Quiet serene heritage hotel tucked inside Race Course.'),
(11, 'Gayathri K', 5, 'A cultural gem in Coimbatore. Beautiful woodwork and warm service.'),

-- Hotel 12 (avg 4.3, count 4)
(12, 'Vigneshwaran P', 4, 'Close to IT parks on Avinashi Road. Fast Wi-Fi and good gym.'),
(12, 'Preethi S', 4, 'Rooftop dining has pleasant evening breeze and tasty appetizers.'),
(12, 'Naveen Prasad', 4, 'Comfortable business stay with modern conference facilities.'),
(12, 'Shalini K', 5, 'Polite staff, great breakfast spread, and very neat executive rooms.');
