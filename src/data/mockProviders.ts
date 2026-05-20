export interface Provider {
  id: string;
  name: string;
  service: string;
  area: string;
  distance: number;
  rating: number;
  price: string;
  priceUnit: string;
  available: boolean;
  phone: string;
}

export const MOCK_PROVIDERS: Provider[] = [
  // ELECTRICIAN (10 providers)
  { id: 'e1', name: 'Ahmad Electrician', service: 'Electrician', area: 'Gulberg', distance: 1.2, rating: 4.8, price: '1500', priceUnit: 'visit', available: true, phone: '0300-1111222' },
  { id: 'e2', name: 'Usman Electric Works', service: 'Electrician', area: 'DHA Phase 5', distance: 2.1, rating: 4.6, price: '1800', priceUnit: 'visit', available: true, phone: '0300-2222333' },
  { id: 'e3', name: 'Tariq Wiring Expert', service: 'Electrician', area: 'Johar Town', distance: 1.8, rating: 4.9, price: '2000', priceUnit: 'visit', available: true, phone: '0300-3333444' },
  { id: 'e4', name: 'Hassan Electric', service: 'Electrician', area: 'Model Town', distance: 2.5, rating: 4.5, price: '1600', priceUnit: 'visit', available: true, phone: '0300-4444555' },
  { id: 'e5', name: 'Ali Bijli Wala', service: 'Electrician', area: 'Bahria Town', distance: 3.0, rating: 4.7, price: '1700', priceUnit: 'visit', available: true, phone: '0300-5555666' },
  { id: 'e6', name: 'Imran Electrician', service: 'Electrician', area: 'Gulberg', distance: 1.5, rating: 4.4, price: '1400', priceUnit: 'visit', available: true, phone: '0300-6666777' },
  { id: 'e7', name: 'Kamran Electric', service: 'Electrician', area: 'Iqbal Town', distance: 2.8, rating: 4.6, price: '1900', priceUnit: 'visit', available: true, phone: '0300-7777888' },
  { id: 'e8', name: 'Bilal Wiring', service: 'Electrician', area: 'Wapda Town', distance: 2.2, rating: 4.8, price: '2100', priceUnit: 'visit', available: true, phone: '0300-8888999' },
  { id: 'e9', name: 'Asif Electric Services', service: 'Electrician', area: 'Cavalry Ground', distance: 1.9, rating: 4.3, price: '1500', priceUnit: 'visit', available: true, phone: '0300-9999000' },
  { id: 'e10', name: 'Nawaz Electrician', service: 'Electrician', area: 'Cantt', distance: 3.5, rating: 4.7, price: '2000', priceUnit: 'visit', available: true, phone: '0300-0000111' },

  // PLUMBER (10 providers)
  { id: 'p1', name: 'Akbar Plumber', service: 'Plumber', area: 'Gulberg', distance: 1.4, rating: 4.7, price: '1200', priceUnit: 'visit', available: true, phone: '0311-1111222' },
  { id: 'p2', name: 'Rashid Nal Wala', service: 'Plumber', area: 'DHA Phase 5', distance: 2.3, rating: 4.5, price: '1500', priceUnit: 'visit', available: true, phone: '0311-2222333' },
  { id: 'p3', name: 'Sajid Pipe Expert', service: 'Plumber', area: 'Johar Town', distance: 1.6, rating: 4.8, price: '1800', priceUnit: 'visit', available: true, phone: '0311-3333444' },
  { id: 'p4', name: 'Hamid Plumbing', service: 'Plumber', area: 'Model Town', distance: 2.7, rating: 4.4, price: '1300', priceUnit: 'visit', available: true, phone: '0311-4444555' },
  { id: 'p5', name: 'Zafar Nal Services', service: 'Plumber', area: 'Bahria Town', distance: 3.2, rating: 4.6, price: '1600', priceUnit: 'visit', available: true, phone: '0311-5555666' },
  { id: 'p6', name: 'Nasir Plumber', service: 'Plumber', area: 'Gulberg', distance: 1.7, rating: 4.5, price: '1400', priceUnit: 'visit', available: true, phone: '0311-6666777' },
  { id: 'p7', name: 'Irfan Nal Wala', service: 'Plumber', area: 'Iqbal Town', distance: 2.4, rating: 4.7, price: '1700', priceUnit: 'visit', available: true, phone: '0311-7777888' },
  { id: 'p8', name: 'Shahid Pipe Works', service: 'Plumber', area: 'Wapda Town', distance: 2.0, rating: 4.9, price: '2000', priceUnit: 'visit', available: true, phone: '0311-8888999' },
  { id: 'p9', name: 'Raza Plumbing', service: 'Plumber', area: 'Cavalry Ground', distance: 1.8, rating: 4.3, price: '1200', priceUnit: 'visit', available: true, phone: '0311-9999000' },
  { id: 'p10', name: 'Wasim Nal Expert', service: 'Plumber', area: 'Cantt', distance: 3.8, rating: 4.6, price: '1800', priceUnit: 'visit', available: true, phone: '0311-0000111' },

  // AC TECHNICIAN (10 providers)
  { id: 'a1', name: 'Cool Care AC', service: 'AC Technician', area: 'Gulberg', distance: 1.5, rating: 4.9, price: '2500', priceUnit: 'job', available: true, phone: '0322-1111222' },
  { id: 'a2', name: 'Artic AC Services', service: 'AC Technician', area: 'DHA Phase 5', distance: 2.0, rating: 4.7, price: '3000', priceUnit: 'job', available: true, phone: '0322-2222333' },
  { id: 'a3', name: 'Freeze Fix', service: 'AC Technician', area: 'Johar Town', distance: 1.9, rating: 4.8, price: '2800', priceUnit: 'job', available: true, phone: '0322-3333444' },
  { id: 'a4', name: 'Irfan AC Works', service: 'AC Technician', area: 'Model Town', distance: 2.6, rating: 4.6, price: '2600', priceUnit: 'job', available: true, phone: '0322-4444555' },
  { id: 'a5', name: 'Hassan Cooling', service: 'AC Technician', area: 'Bahria Town', distance: 3.1, rating: 4.5, price: '2700', priceUnit: 'job', available: true, phone: '0322-5555666' },
  { id: 'a6', name: 'Ali AC Expert', service: 'AC Technician', area: 'Gulberg', distance: 1.4, rating: 4.8, price: '2500', priceUnit: 'job', available: true, phone: '0322-6666777' },
  { id: 'a7', name: 'Tahir AC Services', service: 'AC Technician', area: 'Iqbal Town', distance: 2.9, rating: 4.4, price: '2400', priceUnit: 'job', available: true, phone: '0322-7777888' },
  { id: 'a8', name: 'Usman Cool Works', service: 'AC Technician', area: 'Wapda Town', distance: 2.3, rating: 4.7, price: '2900', priceUnit: 'job', available: true, phone: '0322-8888999' },
  { id: 'a9', name: 'Adnan AC Repair', service: 'AC Technician', area: 'Cavalry Ground', distance: 1.7, rating: 4.6, price: '2600', priceUnit: 'job', available: true, phone: '0322-9999000' },
  { id: 'a10', name: 'Faisal AC Wala', service: 'AC Technician', area: 'Cantt', distance: 3.4, rating: 4.8, price: '3000', priceUnit: 'job', available: true, phone: '0322-0000111' },

  // BEAUTICIAN (10 providers)
  { id: 'b1', name: 'Sana Beauty Salon', service: 'Beautician', area: 'Gulberg', distance: 1.3, rating: 4.9, price: '2000', priceUnit: 'service', available: true, phone: '0333-1111222' },
  { id: 'b2', name: 'Nadia Makeup Artist', service: 'Beautician', area: 'DHA Phase 5', distance: 2.2, rating: 4.8, price: '3500', priceUnit: 'service', available: true, phone: '0333-2222333' },
  { id: 'b3', name: 'Hina Beauty Parlor', service: 'Beautician', area: 'Johar Town', distance: 1.7, rating: 4.7, price: '1800', priceUnit: 'service', available: true, phone: '0333-3333444' },
  { id: 'b4', name: 'Ayesha Salon', service: 'Beautician', area: 'Model Town', distance: 2.4, rating: 4.6, price: '2200', priceUnit: 'service', available: true, phone: '0333-4444555' },
  { id: 'b5', name: 'Zara Beauty Studio', service: 'Beautician', area: 'Bahria Town', distance: 3.0, rating: 4.8, price: '2500', priceUnit: 'service', available: true, phone: '0333-5555666' },
  { id: 'b6', name: 'Mehwish Makeup', service: 'Beautician', area: 'Gulberg', distance: 1.6, rating: 4.5, price: '2000', priceUnit: 'service', available: true, phone: '0333-6666777' },
  { id: 'b7', name: 'Farah Beauty', service: 'Beautician', area: 'Iqbal Town', distance: 2.7, rating: 4.7, price: '1900', priceUnit: 'service', available: true, phone: '0333-7777888' },
  { id: 'b8', name: 'Amna Salon Services', service: 'Beautician', area: 'Wapda Town', distance: 2.1, rating: 4.9, price: '2800', priceUnit: 'service', available: true, phone: '0333-8888999' },
  { id: 'b9', name: 'Sara Beauty Expert', service: 'Beautician', area: 'Cavalry Ground', distance: 1.8, rating: 4.4, price: '1700', priceUnit: 'service', available: true, phone: '0333-9999000' },
  { id: 'b10', name: 'Rida Makeup Studio', service: 'Beautician', area: 'Cantt', distance: 3.6, rating: 4.6, price: '2300', priceUnit: 'service', available: true, phone: '0333-0000111' },

  // CARPENTER (10 providers)
  { id: 'c1', name: 'Malik Wood Works', service: 'Carpenter', area: 'Gulberg', distance: 1.6, rating: 4.8, price: '3000', priceUnit: 'job', available: true, phone: '0344-1111222' },
  { id: 'c2', name: 'Anwar Furniture', service: 'Carpenter', area: 'DHA Phase 5', distance: 2.4, rating: 4.7, price: '3500', priceUnit: 'job', available: true, phone: '0344-2222333' },
  { id: 'c3', name: 'Tariq Carpenter', service: 'Carpenter', area: 'Johar Town', distance: 1.8, rating: 4.6, price: '2800', priceUnit: 'job', available: true, phone: '0344-3333444' },
  { id: 'c4', name: 'Khalid Wood Expert', service: 'Carpenter', area: 'Model Town', distance: 2.8, rating: 4.5, price: '3200', priceUnit: 'job', available: true, phone: '0344-4444555' },
  { id: 'c5', name: 'Nadeem Furniture Works', service: 'Carpenter', area: 'Bahria Town', distance: 3.3, rating: 4.7, price: '3800', priceUnit: 'job', available: true, phone: '0344-5555666' },
  { id: 'c6', name: 'Aslam Carpenter', service: 'Carpenter', area: 'Gulberg', distance: 1.5, rating: 4.9, price: '2500', priceUnit: 'job', available: true, phone: '0344-6666777' },
  { id: 'c7', name: 'Javed Wood Works', service: 'Carpenter', area: 'Iqbal Town', distance: 2.5, rating: 4.6, price: '3000', priceUnit: 'job', available: true, phone: '0344-7777888' },
  { id: 'c8', name: 'Saleem Furniture', service: 'Carpenter', area: 'Wapda Town', distance: 2.0, rating: 4.8, price: '3300', priceUnit: 'job', available: true, phone: '0344-8888999' },
  { id: 'c9', name: 'Pervaiz Carpenter', service: 'Carpenter', area: 'Cavalry Ground', distance: 1.9, rating: 4.4, price: '2700', priceUnit: 'job', available: true, phone: '0344-9999000' },
  { id: 'c10', name: 'Ghulam Wood Expert', service: 'Carpenter', area: 'Cantt', distance: 3.7, rating: 4.5, price: '3500', priceUnit: 'job', available: true, phone: '0344-0000111' }
];
