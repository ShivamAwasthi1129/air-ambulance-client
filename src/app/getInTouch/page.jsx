"use client"
import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaChevronDown, FaChevronUp, FaSpinner } from 'react-icons/fa';


const GetInTouch = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [activeAccordion, setActiveAccordion] = useState(null);

  const faqData = [
    {
      question: "Charter flight privet jets cost in Germany?",
      answer: "Charter flight costs for private jets in Germany vary depending on aircraft type, flight duration, and destination. Typically, light jets start from €2,500-€4,000 per hour, while heavy jets can cost €6,000-€12,000 per hour."
    },
    {
      question: "How much does a charter flight cost in Germany?",
      answer: "Charter flight costs in Germany depend on various factors including aircraft size, flight distance, and additional services. Domestic flights within Germany typically range from €3,000-€15,000, while international flights can cost significantly more."
    },
    {
      question: "How much does it cost to hire a private jet in Germany?",
      answer: "Hiring a private jet in Germany costs between €2,500-€15,000 per hour depending on the aircraft type. Light jets are most economical, while luxury heavy jets command premium rates. Additional costs may include landing fees, catering, and ground transportation."
    },
    {
      question: "Who have private jet in Germany?",
      answer: "Private jet ownership in Germany includes business executives, celebrities, high-net-worth individuals, and corporations. Many German companies and wealthy individuals use private aviation for business efficiency and privacy."
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  };

  const handleSubmit = async () => {
    
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const emailBody = `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message.replace(/\n/g, '<br>')}</p>
      `;

      const payload = {
        to: `${formData.email}`,
        subject: `Request from Website - ${formData.name}`,
        html: emailBody
      };

      await fetch("https://ow91reoh80.execute-api.ap-south-1.amazonaws.com/air/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      showToast('Message sent successfully!', 'success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
       <div className="min-h-screen bg-gray-50 max-w-7xl mx-auto mt-12">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          toast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}
      {/* Get in Touch Section */}
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Side - Contact Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-purple-600 mb-6">
                Get in Touch
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Charter flights aviation having wide range of air services such as private jet,Busiess jet,Charter flights, 
                Air charter, Air cargo,Air ambulance, helicopter and many more. These services you can avail at the best cost
                 compare to any of the other companies. More over we have wide range of access across the world even we are good 
                 to land with out airstrips, We have well experienced team they can fulfill your needs and they can handle any emergency 
                 situations.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-6 h-6 text-purple-600 mt-1">
                  <FaMapMarkerAlt className="w-full h-full" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Our Office</h3>
                  <p className="text-gray-600">
                    Terminal 1A, Vip Controller Center, Suite No 2, 8/148 <br />
                    Merum Nager, Aerocity, Delhi - 110037
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-6 h-6 text-purple-600 mt-1">
                  <FaPhoneAlt className="w-full h-full" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Contact Us</h3>
                  <p className="text-gray-600">+917982863597</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200 outline-none"
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email ID"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200 outline-none"
                  required
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Message"
                  rows="6"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200 outline-none resize-none"
                  required
                ></textarea>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-purple-800 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin w-4 h-4" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              You've got Questions,<br />
              We've got <span className="text-purple-600">Answer</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
                  >
                    <span className="font-semibold text-gray-800 text-lg pr-4">
                      {faq.question}
                    </span>
                    <div className="flex-shrink-0 w-5 h-5 text-purple-600">
                      {activeAccordion === index ? (
                        <FaChevronUp className="w-full h-full" />
                      ) : (
                        <FaChevronDown className="w-full h-full" />
                      )}
                    </div>
                  </button>
                  
                  <div className={`transition-all duration-300 ease-in-out ${
                    activeAccordion === index 
                      ? 'max-h-96 opacity-100' 
                      : 'max-h-0 opacity-0 overflow-hidden'
                  }`}>
                    <div className="px-6 pb-5">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
   
   
  );
};

export default GetInTouch;