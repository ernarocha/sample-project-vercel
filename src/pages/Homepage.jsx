import { useState, useEffect, useMemo, useRef } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import SpaceCard from '../components/SpaceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import spacesData from '../data/spaces.json';
import { useAuth } from '../hooks/useAuth';

export default function Homepage() {
  const [heroInView, setHeroInView] = useState(false);

  const { user } = useAuth();
  const [heroNoTransition, setHeroNoTransition] = useState(false);
  const rafRef = useRef({ raf1: 0, raf2: 0 });

  useEffect(() => {
    // Replay entrance animation on mount and whenever auth `user` changes (login/logout)
    setHeroInView(false);
    setHeroNoTransition(true);

    // Use rAF twice to ensure the browser has applied the no-transition styles
    const rafStore = rafRef.current;
    rafStore.raf1 = requestAnimationFrame(() => {
      rafStore.raf2 = requestAnimationFrame(() => {
        setHeroNoTransition(false);
        setHeroInView(true);
      });
    });

    return () => {
      // use the snapshot we created above for stable cleanup
      cancelAnimationFrame(rafStore.raf1);
      cancelAnimationFrame(rafStore.raf2);
    };
  }, [user]);
  const [searchTerm, setSearchTerm] = useState('');
  const [spaces, setSpaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setSpaces(spacesData);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const filteredSpaces = useMemo(() => {
    if (!searchTerm) return spaces;

    return spaces.filter(space =>
      space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      space.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [spaces, searchTerm]);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      {/* Hero Section */}
    <section className="relative bg-gradient-to-br from-stone-50 via-white to-amber-50 h-[calc(100vh-5rem)] flex items-center overflow-hidden p-0 m-0">
        {/* Background image with dark overlay */}
          <div className="absolute inset-0 w-full h-[calc(100vh-5rem)]">
          <img
            src="/assets/images/hero-section.jpg"
            alt="Hero Section Background"
              className="w-full h-[calc(100vh-5rem)] object-cover opacity-30 z-0"
          />
            <div className="absolute inset-0 w-full h-[calc(100vh-5rem)] bg-black/15"></div>
        </div>
        {/* Subtle background pattern */}
          <div className="absolute inset-0 w-full h-[calc(100vh-5rem)] bg-gradient-to-r from-stone-900/5 to-amber-900/5 pointer-events-none"></div>
          <div className="absolute inset-0 w-full h-[calc(100vh-5rem)] pointer-events-none hero-radial-bg"></div>

        <div className="relative container mx-auto px-8 lg:px-16 xl:px-24 2xl:px-32 h-full flex items-center gap-18">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-21 items-center h-full">
            {/* Left: Main Heading */}
            <div className={`flex flex-col justify-center items-center lg:items-start text-center lg:text-left lg:justify-self-start slide-from-left ${heroNoTransition ? 'no-transition' : ''} ${heroInView ? 'in-view' : ''}`}>
              <h1 className="text-6xl lg:text-8xl font-extrabold text-stone-800 mb-2 tracking-tight">
                Find Your
                <span className="block text-5xl lg:text-8xl font-extrabold text-amber-800 mt-1">
                  Focus Zone
                </span>
              </h1>
            </div>

            {/* Right: Subtitle */}
            <div className={`flex flex-col justify-center text-center lg:justify-self-end lg:items-end slide-from-right ${heroNoTransition ? 'no-transition' : ''} ${heroInView ? 'in-view' : ''}`}>
              <div className="lg:max-w-xl w-full">
                <div className="mb-4">
                  <p className="text-xl lg:text-2xl text-stone-800 font-medium leading-relaxed w-full text-center lg:text-right">
                    Discover exceptional co-working spaces and study sanctuaries designed for
                    <span className="text-amber-800 font-medium"> productivity</span> and
                    <span className="text-amber-800 font-medium"> success</span>.
                  </p>
                </div>
                <p className="text-lg text-stone-800 mt-4 w-full text-center lg:text-right">
                  Premium workspaces across the Philippines, curated for professionals and students who demand excellence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spaces Grid */}
      <section className="py-16 bg-gradient-to-b from-stone-50 to-white">
        <div className="container mx-auto px-8 lg:px-16 xl:px-24 2xl:px-32">
          {/* Section Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl lg:text-4xl font-medium text-stone-900 mb-4">
              {searchTerm ? 'Search Results' : 'Study and Working Spaces'}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-800 to-stone-800 mx-auto mb-6"></div>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              {searchTerm
                ? `Discover ${filteredSpaces.length} exceptional space${filteredSpaces.length !== 1 ? 's' : ''} matching "${searchTerm}"`
                : 'Handpicked collection of exceptional co-working spaces designed for productivity and success'
              }
            </p>
          </div>
            {/* Search Section */}
            <div>
              <div className="backdrop-blur-sm p-8 max-w-[470px] mx-auto pb-14">
                <h3 className="text-lg font-medium text-stone-800 mb-4 text-center">
                  Find Your Perfect Workspace
                </h3>
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  placeholder="Search by space name or location..."
                />

              </div>
            </div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-stone-200">
                <LoadingSpinner size="lg" />
                <p className="text-stone-600 mt-4 text-center">Curating premium spaces...</p>
              </div>
            </div>
          ) : filteredSpaces.length > 0 ? (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {filteredSpaces.map(space => (
                <div key={space.id} className="group">
                  <SpaceCard space={space} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-12 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-2xl font-light text-stone-800 mb-4">
                  No spaces found
                </h3>
                <p className="text-stone-600 mb-6 leading-relaxed">
                  We couldn't find any spaces matching your criteria. Try adjusting your search terms or explore our complete collection.
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="bg-gradient-to-r from-amber-800 to-stone-800 text-white px-6 py-3 rounded-full hover:from-amber-700 hover:to-stone-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                  >
                    View All Spaces
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}