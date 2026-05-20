import { Provider } from '../data/mockProviders';

export interface Booking {
  id: string;
  provider: Provider;
  serviceType: string;
  date: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  cost: string;
  requestText: string;
  rating?: number;
  feedbackTags?: string[];
  comment?: string;
}

// Initial mock data
let bookings: Booking[] = [
  {
    id: 'KGR-12345',
    provider: { name: 'Ahmad Electrician', service: 'Electrician', rating: 4.8, price: '1500', area: 'Gulberg' } as any,
    serviceType: 'Electrician',
    date: 'Yesterday, 8:00 PM',
    status: 'Completed',
    cost: '1500',
    requestText: 'bijli wala chahiye kal raat 8 baje',
    rating: 5,
    feedbackTags: ['Professional', 'On Time']
  },
  {
    id: 'KGR-67890',
    provider: { name: 'Akbar Plumber', service: 'Plumber', rating: 4.7, price: '1200', area: 'Gulberg' } as any,
    serviceType: 'Plumber',
    date: '2 days ago, 10:00 AM',
    status: 'Completed',
    cost: '1200',
    requestText: 'plumber in Gulberg',
    rating: 4,
    feedbackTags: ['Good Price']
  },
  {
    id: 'KGR-11111',
    provider: { name: 'Cool Care AC', service: 'AC Technician', rating: 4.9, price: '2500', area: 'Gulberg' } as any,
    serviceType: 'AC Technician',
    date: '3 days ago, 2:00 PM',
    status: 'Cancelled',
    cost: '2500',
    requestText: 'AC technician'
  }
];

export const getBookings = () => [...bookings];

export const addBooking = (booking: Booking) => {
  bookings = [booking, ...bookings];
};

export const updateBookingRating = (id: string, rating: number, tags: string[], comment: string) => {
  const index = bookings.findIndex(b => b.id === id);
  if (index !== -1) {
    bookings[index] = {
      ...bookings[index],
      rating,
      feedbackTags: tags,
      comment,
      status: 'Completed' // Mark as completed when rated
    };
  }
};
