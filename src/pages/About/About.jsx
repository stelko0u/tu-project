import React, { useState, useEffect } from "react";
import ab3 from "../../../public/team_meeting.jpg";
import ab2 from "../../../public/cars_slowdrive.mp4";

export default function About() {
  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen z-0">

      <div className="relative h-96">
         <video
           autoPlay
           loop
           muted
           playsInline
           className="absolute inset-0 w-full h-full object-cover"
         >
           <source src={ab2} type="video/mp4" />
           Your browser does not support the video tag.
         </video>

        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>

        <div className="relative z-20 flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Welcome to Our Community</h1>
            <p className="text-lg md:text-xl text-gray-300">
              Driving Your Dreams, One Car at a Time.
            </p>
          </div>
        </div>
      </div>

      <section className="py-16 px-8 container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
           <h2 className="text-3xl font-bold mb-6 text-[#168f7a]">Why Us?</h2>
           <p className="text-gray-300 leading-relaxed">
             We are passionate about connecting people with their perfect vehicle. With years of experience in the automotive industry, we've built a reputation for trust, transparency, and exceptional customer service. Our goal is to make your car buying experience smooth, enjoyable, and ultimately, rewarding.
           </p>
        </div>
      </section>

      <section className="py-16 px-8 bg-[#222222]">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-12 items-center">
          <div
            style={{ width: '450px', height: '300px' }}
            className="mx-auto rounded-lg overflow-hidden"
          >
            <img src={ab3} alt="Our Story" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6 text-[#168f7a]">Our Story</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              This website is a project created by three students as part of our university coursework. We embarked on this journey to deepen our understanding of web development and apply our skills in a practical way.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Driven by a shared interest in both technology and the automotive world, we aimed to build a platform that showcases our learning while exploring the features of a modern car sales website. It represents our dedication to learning and our first steps into creating real-world applications.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-8 container mx-auto">
        <div className="text-center mb-12">
           <h2 className="text-3xl font-bold mb-6 text-[#168f7a]">Our Mission and Values</h2>
           <p className="text-gray-300 max-w-2xl mx-auto">
             Our operations are guided by a set of core values that define who we are and how we serve our customers.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col items-center text-center">
            <div className="text-4xl text-[#168f7a] mb-4">👤</div>
            <h3 className="text-xl font-semibold mb-4 text-[#168f7a] text-center w-full">Customer Focus</h3>
            <p className="text-gray-300">
              We prioritize your needs and work tirelessly to exceed your expectations. Your satisfaction is our greatest reward.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col items-center text-center">
            <div className="text-4xl text-[#168f7a] mb-4">👁️</div>
            <h3 className="text-xl font-semibold mb-4 text-[#168f7a] text-center w-full">Transparency</h3>
            <p className="text-gray-300">
              We believe in honest and open communication throughout the entire process, from pricing to vehicle history.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col items-center text-center">
            <div className="text-4xl text-[#168f7a] mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-4 text-[#168f7a] text-center w-full">Quality Selection</h3>
            <p className="text-gray-300">
              We handpick our inventory to ensure every vehicle meets our high standards for reliability and performance.
            </p>
          </div>
        </div>
      </section>

      <section className="relative py-16 px-8 text-center bg-cover bg-center" style={{ backgroundImage: "url('/images/about-cta.jpg')" }}>
         <div className="absolute inset-0 bg-black opacity-70"></div>
         <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6 text-white">Ready to Find Your Next Car?</h2>
            <p className="text-gray-300 mb-8">
              Explore our extensive catalog or
               <a href="/contact" className="text-[#168f7a] hover:underline ml-1">
                contact us today</a>  to learn more.
             </p>
            <a href="/catalog" className="btn bg-[#168f7a] text-white text-lg px-8 py-3 rounded-md hover:bg-[#137a69] transition duration-300">
              View Catalog
            </a>
         </div>
      </section>

    </div>
  );
}