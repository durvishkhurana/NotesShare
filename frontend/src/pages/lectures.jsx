import React, { useState } from 'react';
import { Search, Home, Users, Calendar, MessageSquare, TrendingUp, Settings, Sun, Bell, Play, Clock, Eye, ThumbsUp, Filter, ChevronDown } from 'lucide-react';

const styles = `
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

const LectureCard = ({ title, subject, instructor, duration, views, likes, thumbnail, date, isLive, onLike, isLiked }) => (
  <div className="relative rounded-xl overflow-hidden cursor-pointer group bg-gray-900">
    <div className="relative">
      <img src={thumbnail} alt={title} className="w-full h-48 object-cover" style={{ aspectRatio: '16/9' }} />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
          <Play className="w-8 h-8 text-black ml-1" fill="black" />
        </div>
      </div>
      {isLive && (
        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          LIVE
        </div>
      )}
      <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded">
        {duration}
      </div>
    </div>
    <div className="p-4">
      <div className="text-xs text-gray-400 mb-2">{subject}</div>
      <h3 className="text-white font-semibold text-base mb-2 line-clamp-2">{title}</h3>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{instructor}</span>
        <span>{date}</span>
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{views}</span>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
          className={`flex items-center gap-1 hover:text-blue-400 transition-colors ${
            isLiked ? 'text-blue-400' : ''
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          <span>{likes}</span>
        </button>
      </div>
    </div>
  </div>
);

const UpcomingCard = ({ title, subject, instructor, time, thumbnail }) => (
  <div className="flex gap-3 p-3 rounded-lg bg-gray-900 hover:bg-gray-800 cursor-pointer transition-colors">
    <img src={thumbnail} alt={title} className="w-40 h-24 object-cover rounded-lg" />
    <div className="flex-1">
      <div className="text-xs text-gray-400 mb-1">{subject}</div>
      <h4 className="text-white font-medium text-sm mb-2 line-clamp-2">{title}</h4>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{instructor}</span>
        <div className="flex items-center gap-1 text-blue-400">
          <Clock className="w-3 h-3" />
          <span>{time}</span>
        </div>
      </div>
    </div>
  </div>
);

const UpcomingLectureCard = ({ title, subject, instructor, time, thumbnail }) => (
  <div className="relative rounded-xl overflow-hidden cursor-pointer group bg-gray-900">
    <div className="relative">
      <img src={thumbnail} alt={title} className="w-full h-48 object-cover" style={{ aspectRatio: '16/9' }} />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
          <Clock className="w-8 h-8 text-black" />
        </div>
      </div>
      <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
        <Clock className="w-3 h-3" />
        UPCOMING
      </div>
    </div>
    <div className="p-4">
      <div className="text-xs text-gray-400 mb-2">{subject}</div>
      <h3 className="text-white font-semibold text-base mb-2 line-clamp-2">{title}</h3>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{instructor}</span>
        <div className="flex items-center gap-1 text-blue-400">
          <Clock className="w-3 h-3" />
          <span>{time}</span>
        </div>
      </div>
    </div>
  </div>
);

export default function LectureCastPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [likedLectures, setLikedLectures] = useState(new Set());
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [lectureLikeCounts, setLectureLikeCounts] = useState({});

  const liveLectures = [
    {
      title: 'Advanced Database Management Systems - Normalization and Query Optimization',
      subject: 'Database Management',
      instructor: 'Dr. Priya Sharma',
      duration: 'LIVE',
      views: '234',
      likes: '45',
      thumbnail: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=300&fit=crop',
      date: 'Today',
      isLive: true
    },
    {
      title: 'Machine Learning Fundamentals - Neural Networks Deep Dive',
      subject: 'AI/ML',
      instructor: 'Prof. Rajesh Kumar',
      duration: 'LIVE',
      views: '456',
      likes: '89',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
      date: 'Today',
      isLive: true
    }
  ];

  const recentLectures = [
    {
      title: 'Operating Systems - Process Scheduling Algorithms',
      subject: 'Operating Systems',
      instructor: 'Dr. Amit Verma',
      duration: '1:24:35',
      views: '1.2K',
      likes: '156',
      thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&h=300&fit=crop',
      date: 'Yesterday',
      isLive: false
    },
    {
      title: 'Digital Electronics - Logic Gates and Boolean Algebra',
      subject: 'Digital Electronics',
      instructor: 'Prof. Sneha Patel',
      duration: '58:22',
      views: '890',
      likes: '124',
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
      date: '2 days ago',
      isLive: false
    },
    {
      title: 'Data Structures - Trees and Graph Algorithms',
      subject: 'Data Structures',
      instructor: 'Dr. Vikram Singh',
      duration: '1:45:12',
      views: '2.3K',
      likes: '287',
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
      date: '3 days ago',
      isLive: false
    },
    {
      title: 'Computer Networks - TCP/IP Protocol Suite',
      subject: 'Computer Networks',
      instructor: 'Prof. Anita Desai',
      duration: '1:15:48',
      views: '1.5K',
      likes: '198',
      thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop',
      date: '4 days ago',
      isLive: false
    }
  ];

  const popularLectures = [
    {
      title: 'Advanced Mathematics - Fourier Series and Transformations',
      subject: 'Mathematics II',
      instructor: 'Dr. Harshit Dua',
      duration: '2:15:30',
      views: '5.6K',
      likes: '892',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
      date: '1 week ago',
      isLive: false
    },
    {
      title: 'Robotics Engineering - Kinematics and Dynamics',
      subject: 'Robotics',
      instructor: 'Prof. Karan Malhotra',
      duration: '1:38:45',
      views: '3.4K',
      likes: '456',
      thumbnail: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=400&h=300&fit=crop',
      date: '1 week ago',
      isLive: false
    },
    {
      title: 'UI/UX Design - Principles and Best Practices',
      subject: 'Design',
      instructor: 'Pulkit Jhamb',
      duration: '1:12:20',
      views: '2.8K',
      likes: '378',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
      date: '2 weeks ago',
      isLive: false
    },
    {
      title: 'Analog Electronics - Operational Amplifiers',
      subject: 'Electronics',
      instructor: 'Dr. Kartik Malik',
      duration: '1:28:15',
      views: '2.1K',
      likes: '267',
      thumbnail: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop',
      date: '2 weeks ago',
      isLive: false
    }
  ];

  const upcomingLectures = [
    {
      title: 'Software Engineering - Agile Methodologies',
      subject: 'Software Engineering',
      instructor: 'Prof. Neha Gupta',
      time: 'In 2 hours',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
    },
    {
      title: 'Cloud Computing - AWS Services Overview',
      subject: 'Cloud Computing',
      instructor: 'Dr. Rohit Sharma',
      time: 'Tomorrow 10:00 AM',
      thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop'
    },
    {
      title: 'Microprocessors - 8086 Architecture',
      subject: 'Microprocessors',
      instructor: 'Prof. Anjali Reddy',
      time: 'Tomorrow 2:00 PM',
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop'
    },
    {
      title: 'Power Systems - Transmission Lines',
      subject: 'Electrical Engineering',
      instructor: 'Dr. Suresh Kumar',
      time: 'Oct 28, 11:00 AM',
      thumbnail: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop'
    }
  ];

  const filters = ['All', 'Live', 'Recorded', 'Upcoming', 'My Subjects'];
  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'views-high', label: 'Most Views' },
    { value: 'views-low', label: 'Least Views' },
    { value: 'likes-high', label: 'Most Likes' },
    { value: 'likes-low', label: 'Least Likes' }
  ];

  // Search functionality for lectures
  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Search in all lecture data
    const allLectures = [...liveLectures, ...recentLectures, ...popularLectures];
    const results = allLectures.filter(lecture => {
      const title = lecture.title?.toLowerCase() || '';
      const subject = lecture.subject?.toLowerCase() || '';
      const instructor = lecture.instructor?.toLowerCase() || '';
      const queryLower = query.toLowerCase();
      
      return title.includes(queryLower) || 
             subject.includes(queryLower) || 
             instructor.includes(queryLower);
    });

    setSearchResults(results);
    setIsSearching(false);
  };

  // Handle like functionality
  const handleLike = (lectureTitle, originalLikes) => {
    const wasLiked = likedLectures.has(lectureTitle);
    
    // Update liked lectures
    setLikedLectures(prev => {
      const newLiked = new Set(prev);
      if (wasLiked) {
        newLiked.delete(lectureTitle);
      } else {
        newLiked.add(lectureTitle);
      }
      return newLiked;
    });
    
    // Update like count
    setLectureLikeCounts(prevCounts => {
      const currentCount = prevCounts[lectureTitle] !== undefined 
        ? prevCounts[lectureTitle] 
        : parseInt(originalLikes.replace(/[^0-9]/g, '')) || 0;
      
      return {
        ...prevCounts,
        [lectureTitle]: wasLiked ? currentCount - 1 : currentCount + 1
      };
    });
  };

  // Sort lectures based on selected criteria
  const sortLectures = (lectures) => {
    if (sortBy === 'default') return lectures;
    
    return [...lectures].sort((a, b) => {
      const getNumericValue = (value) => {
        if (typeof value === 'string') {
          return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
        }
        return value || 0;
      };
      
      switch (sortBy) {
        case 'views-high':
          return getNumericValue(b.views) - getNumericValue(a.views);
        case 'views-low':
          return getNumericValue(a.views) - getNumericValue(b.views);
        case 'likes-high':
          return getNumericValue(b.likes) - getNumericValue(a.likes);
        case 'likes-low':
          return getNumericValue(a.likes) - getNumericValue(b.likes);
        default:
          return 0;
      }
    });
  };

  // Filter content based on selected tab
  const getFilteredContent = () => {
    switch (selectedFilter) {
      case 'Live':
        return {
          showLive: true,
          showRecent: false,
          showPopular: false,
          showUpcoming: false
        };
      case 'Recorded':
        return {
          showLive: false,
          showRecent: true,
          showPopular: true,
          showUpcoming: false
        };
      case 'Upcoming':
        return {
          showLive: false,
          showRecent: false,
          showPopular: false,
          showUpcoming: true
        };
      case 'My Subjects':
        return {
          showLive: false,
          showRecent: false,
          showPopular: true,
          showUpcoming: false
        };
      case 'All':
      default:
        return {
          showLive: true,
          showRecent: true,
          showPopular: true,
          showUpcoming: true
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
                placeholder="Search lectures by title, subject, instructor..."
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
            <Sun className="w-6 h-6 cursor-pointer hover:text-gray-400 transition-colors" />
            <Settings className="w-6 h-6 cursor-pointer hover:text-gray-400 transition-colors" />
            <Bell className="w-6 h-6 cursor-pointer hover:text-gray-400 transition-colors" />
            <div className="w-10 h-10 rounded-full bg-white cursor-pointer" />
          </div>
        </div>
      </header>

      <div className="flex w-full mx-auto px-6">
        {/* Sidebar */}
        <aside className="w-80 border-r border-gray-800 p-6 min-h-screen">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-gray-700" />
            <div>
              <h2 className="font-semibold">Harshit Dua</h2>
            </div>
          </div>

          <nav className="space-y-2 mb-8">
            <button onClick={() => onNavigate?.('notes')} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800">
              <Calendar className="w-5 h-5" />
              <span>NoteHive</span>
            </button>
            <button onClick={() => onNavigate?.('lectures')} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700">
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
                {searchResults.length} lecture{searchResults.length !== 1 ? 's' : ''} found
              </p>
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  {sortLectures(searchResults).map((lecture, index) => (
                    <LectureCard 
                      key={`search-${index}`} 
                      {...lecture} 
                      likes={lectureLikeCounts[lecture.title] !== undefined ? lectureLikeCounts[lecture.title].toString() : lecture.likes}
                      onLike={() => handleLike(lecture.title, lecture.likes)}
                      isLiked={likedLectures.has(lecture.title)}
                    />
                  ))}
                </div>
              ) : (
                !isSearching && (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No lectures found matching your search.</p>
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

          {/* Live Now Section */}
          {filteredContent.showLive && liveLectures.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                  <h2 className="text-2xl font-bold">Live Now</h2>
                </div>
                <button 
                  onClick={() => setSelectedFilter('Live')}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium cursor-pointer"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {sortLectures(liveLectures).map((lecture, index) => (
                  <LectureCard 
                    key={index} 
                    {...lecture} 
                    likes={lectureLikeCounts[lecture.title] !== undefined ? lectureLikeCounts[lecture.title].toString() : lecture.likes}
                    onLike={() => handleLike(lecture.title, lecture.likes)}
                    isLiked={likedLectures.has(lecture.title)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Lectures - Show above Recent when All is selected */}
          {filteredContent.showUpcoming && upcomingLectures.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <h2 className="text-2xl font-bold">Upcoming Lectures</h2>
                </div>
                <button 
                  onClick={() => setSelectedFilter('Upcoming')}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium cursor-pointer"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {upcomingLectures.map((lecture, index) => (
                  <UpcomingLectureCard key={index} {...lecture} />
                ))}
              </div>
            </div>
          )}

          {/* Recent Lectures */}
          {filteredContent.showRecent && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recent Lectures</h2>
                <button 
                  onClick={() => setSelectedFilter('Recorded')}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium cursor-pointer"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {sortLectures(recentLectures).map((lecture, index) => (
                  <LectureCard 
                    key={index} 
                    {...lecture} 
                    likes={lectureLikeCounts[lecture.title] !== undefined ? lectureLikeCounts[lecture.title].toString() : lecture.likes}
                    onLike={() => handleLike(lecture.title, lecture.likes)}
                    isLiked={likedLectures.has(lecture.title)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* My Subjects */}
          {filteredContent.showPopular && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">My Subjects</h2>
                <button 
                  onClick={() => setSelectedFilter('My Subjects')}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium cursor-pointer"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {sortLectures(popularLectures).map((lecture, index) => (
                  <LectureCard 
                    key={index} 
                    {...lecture} 
                    likes={lectureLikeCounts[lecture.title] !== undefined ? lectureLikeCounts[lecture.title].toString() : lecture.likes}
                    onLike={() => handleLike(lecture.title, lecture.likes)}
                    isLiked={likedLectures.has(lecture.title)}
                  />
                ))}
              </div>
            </div>
          )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}