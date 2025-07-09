import { Link } from "react-router-dom";
import facebook from "../../../public/facebook.png";
import instagram from "../../../public/instagram.png";
import youtube from "../../../public/youtube.png";
import PrivacyPolicyModal from "../PrivacyPolicyModal/PrivacyPolicyModal";
import { useState } from "react";
import TermsAndConditionsModal from "../TermsConditionsModal/TermsConditionsModal";

export default function Footer() {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const date = new Date();
  const year = date.getFullYear();

  const openModalPolicy = () => {
    setIsPrivacyModalOpen(true);
  };

  const closeModalPolicy = () => {
    setIsPrivacyModalOpen(false);
  };

  const openModalTerms = () => {
    setIsTermsModalOpen(true);
  };

  const closeModalTerms = () => {
    setIsTermsModalOpen(false);
  };

  return (
    <footer className="p-6 bg-zinc-900 text-white">
      <div className="container mx-auto text-center space-y-4">
        <div>
          <h2 className="text-xl font-semibold">AutoCars</h2>
          <p className="text-base text-gray-400">The best car deals in one place.</p>
        </div>

        <div className="flex justify-center space-x-6 text-sm">
          <a href="/about" className="hover:underline">
            About us
          </a>
          <a href="/contact" className="hover:underline">
            Contacts
          </a>
          <a href="/faq" className="hover:underline">
            Frequently Asked Questions
          </a>
        </div>

        <div className="flex justify-center space-x-4">
          <img src={facebook} alt="Facebook" className="h-6 w-6" />
          <img src={instagram} alt="Instagram" className="h-6 w-6" />
          <img src={youtube} alt="Twitter" className="h-6 w-6" />
        </div>

        <div className="text-sm text-gray-400">
          <p>© {year} AutoCars. All rights reserved.</p>
          <div className="flex justify-center space-x-4">
            <button onClick={openModalTerms} className="hover:underline">
              Terms & Conditions
            </button>
            <span>|</span>
            <button onClick={openModalPolicy} className="hover:underline">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
      <PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={closeModalPolicy} />
      <TermsAndConditionsModal isOpen={isTermsModalOpen} onClose={closeModalTerms} />
    </footer>
  );
}
