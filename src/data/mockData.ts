import villaImg from '@/assets/category-villa.jpg'
import hotelImg from '@/assets/category-hotel.jpg'
import sanatoriumImg from '@/assets/category-sanatorium.jpg'

export type PropertyCategory = 'villa' | 'hotel' | 'sanatorium'

export interface Property {
  id: string
  title: string
  location: string
  price: number
  rating: number
  reviews: number
  image: string
  category: PropertyCategory
  amenities: string[]
  description: string
  agentId: string
}

export interface Booking {
  id: string
  propertyId: string
  propertyTitle: string
  guestName: string
  guestEmail: string
  checkIn: string
  checkOut: string
  guests: number
  total: number
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'agent' | 'admin'
  avatar?: string
  joinedAt: string
  status: 'active' | 'suspended'
}

export const properties: Property[] = [
  {
    id: '1', title: 'Chimgan Mountain Villa', location: 'Chimgan, Uzbekistan',
    price: 120, rating: 4.9, reviews: 47, image: villaImg, category: 'villa',
    amenities: ['wifi', 'pool', 'parking', 'kitchen', 'ac'],
    description: 'Stunning mountain villa with panoramic views of the Chimgan range.',
    agentId: 'a1',
  },
  {
    id: '2', title: 'Registan Boutique Hotel', location: 'Samarkand, Uzbekistan',
    price: 85, rating: 4.8, reviews: 124, image: hotelImg, category: 'hotel',
    amenities: ['wifi', 'parking', 'restaurant', 'spa', 'ac'],
    description: 'Boutique hotel steps from the legendary Registan Square.',
    agentId: 'a1',
  },
  {
    id: '3', title: 'Bukhara Wellness Resort', location: 'Bukhara, Uzbekistan',
    price: 150, rating: 4.7, reviews: 63, image: sanatoriumImg, category: 'sanatorium',
    amenities: ['wifi', 'pool', 'spa', 'restaurant', 'gym'],
    description: 'Full-service wellness resort with traditional healing treatments.',
    agentId: 'a2',
  },
  {
    id: '4', title: 'Aral Sea Eco Villa', location: 'Moynaq, Uzbekistan',
    price: 95, rating: 4.6, reviews: 31, image: villaImg, category: 'villa',
    amenities: ['wifi', 'parking', 'kitchen'],
    description: 'Eco-friendly villa near the historic Aral Sea.',
    agentId: 'a2',
  },
  {
    id: '5', title: 'Tashkent Grand Hotel', location: 'Tashkent, Uzbekistan',
    price: 110, rating: 4.5, reviews: 89, image: hotelImg, category: 'hotel',
    amenities: ['wifi', 'pool', 'parking', 'restaurant', 'gym', 'spa', 'ac'],
    description: 'Luxury hotel in the heart of Tashkent with world-class amenities.',
    agentId: 'a1',
  },
  {
    id: '6', title: 'Fergana Health Sanatorium', location: 'Fergana, Uzbekistan',
    price: 200, rating: 4.9, reviews: 42, image: sanatoriumImg, category: 'sanatorium',
    amenities: ['wifi', 'pool', 'spa', 'restaurant', 'gym', 'parking'],
    description: 'Premium sanatorium offering therapeutic mineral water treatments.',
    agentId: 'a2',
  },
]

export const bookings: Booking[] = [
  { id: 'b1', propertyId: '1', propertyTitle: 'Chimgan Mountain Villa', guestName: 'John Smith', guestEmail: 'john@email.com', checkIn: '2026-04-10', checkOut: '2026-04-15', guests: 2, total: 600, status: 'confirmed', createdAt: '2026-03-20' },
  { id: 'b2', propertyId: '2', propertyTitle: 'Registan Boutique Hotel', guestName: 'Maria Garcia', guestEmail: 'maria@email.com', checkIn: '2026-04-05', checkOut: '2026-04-08', guests: 1, total: 255, status: 'pending', createdAt: '2026-03-22' },
  { id: 'b3', propertyId: '3', propertyTitle: 'Bukhara Wellness Resort', guestName: 'Alex Chen', guestEmail: 'alex@email.com', checkIn: '2026-03-28', checkOut: '2026-04-02', guests: 3, total: 750, status: 'completed', createdAt: '2026-03-15' },
  { id: 'b4', propertyId: '5', propertyTitle: 'Tashkent Grand Hotel', guestName: 'Sara Lee', guestEmail: 'sara@email.com', checkIn: '2026-05-01', checkOut: '2026-05-05', guests: 2, total: 440, status: 'confirmed', createdAt: '2026-03-25' },
  { id: 'b5', propertyId: '1', propertyTitle: 'Chimgan Mountain Villa', guestName: 'Omar Ali', guestEmail: 'omar@email.com', checkIn: '2026-04-20', checkOut: '2026-04-25', guests: 4, total: 600, status: 'cancelled', createdAt: '2026-03-18' },
]

export const users: User[] = [
  { id: 'u1', name: 'John Smith', email: 'john@email.com', role: 'user', joinedAt: '2025-06-15', status: 'active' },
  { id: 'u2', name: 'Maria Garcia', email: 'maria@email.com', role: 'user', joinedAt: '2025-08-20', status: 'active' },
  { id: 'a1', name: 'Rustam Karimov', email: 'rustam@email.com', role: 'agent', joinedAt: '2025-01-10', status: 'active' },
  { id: 'a2', name: 'Nilufar Azimova', email: 'nilufar@email.com', role: 'agent', joinedAt: '2025-03-05', status: 'active' },
  { id: 'u3', name: 'Alex Chen', email: 'alex@email.com', role: 'user', joinedAt: '2025-11-01', status: 'suspended' },
  { id: 'admin1', name: 'Admin ROOMi', email: 'admin@roomi.com', role: 'admin', joinedAt: '2024-12-01', status: 'active' },
]

export const amenityLabels: Record<string, string> = {
  wifi: 'Wi-Fi',
  pool: 'Pool',
  parking: 'Parking',
  kitchen: 'Kitchen',
  ac: 'Air Conditioning',
  restaurant: 'Restaurant',
  spa: 'Spa',
  gym: 'Gym',
}
