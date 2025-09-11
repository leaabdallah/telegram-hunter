import React, { useState } from 'react';
import { toast } from 'sonner';

const LeakHunter = () => {
  const [searchType, setSearchType] = useState('email');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) {
      toast.error('Please enter a search query');
      return;
    }

    if (searchType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(searchQuery)) {
        toast.error('Please enter a valid email address');
        return;
      }
    }

    setIsLoading(true);

    // 🔧 Replace this with real API later
    setTimeout(() => {
      const mockResults = [
        {
          source: 'Have I Been Pwned',
          date: '2021-06-01',
          details: 'Email and password leaked.',
        },
        {
          source: 'DeHashed',
          date: 'N/A',
          details: 'No breach found.',
        },
      ];

      setResults(mockResults);

      if (mockResults.length === 0) {
        toast('No results found');
      } else {
        toast.success('Search successful');
      }

      setIsLoading(false);
    }, 1000);
  };

  const handleExportCSV = () => {
    if (results.length === 0) return;

    const csvHeader = 'Source,Date,Details\n';
    const csvRows = results.map((r) =>
      [r.source, r.date, `"${r.details}"`].join(',')
    );

    const csvContent = csvHeader + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'search_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Results exported to CSV');
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSearch}
        className="bg-gray-800 rounded-xl p-6 shadow space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Search Type</label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="email">Email</option>
              <option value="username">Username</option>
              <option value="domain">Domain</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-300 mb-1">Search Query</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Enter ${searchType}...`}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-slate-100 hover:bg-slate-200 text-blue-900 px-6 py-2 rounded-lg border border-slate-300"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {results.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold text-white mb-4">Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2 text-left text-gray-400">Source</th>
                  <th className="py-2 text-left text-gray-400">Date</th>
                  <th className="py-2 text-left text-gray-400">Details</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="py-2 text-white">{r.source}</td>
                    <td className="py-2 text-white">{r.date}</td>
                    <td className="py-2 text-gray-300">{r.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleExportCSV}
            className="mt-4 bg-slate-100 hover:bg-slate-200 text-blue-900 border border-slate-300 px-4 py-2 rounded-lg"
          >
            Export to CSV
          </button>
        </div>
      )}
    </div>
  );
};

export default LeakHunter;
