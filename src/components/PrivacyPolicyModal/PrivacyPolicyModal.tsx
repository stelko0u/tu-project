import React from "react";
import Modal from "react-modal";

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Privacy Policy"
      shouldCloseOnOverlayClick={true}
      className="bg-primary p-6 rounded-lg shadow-lg max-w-lg w-full z-20 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md flex justify-center items-center z-10"
    >
      <div>
        <h2 className="text-xl font-semibold">Privacy Policy</h2>
        <div className="mt-4 max-h-96 overflow-y-auto">
          <p>
            <strong>Effective Date:</strong> [Insert Date]
          </p>

          <p>
            At [Your Website Name] ("we," "our," or "us"), we value your privacy and are committed
            to protecting your personal information. This Privacy Policy outlines the types of
            personal information we collect, how we use it, and the steps we take to safeguard your
            information when you use our website, [Your Website URL], to buy and sell cars.
          </p>

          <p>
            By using our services, you agree to the collection and use of information in accordance
            with this Privacy Policy.
          </p>

          <h3 className="font-semibold mt-4">1. Information We Collect</h3>
          <p>
            We may collect the following types of information when you visit our website or use our
            services:
          </p>
          <ul className="list-disc pl-6">
            <li>
              <strong>Personal Information:</strong> This includes any information that identifies
              you personally, such as your name, email address, phone number, physical address, and
              payment information.
            </li>
            <li>
              <strong>Transaction Information:</strong> When you buy or sell a car, we collect
              details related to the transaction, such as vehicle information, payment details, and
              buyer/seller communications.
            </li>
            <li>
              <strong>Log Data:</strong> Like many websites, we collect information sent by your
              browser each time you visit our site. This may include your IP address, browser type,
              operating system, referring/exit pages, and date/time stamps.
            </li>
            <li>
              <strong>Cookies and Tracking Technologies:</strong> We may use cookies, web beacons,
              and other technologies to enhance your experience, analyze website traffic, and track
              usage patterns.
            </li>
          </ul>

          <h3 className="font-semibold mt-4">2. How We Use Your Information</h3>
          <p>We may use the information we collect for the following purposes:</p>
          <ul className="list-disc pl-6">
            <li>To facilitate car buying and selling transactions</li>
            <li>To communicate with you regarding your account, transactions, or inquiries</li>
            <li>To personalize your experience and improve our services</li>
            <li>To process payments and prevent fraud</li>
            <li>To send you marketing communications, if you have opted in</li>
            <li>To comply with legal obligations and resolve disputes</li>
          </ul>

          <h3 className="font-semibold mt-4">3. Data Sharing and Disclosure</h3>
          <p>
            We do not sell, trade, or rent your personal information to third parties. However, we
            may share your information in the following circumstances:
          </p>
          <ul className="list-disc pl-6">
            <li>
              <strong>Service Providers:</strong> We may share your information with third-party
              service providers who assist us in operating our website, processing payments, and
              providing services (e.g., hosting, marketing, analytics).
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your information if required by
              law, or if we believe such action is necessary to comply with legal processes, protect
              our rights, or prevent illegal activities.
            </li>
            <li>
              <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of
              assets, your information may be transferred to the new owner or entity.
            </li>
          </ul>

          <h3 className="font-semibold mt-4">4. Data Security</h3>
          <p>
            We take reasonable precautions to protect your personal information from unauthorized
            access, use, or disclosure. However, no method of transmission over the internet or
            electronic storage is 100% secure, and we cannot guarantee the absolute security of your
            data.
          </p>

          <h3 className="font-semibold mt-4">5. Your Rights and Choices</h3>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6">
            <li>
              <strong>Access and Correct Your Information:</strong> You may request access to the
              personal information we have on file and request that we update or correct any
              inaccuracies.
            </li>
            <li>
              <strong>Delete Your Information:</strong> You can request the deletion of your
              personal information, subject to certain legal restrictions.
            </li>
            <li>
              <strong>Opt-Out of Marketing Communications:</strong> If you no longer wish to receive
              marketing communications from us, you can opt out by following the instructions in our
              emails or contacting us directly.
            </li>
            <li>
              <strong>Cookies and Tracking Technologies:</strong> You can modify your browser
              settings to refuse cookies or alert you when cookies are being sent. However, some
              features of our website may not function properly without cookies.
            </li>
          </ul>

          <h3 className="font-semibold mt-4">6. Third-Party Links</h3>
          <p>
            Our website may contain links to third-party websites. We are not responsible for the
            privacy practices or content of these external sites. We encourage you to read their
            privacy policies before providing any personal information.
          </p>

          <h3 className="font-semibold mt-4">7. Children's Privacy</h3>
          <p>
            Our services are not intended for individuals under the age of 13, and we do not
            knowingly collect personal information from children. If we become aware that we have
            inadvertently collected personal information from a child under 13, we will take steps
            to delete that information as soon as possible.
          </p>

          <h3 className="font-semibold mt-4">8. Changes to This Privacy Policy</h3>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices
            or legal requirements. We will post any updates on this page with a revised "Effective
            Date." We encourage you to review this policy periodically to stay informed about how we
            are protecting your information.
          </p>

          <h3 className="font-semibold mt-4">9. Contact Us</h3>
          <p>
            If you have any questions or concerns about this Privacy Policy or our practices, please
            contact us at:
          </p>
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
