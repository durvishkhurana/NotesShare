import React, { useState, useEffect } from 'react';
import { Search, Home, Users, Calendar, MessageSquare, TrendingUp, Settings, Sun, Bell, Star, ThumbsUp, Filter, ChevronDown } from 'lucide-react';
import UploadModal from '../components/UploadModal';
import Toast from '../components/Toast';

// Add CSS for scrollbar hiding
const styles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .responsive-height {
    min-height: 100vh;
    height: auto;
  }
  @media (max-width: 768px) {
    .responsive-height {
      min-height: calc(100vh - 2rem);
    }
  }
`;

const NoteCard = ({ id, title, subtitle, author, image, tag, drive_link, likes = 0, starred: starredProp = false, notify, onStarToggle }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes || 0);

  const openLink = (e) => {
    e?.stopPropagation?.();
    if (drive_link) window.open(drive_link, '_blank', 'noopener,noreferrer');
  };

  const [starred, setStarred] = useState(!!starredProp);
  
  // Sync starred state with prop changes
  React.useEffect(() => {
    setStarred(!!starredProp);
  }, [starredProp]);
  const toggleStar = async (e) => {
    e?.stopPropagation?.();
    const newStarredState = !starred;
    
    if (id) {
      try {
        const res = await fetch(`http://localhost:5000/api/notes/${id}/star`, { method: 'POST' })
        if (res.ok) {
          const data = await res.json();
          const actualStarredState = Boolean(data.starred);
          setStarred(actualStarredState);
          notify?.({ type: 'success', message: actualStarredState ? 'Starred' : 'Unstarred' });
          // Update parent state
          onStarToggle?.(title, actualStarredState);
          return
        }
      } catch (err) {
        console.error(err)
      }
    }
    // Fallback for local state
    setStarred(newStarredState);
    notify?.({ type: 'success', message: newStarredState ? 'Starred' : 'Unstarred' });
    // Update parent state
    onStarToggle?.(title, newStarredState);
  };

  const handleLike = async (e) => {
    e?.stopPropagation?.();
    if (id) {
      try {
        const res = await fetch(`http://localhost:5000/api/notes/${id}/like`, { 
          method: 'POST',
          headers: {
            'User-ID': 'user123' // Simple user ID for demo
          }
        });
        if (res.ok) {
          const data = await res.json();
          setLikesCount(data.likes);
          setLiked(data.liked);
          notify?.({ type: 'success', message: data.liked ? 'Liked' : 'Unliked' });
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }
    // fallback/local
    setLiked((prevLiked) => !prevLiked);
    setLikesCount((c) => (liked ? c - 1 : c + 1));
  };

  return (
    <div
      className="relative rounded-xl overflow-hidden cursor-pointer group bg-gray-900 transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-2xl"
      onClick={() => drive_link && window.open(drive_link, '_blank', 'noopener,noreferrer')}
    >
      <img src={image} alt={title} className="w-full h-48 object-cover" style={{ aspectRatio: '16/9' }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-start justify-between">
          <div className="pr-4">
            <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2">{title}</h3>
            <p className="text-gray-300 text-sm mb-1">{subtitle}</p>
            <p className="text-gray-400 text-xs">{author}</p>
          </div>

          <div className="flex flex-col items-end gap-2 ml-2">
            <button
              type="button"
              onClick={toggleStar}
              aria-pressed={starred}
              className={`p-2 rounded ${starred ? 'text-yellow-400' : 'text-white/70'}`}
            >
              <Star className={`w-5 h-5 ${starred ? 'fill-yellow-400' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-2 px-3 py-1 rounded text-sm ${liked ? 'bg-red-600 text-white' : 'bg-white/5 hover:bg-white/10'}`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{likesCount}</span>
            </button>
          </div>
        </div>
      </div>
      {tag && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
          {tag}
        </div>
      )}
    </div>
  );
};

const ScrollableSection = ({ children }) => {
  const sectionRef = React.useRef();
  const [showArrows, setShowArrows] = useState(false);
  const [currentScroll, setCurrentScroll] = useState(0);

  const scroll = (direction) => {
    if (sectionRef.current) {
      const container = sectionRef.current;
      const scrollAmount = 300; // Width of one note + gap
      const maxScroll = container.scrollWidth - container.clientWidth;
      
      let newScroll;
      if (direction === 'left') {
        newScroll = Math.max(0, currentScroll - scrollAmount);
      } else {
        newScroll = Math.min(maxScroll, currentScroll + scrollAmount);
      }
      
      container.scrollTo({ left: newScroll, behavior: 'smooth' });
      setCurrentScroll(newScroll);
    }
  };

  useEffect(() => {
    const checkScrollable = () => {
      if (sectionRef.current) {
        const isScrollable = sectionRef.current.scrollWidth > sectionRef.current.clientWidth;
        setShowArrows(isScrollable);
      }
    };
    
    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, [children]);

  return (
    <div className="relative">
      {showArrows && (
        <>
          <button 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-black p-3 shadow-lg transition-all duration-200 z-30"
            style={{ borderRadius: '4px' }}
            onClick={() => scroll('left')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-black p-3 shadow-lg transition-all duration-200 z-30"
            style={{ borderRadius: '4px' }}
            onClick={() => scroll('right')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </>
      )}
      <div 
        ref={sectionRef} 
        className="overflow-hidden scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="flex gap-4 pb-4 px-2 transition-transform duration-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function CarevoDashboard({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  const filters = ['All', 'Trending', 'Recent', 'Recommended', 'Important'];
  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'likes-high', label: 'Most Likes' },
    { value: 'likes-low', label: 'Least Likes' }
  ];

  // move static lists into state so we can append new uploads
  const [trendingNotes, setTrendingNotes] = useState([
    {
      title: 'Mathematics II',
      subtitle: 'Cheat Sheet • Fourier Series • 10 Oct 2025 • All Branches',
      author: 'Harshit Dua',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
      tag: '#trending 1',
      starred: true
    },
    {
      title: 'Robotics Dynamics',
      subtitle: 'Notes • Projection',
      author: 'Harshit Dua',
      image: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=400&h=300&fit=crop'
    },
    {
      title: 'DBMS',
      subtitle: 'Tutorial • Tut Sheet 1',
      author: 'Pulkit Jhamb',
      image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=300&fit=crop'
    },
    {
      title: 'UI/UX Design',
      subtitle: 'Assignment • 1st Ch',
      author: 'Pulkit Jhamb',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop'
    },
    {
      title: 'Mathematics II',
      subtitle: 'Cheat Sheet • Fourier Series • 10 Oct 2025 • All Branches',
      author: 'Harshit Dua',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
      tag: '#trending 1'
    },
    {
      title: 'Robotics Dynamics',
      subtitle: 'Notes • Projection',
      author: 'Harshit Dua',
      image: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=400&h=300&fit=crop'
    },
    {
      title: 'DBMS',
      subtitle: 'Tutorial • Tut Sheet 1',
      author: 'Pulkit Jhamb',
      image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=300&fit=crop'
    },
    {
      title: 'UI/UX Design',
      subtitle: 'Assignment • 1st Ch',
      author: 'Pulkit Jhamb',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop'
    }
  ]);
  
  const [recentNotes, setRecentNotes] = useState([
    {
      title: 'AI/ML',
      subtitle: 'Notes • ANN',
      author: 'Kartik Malik',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
      starred: true
    },
    {
      title: 'Digital Electronics',
      subtitle: 'Assignment • 1st Ch',
      author: 'Riya Mehta',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop'
    },
    {
      title: 'Data Structures',
      subtitle: 'Notes • Linked Lists',
      author: 'Riya Mehta',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop'
    },
    {
      title: 'Operating Systems',
      subtitle: 'Tutorial • Tut Sheet 1',
      author: 'Pulkit Jhamb',
      image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&h=300&fit=crop',
      starred: true
    },
    {
      title: 'Analog Electronics',
      subtitle: 'Notes • Op-Amp',
      author: 'Kartik Malik',
      image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop'
    },
    {
      title: 'AI/ML',
      subtitle: 'Notes • ANN',
      author: 'Kartik Malik',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop'
    },
    {
      title: 'Digital Electronics',
      subtitle: 'Assignment • 1st Ch',
      author: 'Riya Mehta',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop'
    },
    {
      title: 'Data Structures',
      subtitle: 'Notes • Linked Lists',
      author: 'Riya Mehta',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop'
    },
    {
      title: 'Operating Systems',
      subtitle: 'Tutorial • Tut Sheet 1',
      author: 'Pulkit Jhamb',
      image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&h=300&fit=crop',
      starred: true
    },
    {
      title: 'Analog Electronics',
      subtitle: 'Notes • Op-Amp',
      author: 'Kartik Malik',
      image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop'
    }
  ]);
  
  const [recommendedNotes, setRecommendedNotes] = useState([
    {
      title: 'Mechanical Design',
      subtitle: 'Notes • Gears',
      author: 'Various',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop'
    },
    {
      title: 'Computer Networks',
      subtitle: 'Assignment • Protocols',
      author: 'Various',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop'
    },
    {
      title: 'Software Engineering',
      subtitle: 'Notes • SDLC',
      author: 'Various',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
    },
    {
      title: 'Power Systems',
      subtitle: 'Tutorial • Generators',
      author: 'Various',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop'
    },
    {
      title: 'Mechanical Design',
      subtitle: 'Notes • Gears',
      author: 'Various',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop'
    },
    {
      title: 'Computer Networks',
      subtitle: 'Assignment • Protocols',
      author: 'Various',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop'
    },
    {
      title: 'Software Engineering',
      subtitle: 'Notes • SDLC',
      author: 'Various',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
    },
    {
      title: 'Power Systems',
      subtitle: 'Tutorial • Generators',
      author: 'Various',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop'
    }
  ]);
  
  // upload modal created handler
  const handleCreated = (note) => {
    // categorize into lists
    const cat = note.category || 'recent'
    if (cat === 'trending') setTrendingNotes((s) => [note, ...s])
    else if (cat === 'recommended') setRecommendedNotes((s) => [note, ...s])
    else setRecentNotes((s) => [note, ...s])
    setToast({ id: Date.now(), type: 'success', message: 'Note uploaded' })
  }

  const notify = (t) => {
    setToast({ id: Date.now(), ...t })
  }

  const clearToast = (id) => {
    if (!toast) return;
    if (toast.id === id) setToast(null);
  }

  // Handle star toggle across all sections
  const handleStarToggle = (noteTitle, isStarred) => {
    // Update trending notes
    setTrendingNotes(prev => prev.map(note => 
      note.title === noteTitle ? { ...note, starred: isStarred } : note
    ));
    
    // Update recent notes
    setRecentNotes(prev => prev.map(note => 
      note.title === noteTitle ? { ...note, starred: isStarred } : note
    ));
    
    // Update recommended notes
    setRecommendedNotes(prev => prev.map(note => 
      note.title === noteTitle ? { ...note, starred: isStarred } : note
    ));
  };

  // Search functionality
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      // Search in backend data
      let backendResults = [];
      try {
        const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          backendResults = await response.json();
        }
      } catch (error) {
        console.error('Backend search error:', error);
      }

      // Search in frontend static data
      const allFrontendNotes = [...trendingNotes, ...recentNotes, ...recommendedNotes];
      const frontendResults = allFrontendNotes.filter(note => {
        const title = note.title?.toLowerCase() || '';
        const subtitle = note.subtitle?.toLowerCase() || '';
        const author = note.author?.toLowerCase() || '';
        const queryLower = query.toLowerCase();
        
        return title.includes(queryLower) || 
               subtitle.includes(queryLower) || 
               author.includes(queryLower);
      });

      // Combine results and remove duplicates based on title
      const combinedResults = [...backendResults];
      frontendResults.forEach(frontendNote => {
        const isDuplicate = combinedResults.some(backendNote => 
          backendNote.title?.toLowerCase() === frontendNote.title?.toLowerCase()
        );
        if (!isDuplicate) {
          combinedResults.push(frontendNote);
        }
      });

      setSearchResults(combinedResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      notify({ type: 'error', message: 'Search failed' });
    }
    setIsSearching(false);
  };

  // Sort notes based on selected criteria
  const sortNotes = (notes) => {
    if (sortBy === 'default') return notes;
    
    return [...notes].sort((a, b) => {
      const getNumericValue = (note) => {
        return note.likes || 0;
      };
      
      switch (sortBy) {
        case 'likes-high':
          return getNumericValue(b) - getNumericValue(a);
        case 'likes-low':
          return getNumericValue(a) - getNumericValue(b);
        default:
          return 0;
      }
    });
  };

  // Filter content based on selected tab
  const getFilteredContent = () => {
    switch (selectedFilter) {
      case 'Trending':
        return {
          showTrending: true,
          showRecent: false,
          showRecommended: false,
          showImportant: false
        };
      case 'Recent':
        return {
          showTrending: false,
          showRecent: true,
          showRecommended: false,
          showImportant: false
        };
      case 'Recommended':
        return {
          showTrending: false,
          showRecent: false,
          showRecommended: true,
          showImportant: false
        };
      case 'Important':
        return {
          showTrending: false,
          showRecent: false,
          showRecommended: false,
          showImportant: true
        };
      case 'All':
      default:
        return {
          showTrending: true,
          showRecent: true,
          showRecommended: true,
          showImportant: true
        };
    }
  };

  const filteredContent = getFilteredContent();

  // Debounced search
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="responsive-height bg-black text-white">
      <style>{styles}</style>
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center w-full mx-auto px-6 max-w-full">
          {/* Left Section */}
          <div className="flex items-center gap-8 flex-1">
            <h1 className="text-2xl font-bold">Carevo</h1>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notes and lectures by title, author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border border-gray-700 rounded-lg pl-10 pr-4 py-2 w-80 focus:outline-none focus:border-gray-600"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                </div>
              )}
            </div>
          </div>

          {/* Center Navigation Icons */}
          <div className="flex items-center gap-12 mx-16">
            <Home className="w-6 h-6 cursor-pointer hover:text-gray-400 transition-colors" />
            <Users className="w-6 h-6 cursor-pointer hover:text-gray-400 transition-colors" />
            <Calendar className="w-6 h-6 cursor-pointer hover:text-gray-400 transition-colors" />
            <MessageSquare className="w-6 h-6 cursor-pointer hover:text-gray-400 transition-colors" />
            <TrendingUp className="w-6 h-6 cursor-pointer hover:text-gray-400 transition-colors" />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-6 flex-1 justify-end">
            <button
              onClick={() => setShowUpload(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-all duration-200 hover:scale-105"
            >
              Upload
            </button>
            <Sun className="w-6 h-6 cursor-pointer hover:text-gray-400 transition-colors" />
            <Settings className="w-6 h-6 cursor-pointer hover:text-gray-400 transition-colors" />
            <Bell className="w-6 h-6 cursor-pointer hover:text-gray-400 transition-colors" />
            <div className="w-10 h-10 rounded-full bg-white cursor-pointer" />
          </div>
        </div>
      </header>


      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} onCreated={handleCreated} onNotify={notify} />
      )}

  <div className="flex w-full mx-auto px-6">
        {/* Sidebar */}
        <aside className="w-80 border-r border-gray-800 p-6 min-h-screen">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-gray-700" />
            <div>
              <h2 className="font-semibold">Harshit Dua</h2>
            </div>
          </div>

          <nav className="space-y-2">
            <button onClick={() => onNavigate?.('notes')} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700">
              <Calendar className="w-5 h-5" />
              <span>NoteHive</span>
            </button>
            <button onClick={() => onNavigate?.('lectures')} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800">
              <MessageSquare className="w-5 h-5" />
              <span>LectureCast</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Search Results */}
          {searchQuery && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-2">
                Search Results for "{searchQuery}"
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </p>
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  {searchResults.map((note, index) => (
                    <NoteCard key={`search-${note.id || index}`} {...note} notify={notify} onStarToggle={handleStarToggle} />
                  ))}
                </div>
              ) : (
                !isSearching && (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No notes found matching your search.</p>
                    <p className="text-gray-500 text-sm mt-2">Try different keywords or check your spelling.</p>
                  </div>
                )
              )}
            </div>
          )}

          {/* Show regular content only when not searching */}
          {!searchQuery && (
            <>
          {/* Filter Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-6 py-4 rounded-lg text-lg font-bold transition-colors ${
                    selectedFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-6 py-4 rounded-lg bg-gray-900 text-gray-400 hover:bg-gray-800"
              >
                <Filter className="w-5 h-5" />
                <span className="text-lg font-bold">{sortOptions.find(opt => opt.value === sortBy)?.label || 'Filter'}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showFilterDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-6 py-3 text-base hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        sortBy === option.value ? 'text-blue-400 bg-gray-700' : 'text-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recommended For You */}
          {filteredContent.showRecommended && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Recommended For You</h2>
                  <p className="text-gray-400 text-sm">(based on your branch or semester)</p>
                </div>
                <button 
                  onClick={() => setSelectedFilter('Recommended')}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium cursor-pointer"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {sortNotes(recommendedNotes).slice(0, selectedFilter === 'Recommended' ? undefined : 4).map((note, index) => (
                  <NoteCard key={index} {...note} notify={notify} onStarToggle={handleStarToggle} />
                ))}
              </div>
            </div>
          )}

          {/* Trending Notes */}
          {filteredContent.showTrending && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Trending Notes</h2>
                <button 
                  onClick={() => setSelectedFilter('Trending')}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium cursor-pointer"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {sortNotes(trendingNotes).slice(0, selectedFilter === 'Trending' ? undefined : 4).map((note, index) => (
                  <NoteCard key={index} {...note} notify={notify} onStarToggle={handleStarToggle} />
                ))}
              </div>
            </div>
          )}

          {/* Recently Uploaded Notes */}
          {filteredContent.showRecent && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recently Uploaded Notes</h2>
                <button 
                  onClick={() => setSelectedFilter('Recent')}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium cursor-pointer"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {sortNotes(recentNotes).slice(0, selectedFilter === 'Recent' ? undefined : 4).map((note, index) => (
                  <NoteCard key={index} {...note} notify={notify} onStarToggle={handleStarToggle} />
                ))}
              </div>
            </div>
          )}

          {/* Important notes (only starred notes) */}
          {filteredContent.showImportant && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Important Notes</h2>
                  <p className="text-gray-400 text-sm">(starred notes)</p>
                </div>
                <button 
                  onClick={() => setSelectedFilter('Important')}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium cursor-pointer"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {sortNotes([...trendingNotes, ...recentNotes, ...recommendedNotes]
                  .filter(note => note.starred))
                  .slice(0, selectedFilter === 'Important' ? undefined : 4)
                  .map((note, index) => (
                    <NoteCard key={`important-${index}`} {...note} notify={notify} onStarToggle={handleStarToggle} />
                  ))}
              </div>
            </div>
          )}
            </>
          )}
        </main>
      </div>
      {/* Toast container */}
      <div className="fixed right-6 bottom-6 z-60">
        {toast && <Toast toast={toast} onClose={clearToast} />}
      </div>
    </div>
  );
}