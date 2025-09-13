import React from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    {/* Header */}
    <header className="bg-white shadow-md sticky top-0 z-50">
    <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
    <h1 className="text-2xl font-bold text-blue-600">//To-Do: Debt</h1>
    <div className="space-x-4">
    <a
    href="/signin"
    className="bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold shadow hover:bg-gray-100 transition"
    >
    Sign In
    </a>
    <a
    href="/signup"
    className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-blue-700 transition"
    >
    Sign Up
    </a>
    </div>
    </div>
    </header>

    {/* Hero */}
    <section className="flex-1 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
    <div className="text-center px-6 py-16">
    <h2 className="text-4xl md:text-5xl font-bold mb-6">
    Take Control of Your Debts
    </h2>
    <p className="text-lg mb-8 max-w-xl mx-auto">
    Track your debts, set reminders, and stay organized. Simple and stress-free debt management.
    </p>
    <div className="flex justify-center space-x-4">
    <a
    href="/signin"
    className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-gray-100 transition"
    >
    Sign In
    </a>
    <a
    href="/signup"
    className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition"
    >
    Sign Up
    </a>
    </div>
    </div>
    </section>

    {/* Features */}
    <section className="py-16 bg-gray-100 text-center">
    <div className="max-w-4xl mx-auto px-6">
    <h3 className="text-3xl font-bold mb-8">Features</h3>
    <ul className="space-y-4">
    <li>📊 Track debts easily</li>
    <li>⏰ Get reminders for due dates</li>
    <li>📈 View progress and insights</li>
    </ul>
    </div>
    </section>

    {/* CTA */}
    <section className="py-16 bg-blue-600 text-white text-center">
    <h3 className="text-3xl font-bold mb-6">Ready to take control?</h3>
    <div className="flex justify-center space-x-4">
    <a
    href="/signin"
    className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold shadow hover:bg-gray-100 transition"
    >
    Sign In
    </a>
    <a
    href="/signup"
    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-blue-700 transition"
    >
    Sign Up
    </a>
    </div>
    </section>

    {/* Footer */}
    <footer className="bg-gray-900 text-gray-300 py-6 text-center">
    &copy; {new Date().getFullYear()} //To-Do: Debt
    </footer>
    </div>
  );
}
