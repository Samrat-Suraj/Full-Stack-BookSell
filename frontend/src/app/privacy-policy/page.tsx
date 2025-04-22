import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white mt-7 mb-7 rounded-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
      <p className="text-gray-700 text-base mb-6">
        At <span className="font-semibold">BookSell.In</span>, your privacy is our priority. This Privacy Policy outlines how we collect, use, and protect your personal information.
      </p>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Information We Collect</h2>
          <p className="text-gray-600">
            When you register on our site or place an order, we collect essential details such as your name, email, mailing address, phone number, and payment information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">2. How We Use Your Information</h2>
          <p className="text-gray-600">
            Your information helps us process transactions, enhance your user experience, and provide updates on orders, promotions, and new offerings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Sharing Your Information</h2>
          <p className="text-gray-600">
            We do not sell, trade, or transfer your personal data to third parties without your consent, except as necessary to fulfill orders or comply with legal obligations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Security of Your Information</h2>
          <p className="text-gray-600">
            We employ industry-standard security measures to safeguard your personal data from unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Changes to Our Privacy Policy</h2>
          <p className="text-gray-600">
            We may update this policy periodically. Significant changes will be communicated via email or a prominent notice on our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">6. Contact Us</h2>
          <p className="text-gray-600">
            For any questions regarding this Privacy Policy, please reach out to us at
            <span className="text-blue-600 font-medium"> support@bookcafe.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;