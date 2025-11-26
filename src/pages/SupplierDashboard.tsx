import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
export function SupplierDashboard() {
  const navigate = useNavigate();
  const {
    tickets,
    currentUser
  } = useApp();
  const myTickets = tickets.filter(t => t.supplierId === currentUser?.id);
  const stats = {
    total: myTickets.length,
    available: myTickets.filter(t => t.status === 'Available').reduce((sum, t) => sum + t.quantity, 0),
    sold: myTickets.filter(t => t.status === 'Sold').length,
    resale: myTickets.filter(t => t.status === 'Available for Resale').length
  };
  return <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-neutral-900">
            Supplier Dashboard
          </h1>
          <Button onClick={() => navigate('/supplier/issue-ticket')}>
            Issue New Ticket
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-12">
          <Card>
            <div className="text-sm text-neutral-600 mb-1">Total Tickets</div>
            <div className="text-3xl font-semibold text-neutral-900">
              {stats.total}
            </div>
          </Card>
          <Card>
            <div className="text-sm text-neutral-600 mb-1">Available</div>
            <div className="text-3xl font-semibold text-neutral-900">
              {stats.available}
            </div>
          </Card>
          <Card>
            <div className="text-sm text-neutral-600 mb-1">Sold</div>
            <div className="text-3xl font-semibold text-neutral-900">
              {stats.sold}
            </div>
          </Card>
          <Card>
            <div className="text-sm text-neutral-600 mb-1">For Resale</div>
            <div className="text-3xl font-semibold text-neutral-900">
              {stats.resale}
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">
            Your Tickets
          </h2>

          {myTickets.length === 0 ? <div className="text-center py-12">
              <p className="text-neutral-600 mb-4">No tickets issued yet</p>
              <Button onClick={() => navigate('/supplier/issue-ticket')}>
                Issue Your First Ticket
              </Button>
            </div> : <div className="space-y-4">
              {myTickets.map(ticket => <div key={ticket.ticketId} className="border border-neutral-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                        {ticket.ticketName}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {ticket.venue} •{' '}
                        {new Date(ticket.eventDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${ticket.status === 'Available' ? 'bg-green-100 text-green-800' : ticket.status === 'Sold' ? 'bg-neutral-200 text-neutral-800' : ticket.status === 'Available for Resale' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                      {ticket.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-600">Price:</span>
                      <span className="ml-2 font-medium text-neutral-900">
                        ${ticket.price}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-600">Quantity:</span>
                      <span className="ml-2 font-medium text-neutral-900">
                        {ticket.quantity}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-600">Ticket ID:</span>
                      <span className="ml-2 font-medium text-neutral-900">
                        {ticket.ticketId}
                      </span>
                    </div>
                  </div>

                  {ticket.description && <p className="mt-4 text-sm text-neutral-600">
                      {ticket.description}
                    </p>}
                </div>)}
            </div>}
        </Card>
      </div>
    </div>;
}