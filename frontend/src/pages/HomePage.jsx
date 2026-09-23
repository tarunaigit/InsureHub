import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Navbar } from '../components/Navbar';
import { Shield, Users, Heart, Zap, Clock, Globe, CheckCircle } from 'lucide-react';

const categories = [
  { name: 'Health Insurance', icon: Heart, color: 'text-red-500', bg: 'bg-red-50', desc: 'Comprehensive health coverage' },
  { name: 'Vehicle Insurance', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50', desc: 'Auto & bike protection' },
  { name: 'Life Insurance', icon: Shield, color: 'text-green-500', bg: 'bg-green-50', desc: 'Family financial security' },
  { name: 'Home Insurance', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50', desc: 'Property & belongings' },
  { name: 'Travel Insurance', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50', desc: 'Trip protection worldwide' },
  { name: 'Family Insurance', icon: Users, color: 'text-pink-500', bg: 'bg-pink-50', desc: 'Complete family coverage' }
];

const features = [
  { icon: CheckCircle, title: 'Secure & Reliable', desc: 'Bank-grade encryption and security' },
  { icon: CheckCircle, title: 'Affordable Plans', desc: 'Competitive premiums for every budget' },
  { icon: CheckCircle, title: 'Easy Claims', desc: 'Simple, fast, and transparent process' },
  { icon: CheckCircle, title: '24/7 Support', desc: 'Round-the-clock customer assistance' },
  { icon: CheckCircle, title: 'Quick Processing', desc: 'Instant policy issuance online' },
  { icon: CheckCircle, title: 'Online Access', desc: 'Manage everything from your dashboard' }
];

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 via-white to-teal-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
              InsureHub - Your Trusted Insurance Partner
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Your Life,<br />
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Our Priority</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Insurance for a safer and brighter tomorrow. Protect what matters most with our comprehensive insurance solutions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/plans">
                <Button size="lg" variant="primary" className="w-full sm:w-auto">
                  Get Protected
                </Button>
              </Link>
              <Link to="/plans">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Explore Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Insurance Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Choose from our wide range of insurance products tailored to your needs</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link key={index} to="/plans" className="group">
                  <Card className="h-full p-6 group-hover:border-blue-200 transition-colors">
                    <div className={`w-14 h-14 rounded-xl ${category.bg} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                      <Icon className={`w-7 h-7 ${category.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{category.name}</h3>
                    <p className="text-gray-500 text-sm">{category.desc}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose InsureHub?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We make insurance simple, affordable, and accessible for everyone</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 text-center h-full">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">200+</div>
              <div className="text-blue-100">Insurance Plans</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99%</div>
              <div className="text-blue-100">Claim Settlement</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Protected?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">Join thousands of satisfied customers who trust InsureHub for their insurance needs.</p>
          <Link to="/plans">
            <Button size="lg" variant="primary" className="w-full sm:w-auto">
              Explore Our Plans
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold">InsureHub</span>
              </div>
              <p className="text-gray-400 text-sm">Secure Today • Brighter Tomorrow</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/plans" className="hover:text-white">Health Insurance</a></li>
                <li><a href="/plans" className="hover:text-white">Vehicle Insurance</a></li>
                <li><a href="/plans" className="hover:text-white">Life Insurance</a></li>
                <li><a href="/plans" className="hover:text-white">Home Insurance</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">FAQs</a></li>
                <li><a href="#" className="hover:text-white">Claims Process</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2024 InsureHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}