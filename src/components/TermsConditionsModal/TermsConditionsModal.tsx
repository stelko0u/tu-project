import React, { useEffect } from "react";
import Modal from "react-modal";

export default function TermsAndConditionsModal({ isOpen, onClose }) {
  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Terms and Conditions"
      shouldCloseOnOverlayClick={true}
      className="bg-primary p-6 rounded-lg shadow-lg max-w-lg w-full z-20 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md flex justify-center items-center z-10"
    >
      <div>
        <h2 className="text-xl font-semibold">Terms and Conditions</h2>
        <div className="mt-4 max-h-96 overflow-y-auto">
          <p>
            <strong>Effective Date:</strong> [Insert Date]
          </p>

          <p>
            Welcome to [Your Website Name]. These Terms and Conditions ("Terms") govern your access
            to and use of our website, [Your Website URL], and the services we provide related to
            buying and selling cars. By accessing or using our website, you agree to comply with
            these Terms.
          </p>

          <h3 className="font-semibold mt-4">1. Acceptance of Terms</h3>
          <p>
            By using this website and our services, you agree to these Terms and our Privacy Policy.
            If you do not agree to these Terms, you should not use our website.
          </p>

          <h3 className="font-semibold mt-4">2. Use of Our Services</h3>
          <p>
            Our website allows users to buy and sell cars. You agree to use our services only for
            lawful purposes and in accordance with these Terms. You must not use our services in a
            way that violates any laws or regulations.
          </p>

          <h3 className="font-semibold mt-4">3. Account Registration</h3>
          <p>
            To access certain features of our website, you may need to register an account. You are
            responsible for maintaining the confidentiality of your account credentials and agree to
            notify us immediately of any unauthorized use of your account.
          </p>

          <h3 className="font-semibold mt-4">4. User Responsibilities</h3>
          <p>
            You agree to provide accurate and complete information when using our services,
            including when you post vehicle listings, purchase a car, or communicate with other
            users. You are solely responsible for the content you submit, and we reserve the right
            to remove or modify any content that violates these Terms.
          </p>

          <h3 className="font-semibold mt-4">5. Transactions</h3>
          <p>
            When you buy or sell a car through our website, you enter into a binding agreement with
            the other party. You are responsible for ensuring that all transactions are lawful and
            complete. We are not a party to any transaction between buyers and sellers and are not
            liable for any disputes arising from such transactions.
          </p>

          <h3 className="font-semibold mt-4">6. Payment</h3>
          <p>
            All payments for transactions conducted on our website must be processed through the
            designated payment system. You agree to provide accurate payment information and
            understand that we may charge fees for certain services.
          </p>

          <h3 className="font-semibold mt-4">7. Prohibited Conduct</h3>
          <p>You may not use our website to:</p>
          <ul className="list-disc pl-6">
            <li>Engage in any illegal activity</li>
            <li>Upload, post, or distribute harmful content</li>
            <li>Impersonate any other person or entity</li>
            <li>Transmit viruses, malware, or other harmful code</li>
          </ul>

          <h3 className="font-semibold mt-4">8. Limitation of Liability</h3>
          <p>
            To the fullest extent permitted by law, we are not responsible for any direct, indirect,
            incidental, special, or consequential damages arising from your use of our website or
            services.
          </p>

          <h3 className="font-semibold mt-4">9. Indemnification</h3>
          <p>
            You agree to indemnify and hold [Your Website Name], its affiliates, and employees
            harmless from any claims, losses, liabilities, and expenses arising from your violation
            of these Terms or your use of our website.
          </p>

          <h3 className="font-semibold mt-4">10. Termination</h3>
          <p>
            We reserve the right to suspend or terminate your access to our website at any time,
            without notice, for any reason, including if we believe you have violated these Terms.
          </p>

          <h3 className="font-semibold mt-4">11. Governing Law</h3>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of [Your
            Jurisdiction]. Any disputes arising out of these Terms or your use of our website will
            be resolved in the courts located in [Your Jurisdiction].
          </p>

          <h3 className="font-semibold mt-4">12. Changes to Terms</h3>
          <p>
            We may update these Terms from time to time. Any changes will be posted on this page
            with an updated "Effective Date." Please review these Terms periodically to stay
            informed about any updates.
          </p>

          <h3 className="font-semibold mt-4">13. Contact Us</h3>
          <p>If you have any questions or concerns about these Terms, please contact us at:</p>
          <p>[Your Website Name]</p>
          <p>Email: [Your Contact Email]</p>
          <p>Phone: [Your Contact Phone Number]</p>
          <p>Address: [Your Company Address]</p>
        </div>
        <button onClick={onClose} className="mt-4 p-2 bg-red-500 text-white rounded-lg">
          Close
        </button>
      </div>
    </Modal>
  );
}
