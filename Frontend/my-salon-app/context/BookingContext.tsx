import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState({ name: 'Pari User', email: 'pari@example.com' });

  const addBooking = (booking) => {
    setBookings([booking, ...bookings]);
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, user, setUser }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);