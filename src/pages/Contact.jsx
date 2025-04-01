import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from 'react-toastify'; 

const Contact = () => {
  const serviceId = import.meta.env.VITE_SERVICE_ID;
  const templateId = import.meta.env.VITE_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_PUBLIC_KEY;

  const form = useRef();
  const [loading, setLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(serviceId, templateId, form.current, publicKey)
      .then(
        (result) => {
          console.log(result.text);
          toast.success("Message sent successfully!"); 
        },
        (error) => {
          console.log(error.text);
          toast.error("Something went wrong. Please try again."); 
        }
      )
      .finally(() => {
        setLoading(false);
        form.current.reset(); 
      });
  };

  return (
    <section className="relative bg-gray-900 text-white py-16 px-6">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg')",
        }}
      ></div>

      <div className="relative max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-6">Get in Touch</h2>
        <p className="text-lg text-gray-300 text-center mb-12">
          Have any questions or inquiries? Contact us now!
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Send Us a Message</h3>
            <form ref={form} onSubmit={sendEmail} className="space-y-4">
              <input
                type="text"
                name="from_name"
                placeholder="Your Name"
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
              <input
                type="email"
                name="from_email"
                placeholder="Your Email"
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
              <textarea
                name="message"
                rows="4"
                placeholder="Your Message"
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              ></textarea>
              <button
                type="submit"
                className={`w-full bg-yellow-500 text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col justify-center">
            <h3 className="text-2xl font-semibold mb-4">Contact Information</h3>
            <p className="text-gray-300">📍 Location: Dang, Nepal</p>
            <p className="text-gray-300 mt-2">📞 Phone: +977-9800000000</p>
            <p className="text-gray-300 mt-2">✉️ Email: contact@dibassports.com</p>
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
