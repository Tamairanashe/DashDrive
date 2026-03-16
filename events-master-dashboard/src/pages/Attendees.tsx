import { Search, Filter, Mail, Download } from 'lucide-react';

const attendees = [
  { id: 'ATT-001', name: 'John Smith', email: 'john@example.com', ticketType: 'VIP', seat: 'A12', status: 'Valid', event: 'Summer Music Festival' },
  { id: 'ATT-002', name: 'Sarah Lee', email: 'sarah@example.com', ticketType: 'Standard', seat: 'B15', status: 'Checked-In', event: 'Summer Music Festival' },
  { id: 'ATT-003', name: 'Mike Chen', email: 'mike@example.com', ticketType: 'Early Bird', seat: 'GA', status: 'Valid', event: 'Summer Music Festival' },
  { id: 'ATT-004', name: 'Emma Davis', email: 'emma@example.com', ticketType: 'VIP', seat: 'A13', status: 'Checked-In', event: 'Summer Music Festival' },
  { id: 'ATT-005', name: 'Alex Johnson', email: 'alex@example.com', ticketType: 'Standard', seat: 'C22', status: 'Refunded', event: 'Summer Music Festival' },
];

export default function Attendees() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Attendees</h1>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Mail className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
            Email Attendees
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
            Export List
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative rounded-md shadow-sm max-w-md flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
              placeholder="Search by name, email, or ticket ID"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-700">
              <Filter className="h-5 w-5 mr-2 text-gray-400" />
              Filter by:
            </div>
            <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border">
              <option>All Events</option>
              <option>Summer Music Festival</option>
              <option>Tech Startup Conference</option>
            </select>
            <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border">
              <option>All Statuses</option>
              <option>Valid</option>
              <option>Checked-In</option>
              <option>Refunded</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seat
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendees.map((attendee) => (
                <tr key={attendee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                          {attendee.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{attendee.name}</div>
                        <div className="text-sm text-gray-500">{attendee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{attendee.ticketType}</div>
                    <div className="text-xs text-gray-500">{attendee.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {attendee.seat}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      attendee.status === 'Checked-In' ? 'bg-green-100 text-green-800' : 
                      attendee.status === 'Valid' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {attendee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <a href="#" className="text-indigo-600 hover:text-indigo-900">Resend</a>
                      <span className="text-gray-300">|</span>
                      <a href="#" className="text-indigo-600 hover:text-indigo-900">Transfer</a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
