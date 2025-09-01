import React from 'react';
import NavBar from '../components/Navbar';

const AboutUs = () => {
  const teamData = [
    {
      id: 1,
      name: "Bineesh A Paul",
      position: "Investor & Consultant",
      image: "https://airambulance.s3.ap-south-1.amazonaws.com/AboutUsImages/Bineesh+A+Paul.jpg",
      description: "Bineesh A Paul on Charter flights aviation to make world super best in the services where we may not believe. make Super best comfort as like heaven on earth"
    },
    {
      id: 2,
      name: "David",
      position: "Chief Technology Officer",
      image: "https://airambulance.s3.ap-south-1.amazonaws.com/AboutUsImages/david.png",
      description: "Leadership is practiced not so much in words as in attitude and in actions.charter flights aviation give the excellent opportunity of all people to be in the best and we are 24/7."
    },
    {
      id: 3,
      name: "Boaz Jens",
      position: "Legal Officer",
      image: "https://airambulance.s3.ap-south-1.amazonaws.com/AboutUsImages/LEGAL+OFFICER+of+cfa.jpg",
      description: "Ethics is knowing the difference between what you have a right to do and what is right to do."
    },
    {
      id: 4,
      name: "Rory Noah",
      position: "Chief Operating officer",
      image: "https://airambulance.s3.ap-south-1.amazonaws.com/AboutUsImages/chief+operating+officer+cfa.jpg",
      description: "Our action to this world and scope of space , indeed action to crate the wonder of wonderful with in our clay of the life span , our operation is not like other it is classical differed on the dreams , there for we will make on top of the world your deserve it ."
    },
    {
      id: 5,
      name: "Oliver Max",
      position: "Director",
      image: "https://airambulance.s3.ap-south-1.amazonaws.com/AboutUsImages/cfadirector.jpg",
      description: "The world of smile and care is the my prisioues gift i ile to give you , because you are worth to get , its not free but its graded < charter flights aviation there for the smile of your life . We sure , we will be able to achieve the best , thats why we are the super best"
    },
    {
      id: 6,
      name: "Riley James",
      position: "Chief Executive Officer",
      image: "https://airambulance.s3.ap-south-1.amazonaws.com/AboutUsImages/ceo.png",
      description: "My plans and Dreams to take you all to next Galaxy of comfort and peace an wellbeing , a new world of heaven."
    },
  ];
  return (
    <div className="min-h-screen bg-gray-50">
  

      {/* About Us Section */}
      <div className="relative">
        {/* Hero Section with Background Image */}
        <div className="relative h-64 lg:h-80 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
            }}
          ></div>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">About Us</h1>
          </div>
        </div>

        {/* Company Description */}
        <div className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8">
                We're best in the world and we truly dedicated to make your air travel experience as much simple and fun as possible!
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Bringing you a modern, comfortable, and connected travel experience is one of our highest priorities and that's why we continuously try to improve your experience when you book anything with us.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We really appreciate and welcome any suggestions you might have for us, so feel free to drop us a line anytime. Our commitment to excellence drives us to constantly innovate and enhance our services, ensuring that every journey with us exceeds your expectations. From seamless booking processes to premium in-flight amenities, we strive to create memorable experiences that keep you coming back.
              </p>
            </div>
          </div>
        </div>

        {/* Our History Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-16">Our History</h2>
            
            <div className="max-w-7xl mx-auto space-y-16">
            <div className="max-w-7xl mx-auto space-y-16">
              {teamData.map((member, index) => (
                <div key={member.id} className="grid lg:grid-cols-3 gap-8 items-center">
                  {/* Text Section */}
                  <div className={`lg:px-8 ${index % 2 === 1 ? 'order-3 lg:order-3' : 'order-3 lg:order-1'}`}>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {member.description}
                    </p>
                  </div>
                  
                  {/* Image Section - Always in center */}
                  <div className="text-center order-1 lg:order-2">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-64 h-48 lg:w-72 lg:h-56 rounded-2xl object-cover mx-auto shadow-lg"
                    />
                  </div>
                  
                  {/* Name and Position Section */}
                  <div className={`text-center lg:px-8 ${index % 2 === 1 ? 'order-2 lg:order-1' : 'order-2 lg:order-3'} ${index % 2 === 1 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">{member.name}</h3>
                    <p className="text-purple-600 font-medium text-lg">{member.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AboutUs;