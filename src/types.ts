export interface FoodItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem {
  foodId: string;
  quantity: number;
}

export type OrderStatus = 'Food Processing' | 'Out for Delivery' | 'Delivered';

export interface DeliveryAddress {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  _id: string;
  userId: string;
  items: Array<{
    foodId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  amount: number;
  address: DeliveryAddress;
  status: OrderStatus;
  date: string;
  payment: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  token?: string;
  role?: string;
}
