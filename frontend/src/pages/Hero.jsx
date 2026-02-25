import { useEffect, useState } from "react";
import { getListing, searchListing } from "../api/listing";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const cards = [
    {
      title: "Luxury Villa",
      location: "Goa, India",
      price: "7,500",
      rating: "4.8",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    },
    {
      title: "Cozy Apartment",
      location: "Bangalore, India",
      price: "3,200",
      rating: "4.6",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
    },
    {
      title: "Mountain Cabin",
      location: "Manali, India",
      price: "5,000",
      rating: "4.9",
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    },
    {
      title: "Beach House",
      location: "Kerala, India",
      price: "6,200",
      rating: "4.7",
      image: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353",
    },
  ];
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const generateSuggestions = () => {
    if (!listings || listings.length === 0) return;

    const shuffled = [...listings]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    setSuggestions(shuffled);
  };

  const handleFocus = () => {
    generateSuggestions();
    setShowDropdown(true);
  };

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    const res = await searchListing(searchText);
    // console.log(res.searchMatches || []);
    setSearchResult(res?.searchMatches)// backend call handled elsewhere
    setShowDropdown(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await getListing();

        console.log("API response:", data);
        setListings(data?.listings || []);

      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData()
  }, []);

  const handleClick = (id) => {
    navigate(`/listing/${id}`);
  };
  return (
    <section className="bg-gray-50">
      {/* Hero Banner */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900">
          Find your next stay
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Discover unique homes, experiences, and places around the world
        </p>

        {/* 🔍 Search Box */}
        <div className="mt-8 max-w-xl relative">

          {/* Search Box */}
          <div className="flex items-center bg-white rounded-full shadow-md px-4 py-3">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={handleFocus}
              placeholder="Search destinations"
              className="flex-1 outline-none text-gray-700 placeholder-gray-400"
            />

            <button
              onClick={handleSearch}
              className="ml-3 bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800"
            >
              <Search size={18} />
            </button>
          </div>

          {/* Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-xl mt-2 z-50">
              {suggestions.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSearchText(item.address);
                    setShowDropdown(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {item.address}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Cards Grid */}
      <div >
        <div className="mx-auto max-w-7xl px-6 pb-16">

          {/* Loading State */}
          {loading && (
            <p className="text-center text-gray-500 py-10">
              Loading listings...
            </p>
          )}

          {/* Empty State */}
          {!loading && listings?.length === 0 && (
            <p className="text-center text-gray-500 py-10">
              No listings available
            </p>
          )}

          {/* Listings Grid */}
          {!loading && listings?.length > 0 && (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {listings.map((listing) => (
                <div
                  key={listing._id}
                  onClick={() => handleClick(listing._id)}
                  className="cursor-pointer rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 bg-white shadow"
                >
                  <img
                    src={listing.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"}
                    alt={listing.title}
                    className="h-64 w-full object-cover"
                  />

                  <div className="pt-3 px-2 pb-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900 truncate">
                        {listing.title}
                      </h3>

                      {listing.available && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Available
                        </span>
                      )}
                    </div>

                    <p className="text-gray-500 text-sm truncate">
                      {listing.address}
                    </p>

                    <p className="mt-1 text-gray-900">
                      <span className="font-semibold">₹{listing.rent}</span> / night
                    </p>

                    <p className="text-xs text-gray-400 capitalize mt-1">
                      {listing.type} room
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </section>
  );
}

export default Hero;
