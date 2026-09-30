'use client';

import { useState } from 'react';
import Link from 'next/link';

/* Demo customers ----------------------------------------------------------- */

interface DemoCustomer {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  ordersCount: number;
  lastOrderDate: string;
}

const DEMO_CUSTOMERS: DemoCustomer[] = [
  {
    id: 'cust_001',
    companyName: 'TechVista Solutions',
    contactName: 'Priya Sharma',
    phone: '+91 98765 43210',
    email: 'priya@techvista.com',
    ordersCount: 4,
    lastOrderDate: '2024-09-28',
  },
  {
    id: 'cust_002',
    companyName: 'Pinnacle Corp',
    contactName: 'Arjun Mehta',
    phone: '+91 98765 43211',
    email: 'arjun@pinnaclecorp.in',
    ordersCount: 2,
    lastOrderDate: '2024-09-27',
  },
  {
    id: 'cust_003',
    companyName: 'GreenLeaf Organics',
    contactName: 'Neha Kapoor',
    phone: '+91 98765 43212',
    email: 'neha@greenleaf.co.in',
    ordersCount: 6,
    lastOrderDate: '2024-09-26',
  },
  {
    id: 'cust_004',
    companyName: 'Stellar Innovations',
    contactName: 'Rohan Desai',
    phone: '+91 98765 43213',
    email: 'rohan@stellar.io',
    ordersCount: 3,
    lastOrderDate: '2024-09-25',
  },
  {
    id: 'cust_005',
    companyName: 'BrightPath Analytics',
    contactName: 'Ananya Gupta',
    phone: '+91 98765 43214',
    email: 'ananya@brightpath.com',
    ordersCount: 1,
    lastOrderDate: '2024-09-24',
  },
  {
    id: 'cust_006',
    companyName: 'NovaTech Labs',
    contactName: 'Vikram Singh',
    phone: '+91 98765 43215',
    email: 'vikram@novatech.in',
    ordersCount: 5,
    lastOrderDate: '2024-09-23',
  },
  {
    id: 'cust_007',
    companyName: 'Sunrise Enterprises',
    contactName: 'Kavita Reddy',
    phone: '+91 98765 43216',
    email: 'kavita@sunrise.co.in',
    ordersCount: 2,
    lastOrderDate: '2024-09-22',
  },
  {
    id: 'cust_008',
    companyName: 'CrestView Partners',
    contactName: 'Amit Patel',
    phone: '+91 98765 43217',
    email: 'amit@crestview.in',
    ordersCount: 1,
    lastOrderDate: '2024-09-21',
  },
];

/* Page --------------------------------------------------------------------- */

export default function CustomersPage() {
  const [search, setSearch] = useState('');

  const filtered = DEMO_CUSTOMERS.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.contactName.toLowerCase().includes(q) ||
      c.companyName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage customer and company records ({DEMO_CUSTOMERS.length} customers)
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, company, email, or phone..."
          className="w-full rounded-lg border border-border pl-10 pr-4 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Search customers"
        />
      </div>

      {/* Customers table */}
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-5 py-3 font-medium text-muted-foreground">Company</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Contact</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Phone</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Email</th>
                <th className="px-5 py-3 font-medium text-muted-foreground text-right">Orders</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                    No customers found matching &ldquo;{search}&rdquo;.
                  </td>
                </tr>
              ) : (
                filtered.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {customer.companyName}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-foreground">{customer.contactName}</td>
                    <td className="px-5 py-3 text-muted-foreground font-mono text-xs">
                      {customer.phone}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{customer.email}</td>
                    <td className="px-5 py-3 text-right">
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                        {customer.ordersCount}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="rounded-md px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
