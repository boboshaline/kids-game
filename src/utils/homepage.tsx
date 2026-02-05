import React from "react";

const games = [
  { age: "2-4 years", title: "Shape Explorer", color: "bg-yellow-200", textColor: "text-yellow-900" },
  { age: "4-6 years", title: "Color Adventure", color: "bg-pink-200", textColor: "text-pink-900" },
  { age: "6+ years", title: "Word Quest", color: "bg-green-200", textColor: "text-green-900" },
];

const whyPlay = [
  { title: "Learn Through Fun", desc: "Kids develop skills while playing exciting games." },
  { title: "Creativity Boost", desc: "Games encourage imagination and creative thinking." },
  { title: "Friendly Environment", desc: "Safe and welcoming space for kids to explore." },
];

export  function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 text-gray-900 p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-purple-800">Play2Learn</h1>
        <nav className="space-x-6">
          <a href="#" className="hover:text-purple-600 font-semibold">Games</a>
          <a href="#" className="hover:text-purple-600 font-semibold">About</a>
          <a href="#" className="hover:text-purple-600 font-semibold">Parents</a>
          <a href="#" className="hover:text-purple-600 font-semibold">Contact</a>
        </nav>
      </header>

      {/* Games Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {games.map((game) => (
          <div
            key={game.title}
            className={`rounded-2xl p-6 ${game.color} ${game.textColor} flex flex-col justify-between shadow-lg transform hover:scale-105 transition`}
          >
            <span className="text-sm opacity-80">{game.age}</span>
            <h2 className="text-2xl font-bold mt-2">{game.title}</h2>
            <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition">
              Play Now
            </button>
          </div>
        ))}
      </section>

      {/* Why Play Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-purple-800">Why Play2Learn?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {whyPlay.map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-bold text-xl mb-2 text-purple-700">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
