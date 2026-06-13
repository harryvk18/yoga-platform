import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Filter, ArrowRight, X, SlidersHorizontal } from 'lucide-react';
import { centers } from '../data/mockData';
import type { YogaType } from '../types';

const YOGA_TYPES: YogaType[] = ['Hatha', 'Vinyasa', 'Ashtanga', 'Yin', 'Kundalini', 'Restorative', 'Hot Yoga', 'Meditation', 'Power Yoga'];
const CITIES = ['All', 'London', 'Manchester', 'Bristol', 'Edinburgh'];

export default function Centers() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All');
  const [selectedTypes, setSelectedTypes] = useState<YogaType[]>([]);
  const [minRating, setMinRating] = useState(0);

  const toggleType = (type: YogaType) =>
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);

  const filtered = useMemo(() => {
    return centers.filter(c => {
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase()) ||
        c.yogaTypes.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchCity = city === 'All' || c.city === city;
      const matchTypes = selectedTypes.length === 0 || selectedTypes.some(t => c.yogaTypes.includes(t));
      const matchRating = c.rating >= minRating;
      return matchSearch && matchCity && matchTypes && matchRating;
    });
  }, [search, city, selectedTypes, minRating]);

  const clearFilters = () => {
    setSearch(''); setCity('All'); setSelectedTypes([]); setMinRating(0);
  };
  const hasFilters = search || city !== 'All' || selectedTypes.length > 0 || minRating > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mb-2">Our network</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Partner Studios</h1>
          <p className="text-gray-500">Find the perfect yoga studio and book your next session.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Filters */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, city, or style…"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* City filter */}
            <div className="flex gap-2 flex-wrap">
              {CITIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    city === c
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-600'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Style tags */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500 font-medium">Filter by style</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {YOGA_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    selectedTypes.includes(type)
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Rating filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500 font-medium">Min rating</span>
            </div>
            <div className="flex gap-1.5">
              {[0, 3, 4, 4.5, 4.8].map(r => (
                <button
                  key={r}
                  onClick={() => setMinRating(minRating === r ? 0 : r)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    minRating === r && r > 0
                      ? 'bg-amber-100 text-amber-700 border-amber-300'
                      : r === 0
                      ? minRating === 0 ? 'bg-gray-100 text-gray-600 border-gray-300' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-600'
                  }`}
                >
                  {r === 0 ? 'Any' : <><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{r}+</>}
                </button>
              ))}
            </div>
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-colors ml-auto">
                <X className="w-3 h-3" /> Clear all
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-5">
          Showing <strong className="text-gray-800">{filtered.length}</strong> of {centers.length} studios
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No studios found</h3>
            <p className="text-gray-400 text-sm">Try adjusting your filters or search term.</p>
            <button onClick={clearFilters} className="mt-4 text-emerald-600 font-medium text-sm hover:underline">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(center => (
              <Link
                key={center.id}
                to={`/centers/${center.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={center.image}
                    alt={center.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-semibold text-amber-600 shadow-sm">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {center.rating}
                    <span className="text-gray-400 font-normal ml-0.5">({center.reviewCount})</span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs bg-white/90 backdrop-blur-sm text-emerald-700 font-medium px-2 py-0.5 rounded-full">
                      {center.city}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors leading-tight">
                    {center.name}
                  </h3>
                  <p className="text-sm text-emerald-600 italic mt-0.5 mb-2">{center.tagline}</p>
                  <div className="flex items-start gap-1.5 text-xs text-gray-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    {center.address}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">{center.description}</p>

                  {/* Yoga types */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {center.yogaTypes.slice(0, 3).map(type => (
                      <span key={type} className="text-xs px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-medium">
                        {type}
                      </span>
                    ))}
                    {center.yogaTypes.length > 3 && (
                      <span className="text-xs px-2 py-0.5 text-gray-400">+{center.yogaTypes.length - 3}</span>
                    )}
                  </div>

                  {/* Instructors */}
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {center.instructors.map(i => (
                        <img key={i.id} src={i.avatar} alt={i.name} className="w-7 h-7 rounded-full border-2 border-white object-cover" />
                      ))}
                      <div className="w-7 h-7 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center">
                        <span className="text-[10px] font-bold text-emerald-700">{center.instructors.length}</span>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 group-hover:gap-2 transition-all">
                      View schedule <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
