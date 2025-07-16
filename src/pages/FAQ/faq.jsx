import { useState, useEffect } from "react";

const faqs = [
  {
    question: "How do I reset my password?",
    answer: "To reset your password, go to the login page and click on 'Reset password'."
  },
  {
    question: "How do I contact support?",
    answer: "You can contact support by using the contact page."
  },
  {
    question: "How do I schedule an appointment for a test drive?",
    answer: "To schedule a test drive, please find the seller’s contact information in the car offer and get in touch to arrange a convenient time."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const containerStyles = {
    maxWidth: isMobile ? "100%" : "800px",
    margin: "0 auto",
    padding: isMobile ? "2rem 1rem" : "4rem 1rem",
    fontFamily: "Arial, sans-serif",
    textAlign: "center"
  };

  const headingStyles = {
    fontSize: isMobile ? "2rem" : "2.5rem",
    marginBottom: "0.5rem",
    fontWeight: "bold",
    color: "white"
  };

  const subheadingStyles = {
    fontSize: isMobile ? "1rem" : "1.2rem",
    color: "white",
    marginBottom: "2rem"
  };

  const faqListStyles = {
    textAlign: "left",
    paddingLeft: isMobile ? "1rem" : "0",
    paddingRight: isMobile ? "1rem" : "0"
  };

  const faqItemStyles = {
    backgroundColor: "#fff",
    width: isMobile ? "100%" : "600px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: "1.5rem",
    overflow: "hidden",
    transition: "all 0.3s ease"
  };

  const questionStyles = {
    padding: "1.5rem 2rem",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "600",
    fontSize: isMobile ? "1rem" : "1.1rem",
    color: "black"
  };

  const answerStyles = {
    padding: "1.25rem 2rem",
    backgroundColor: "#f9f9f9",
    borderTop: "1px solid #eee",
    width: isMobile ? "100%" : "600px",
    fontSize: "1rem",
    lineHeight: "1.6",
    color: "black"
  };

  return (
    <div style={containerStyles}>
      <h1 style={headingStyles}>
        Help & FAQ
      </h1>
      <p style={subheadingStyles}>
        Frequently asked questions
      </p>

      <div style={faqListStyles}>
        {faqs.map((faq, index) => {
          const isOpen = activeIndex === index;
          return (
            <div
              key={index}
              style={faqItemStyles}
            >
              <div
                onClick={() => toggleFAQ(index)}
                style={questionStyles}
              >
                {faq.question}
                <span
                  style={{
                    fontSize: "1.2rem",
                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease"
                  }}
                >
                  ▶
                </span>
              </div>
              {isOpen && (
                <div
                  style={answerStyles}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}