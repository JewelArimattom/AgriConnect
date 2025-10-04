import React, { useState } from "react";
import {
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiClock,
  HiChevronDown,
} from "react-icons/hi";
import {
  FaLeaf,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

// A reusable component for the FAQ accordion
const FaqAccordion = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-green-100 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-900 focus:outline-none group"
      >
        <span className="group-hover:text-green-600 transition-colors">
          {title}
        </span>
        <HiChevronDown
          className={`w-6 h-6 text-green-600 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="mt-4 text-gray-600 leading-relaxed pl-4 border-l-2 border-green-200">
          {children}
        </div>
      )}
    </div>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "customer-question",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend API
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We will get back to you shortly.");
    // Reset form
    setFormData({
      name: "",
      email: "",
      reason: "customer-question",
      message: "",
    });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header Section */}
      <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center py-24 px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
            <FaLeaf className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">
              We're Here to Help
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Get in <span className="text-yellow-300">Touch</span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-green-50 max-w-3xl mx-auto leading-relaxed">
            Have questions? We'd love to hear from you. Whether you're a farmer,
            customer, or partner, we're here to help.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-green-100 hover:border-green-300 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-xl">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <HiMail className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-600 mb-4">Drop us a message anytime</p>
            <a
              href="mailto:support@agriconnect.com"
              className="text-green-600 font-semibold hover:text-green-700 transition-colors"
            >
              support@agriconnect.com
            </a>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-xl">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <HiPhone className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600 mb-4">Mon-Sat, 9AM-6PM IST</p>
            <a
              href="tel:+911234567890"
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              +91 123-456-7890
            </a>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-xl">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <HiLocationMarker className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
            <p className="text-gray-600 mb-4">Come say hello at our office</p>
            <p className="text-purple-600 font-semibold">
              Pala, Kottayam, Kerala
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form Section */}
          <div className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Send Us a Message
            </h2>
            <p className="text-gray-600 mb-8">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full px-5 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-300"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-5 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-300"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Reason for Contact
                </label>
                <select
                  name="reason"
                  id="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="block w-full px-5 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-300 bg-white cursor-pointer"
                >
                  <option value="customer-question">Customer Question</option>
                  <option value="farmer-inquiry">
                    I'm a Farmer and want to join
                  </option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="feedback">Website Feedback</option>
                  <option value="support">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Your Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={6}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="block w-full px-5 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-300 resize-none"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-3 py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105"
                >
                  <span>Send Message</span>
                  <HiMail className="w-6 h-6" />
                </button>
              </div>
            </form>
          </div>

          {/* Info & FAQ Section */}
          <div className="space-y-10">
            {/* Quick Info Cards */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <HiClock className="w-6 h-6 mr-3 text-green-600" />
                Business Hours
              </h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between items-center py-2 border-b border-gray-300">
                  <span className="font-semibold">Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-300">
                  <span className="font-semibold">Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-semibold">Sunday</span>
                  <span className="text-red-600 font-semibold">Closed</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-green-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Connect With Us
              </h2>
              <p className="text-gray-600 mb-6">
                Follow us on social media for updates, tips, and community
                stories!
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-blue-100 hover:border-blue-300"
                >
                  <FaFacebook className="w-7 h-7 text-blue-600" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-sky-100 hover:border-sky-300"
                >
                  <FaTwitter className="w-7 h-7 text-sky-500" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-pink-100 hover:border-pink-300"
                >
                  <FaInstagram className="w-7 h-7 text-pink-600" />
                </a>
                <a
                  href="https://wa.me/911234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-green-100 hover:border-green-300"
                >
                  <FaWhatsapp className="w-7 h-7 text-green-600" />
                </a>
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                <FaqAccordion title="How is the produce delivered?">
                  <p className="text-gray-600 leading-relaxed">
                    We partner with local delivery services to bring your order
                    straight from the farm to your doorstep, typically within
                    24-48 hours of harvest to ensure maximum freshness.
                  </p>
                </FaqAccordion>
                <FaqAccordion title="How can I become a partner farmer?">
                  <p className="text-gray-600 leading-relaxed">
                    We're always looking for passionate local farmers to join
                    our platform! Please select "I'm a Farmer" in the contact
                    form above and tell us a bit about your farm. Our
                    partnership team will get in touch with you.
                  </p>
                </FaqAccordion>
                <FaqAccordion title="What makes your products different?">
                  <p className="text-gray-600 leading-relaxed">
                    Our products come directly from local farmers, eliminating
                    long supply chains. This means you get fresher, healthier
                    food while supporting your local economy and sustainable
                    farming practices.
                  </p>
                </FaqAccordion>
                <FaqAccordion title="Can I visit the farms?">
                  <p className="text-gray-600 leading-relaxed">
                    Yes! Many of our partner farmers welcome visitors. Contact
                    us to arrange a farm visit and see firsthand where your food
                    comes from.
                  </p>
                </FaqAccordion>
                <FaqAccordion title="What payment methods do you accept?">
                  <p className="text-gray-600 leading-relaxed">
                    We accept all major credit/debit cards, UPI, net banking,
                    and cash on delivery for your convenience.
                  </p>
                </FaqAccordion>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find Us on the Map
            </h2>
            <p className="text-lg text-gray-600">
              Visit our office in Pala, Kottayam, Kerala
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-green-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125565.04716796827!2d76.60688!3d9.7121!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0878e7ec59bee3%3A0xb5c2e940f6cf46c5!2sPala%2C%20Kerala!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="AgriConnect Office Location"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg shadow-xl overflow-hidden">
          {/* --- UPDATED MAP --- */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31481.39382216584!2d76.66981884735237!3d9.70993073068989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07cd8095b52321%3A0x336a55e69f37c356!2sPala%2C%20Kerala%2C%20India!5e0!3m2!1sen!2sus"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
