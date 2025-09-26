import { Search } from 'lucide-react';

export default function SearchBar({ searchTerm, onSearchChange, placeholder = "Search spaces..." }) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-10 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-stone-400" />
        </div>
      </div>
    </div>
  );
}