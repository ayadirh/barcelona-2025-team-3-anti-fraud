import React, { useEffect, useState, createContext, useContext } from 'react';
interface Ticket {
  ticketId: string;
  ticketName: string;
  venue: string;
  eventDate: string;
  price: number;
  description: string;
  rules: Record<string, any>;
  status: 'Available' | 'Sold' | 'Available for Resale' | 'Cancelled';
  quantity: number;
  supplierId: string;
  supplierName: string;
}
interface Supplier {
  id: string;
  name: string;
  email: string;
  company: string;
}
interface Distributor {
  id: string;
  name: string;
  email: string;
  company: string;
}
interface AppContextType {
  suppliers: Supplier[];
  distributors: Distributor[];
  tickets: Ticket[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => string;
  addDistributor: (distributor: Omit<Distributor, 'id'>) => string;
  addTicket: (ticket: Omit<Ticket, 'ticketId'>) => void;
  updateTicketStatus: (ticketId: string, status: Ticket['status']) => void;
  currentUser: {
    id: string;
    role: 'supplier' | 'distributor';
  } | null;
  setCurrentUser: (user: {
    id: string;
    role: 'supplier' | 'distributor';
  } | null) => void;
}
const AppContext = createContext<AppContextType | undefined>(undefined);
export function AppProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    role: 'supplier' | 'distributor';
  } | null>(null);
  useEffect(() => {
    const savedSuppliers = localStorage.getItem('suppliers');
    const savedDistributors = localStorage.getItem('distributors');
    const savedTickets = localStorage.getItem('tickets');
    const savedUser = localStorage.getItem('currentUser');
    if (savedSuppliers) setSuppliers(JSON.parse(savedSuppliers));
    if (savedDistributors) setDistributors(JSON.parse(savedDistributors));
    if (savedTickets) setTickets(JSON.parse(savedTickets));
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);
  useEffect(() => {
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
  }, [suppliers]);
  useEffect(() => {
    localStorage.setItem('distributors', JSON.stringify(distributors));
  }, [distributors]);
  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }, [tickets]);
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);
  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    const id = `SUP-${Date.now()}`;
    setSuppliers([...suppliers, {
      ...supplier,
      id
    }]);
    return id;
  };
  const addDistributor = (distributor: Omit<Distributor, 'id'>) => {
    const id = `DIST-${Date.now()}`;
    setDistributors([...distributors, {
      ...distributor,
      id
    }]);
    return id;
  };
  const addTicket = (ticket: Omit<Ticket, 'ticketId'>) => {
    const ticketId = `TKT-${Date.now()}`;
    setTickets([...tickets, {
      ...ticket,
      ticketId
    }]);
  };
  const updateTicketStatus = (ticketId: string, status: Ticket['status']) => {
    setTickets(tickets.map(t => t.ticketId === ticketId ? {
      ...t,
      status
    } : t));
  };
  return <AppContext.Provider value={{
    suppliers,
    distributors,
    tickets,
    addSupplier,
    addDistributor,
    addTicket,
    updateTicketStatus,
    currentUser,
    setCurrentUser
  }}>
      {children}
    </AppContext.Provider>;
}
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}