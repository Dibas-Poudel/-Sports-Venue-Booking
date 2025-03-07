import React from "react";

const Contact = () => {
  return (
    <section className="relative bg-gray-900 text-white py-16 px-6">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg')" }}></div>

      <div className="relative max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-6">Get in Touch</h2>
        <p className="text-lg text-gray-300 text-center mb-12">
          Have any questions or inquiries? Contact us now!
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Send Us a Message</h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <textarea
                rows="4"
                placeholder="Your Message"
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              ></textarea>
              <button className="w-full bg-yellow-500 text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition duration-300">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col justify-center">
            <h3 className="text-2xl font-semibold mb-4">Contact Information</h3>
            <p className="text-gray-300">
              📍 Location: Dang, Nepal  
            </p>
            <p className="text-gray-300 mt-2">
              📞 Phone: +977-9800000000  
            </p>
            <p className="text-gray-300 mt-2">
              ✉️ Email: contact@dibassports.com  
            </p>
            <p className="text-gray-300 mt-4">
              🕒 Working Hours: Sun - Fri: 9:00 AM - 7:00 PM  
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
