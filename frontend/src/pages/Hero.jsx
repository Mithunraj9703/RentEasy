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
        <div className="mt-8 max-w-xl">
          <div className="flex items-center  bg-white rounded-full shadow-md px-4 py-3">
            <input
              type="text"
              placeholder="Search destinations"
              className="flex-1 outline-none text-gray-700 placeholder-gray-400"
            />
            <button className="ml-3 bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="mx-auto max-w-7xl px-6 pb-16 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="cursor-pointer rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <img
              src={card.image}
              alt={card.title}
              className="h-64 w-full object-cover"
            />

            <div className="pt-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">
                  {card.title}
                </h3>
                <span className="text-sm">⭐ {card.rating}</span>
              </div>

              <p className="text-gray-500 text-sm">
                {card.location}
              </p>

              <p className="mt-1 text-gray-900">
                <span className="font-semibold">₹{card.price}</span> / night
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Hero;
