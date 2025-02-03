// pages/terms.js

export default function TermsAndConditions() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

      {/* Introduction */}
      <p className="mb-4">
        Welcome to Hexerve IT Solutions! These terms and conditions outline the rules and regulations for the use of Hexerve IT Solutions’ website, located at <a href="https://hexerve.com" className="text-blue-600 hover:underline">https://hexerve.com</a>.
      </p>
      <p className="mb-4">
        By accessing this website, we assume you accept these terms and conditions. 
        Do not continue to use Hexerve if you do not agree to all of the terms and conditions stated on this page.
      </p>

      {/* 1. Services */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">1. Services</h2>
        <p>
          Hexerve IT Solutions provides a range of IT services, including web development, digital marketing, SEO, and business consulting. By engaging with our services, you agree to abide by the terms specified in this agreement.
        </p>
      </section>

      {/* 2. Intellectual Property Rights */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">2. Intellectual Property Rights</h2>
        <p>
          Unless otherwise stated, Hexerve IT Solutions owns the intellectual property rights for all material on this website. You may access Hexerve for personal use, but must not:
        </p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>Republish material from Hexerve.</li>
          <li>Sell, rent, or sub-license material from Hexerve.</li>
          <li>Reproduce, duplicate, or copy material from Hexerve.</li>
          <li>Redistribute content from Hexerve.</li>
        </ul>
      </section>

      {/* 3. User Obligations */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">3. User Obligations</h2>
        <p>
          You must not use our website or services for any illegal or unauthorized purposes. You agree to comply with all applicable laws and regulations when using Hexerve IT Solutions’ services.
        </p>
      </section>

      {/* 4. Payment Terms */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">4. Payment Terms</h2>
        <p>
          Payments for services provided by Hexerve IT Solutions are due according to the terms of the contract agreed upon at the start of the project. Invoices not paid on time may result in late fees or service suspension.
        </p>
      </section>

      {/* 5. Limitation of Liability */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">5. Limitation of Liability</h2>
        <p>
          Hexerve IT Solutions will not be held liable for any damages arising out of or in connection with the use of this website or services. This includes, but is not limited to, direct or indirect damages, loss of data, or interruption of service.
        </p>
      </section>

      {/* 6. Termination */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">6. Termination</h2>
        <p>
          We reserve the right to terminate or suspend access to our services without prior notice if you violate the terms of service.
        </p>
      </section>

      {/* 7. Changes to Terms */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">7. Changes to Terms</h2>
        <p>
          Hexerve IT Solutions may revise these terms and conditions at any time. By continuing to use our services, you agree to the new terms.
        </p>
      </section>

      {/* 8. Governing Law */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">8. Governing Law</h2>
        <p>
          These terms are governed by and construed in accordance with the laws of New York, USA. If you have any questions about these Terms, please contact us at [info@hexerve.com].
        </p>
      </section>
    </main>
  );
}
