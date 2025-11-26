import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
export function DistributorDashboard() {
  const {
    tickets
  } = useApp();
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const filteredTickets = useMemo(() => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return tickets;
    }
    return tickets.filter(ticket => {
      const eventDate = new Date(ticket.eventDate);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      return eventDate >= start && eventDate <= end;
    });
  }, [tickets, dateRange]);
  const stats = useMemo(() => {
    const available = filteredTickets.filter(t => t.status === 'Available');
    const sold = filteredTickets.filter(t => t.status === 'Sold');
    const resale = filteredTickets.filter(t => t.status === 'Available for Resale');
    return {
      totalAvailable: available.reduce((sum, t) => sum + t.quantity, 0),
      totalSold: sold.length,
      totalResale: resale.length,
      totalTickets: filteredTickets.length
    };
  }, [filteredTickets]);
  return <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-semibold text-neutral-900 mb-8">
          Distributor Dashboard
        </h1>

        <Card className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Search Tickets
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={dateRange.startDate} onChange={e => setDateRange({
            ...dateRange,
            startDate: e.target.value
          })} />
            <Input label="End Date" type="date" value={dateRange.endDate} onChange={e => setDateRange({
            ...dateRange,
            endDate: e.target.value
          })} />
          </div>
          {(dateRange.startDate || dateRange.endDate) && <Button variant="secondary" className="mt-4" onClick={() => setDateRange({
          startDate: '',
          endDate: ''
        })}>
              Clear Filters
            </Button>}
        </Card>

        <div className="grid grid-cols-4 gap-6 mb-12">
          <Card>
            <div className="text-sm text-neutral-600 mb-1">Total Tickets</div>
            <div className="text-3xl font-semibold text-neutral-900">
              {stats.totalTickets}
            </div>
          </Card>
          <Card>
            <div className="text-sm text-neutral-600 mb-1">Available</div>
            <div className="text-3xl font-semibold text-neutral-900">
              {stats.totalAvailable}
            </div>
          </Card>
          <Card>
            <div className="text-sm text-neutral-600 mb-1">Sold</div>
            <div className="text-3xl font-semibold text-neutral-900">
              {stats.totalSold}
            </div>
          </Card>
          <Card>
            <div className="text-sm text-neutral-600 mb-1">For Resale</div>
            <div className="text-3xl font-semibold text-neutral-900">
              {stats.totalResale}
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">
            Available Tickets
          </h2>

          {filteredTickets.length === 0 ? <div className="text-center py-12">
              <p className="text-neutral-600">No tickets found</p>
            </div> : <div className="space-y-4">
              {filteredTickets.map(ticket => <div key={ticket.ticketId} className="border border-neutral-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                        {ticket.ticketName}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {ticket.venue} •{' '}
                        {new Date(ticket.eventDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-neutral-500 mt-1">
                        Supplier: {ticket.supplierName}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-semibold text-neutral-900 mb-1">
                        ${ticket.price}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${ticket.status === 'Available' ? 'bg-green-100 text-green-800' : ticket.status === 'Sold' ? 'bg-neutral-200 text-neutral-800' : ticket.status === 'Available for Resale' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm mb-4">
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

                  {ticket.description && <p className="text-sm text-neutral-600 mb-4">
                      {ticket.description}
                    </p>}

                  {ticket.status === 'Available' && <Button className="mt-4">Purchase Tickets</Button>}

                  {ticket.status === 'Available for Resale' && <Button variant="secondary" className="mt-4">
                      Buy for Resale
                    </Button>}
                </div>)}
            </div>}
        </Card>
      </div>
    </div>;
}