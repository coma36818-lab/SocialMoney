
export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="prose prose-invert mx-auto max-w-3xl text-left">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">Privacy Policy – MyDatinGame</h1>

        <p className="text-center text-muted-foreground">Last updated: 2025</p>

        <p>
          This Privacy Policy describes how we collect, use, and protect user data
          on <strong>mydatingame.com</strong>.
          The site is managed by: <strong>MyDatinGame</strong>.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Data Collected</h2>
        <ul className="list-disc list-inside">
          <li>Information provided voluntarily (email in contact form or newsletter)</li>
          <li>Anonymous technical data (browser, device, pages visited)</li>
          <li>Cookies necessary for the site to function</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Use of Data</h2>
        <p>Data is used exclusively for:</p>
        <ul className="list-disc list-inside">
          <li>responding to messages sent via the contact form</li>
          <li>anonymous aggregate statistics</li>
          <li>improving user experience</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Cookies</h2>
        <p>
          mydatingame.com uses technical and functional cookies.
          We do not use profiling, advertising, or third-party cookies (like Google Ads).
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Third-Party Services Used</h2>
        <p>
          We currently use:
        </p>
        <ul className="list-disc list-inside">
          <li>Hosting: Netlify</li>
          <li>Statistics: possible anonymous analytics</li>
          <li>Affiliate links (Amazon, Awin, Etsy, Booking, Fiverr)</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. User Rights</h2>
        <p>You can request at any time:</p>
        <ul className="list-disc list-inside">
          <li>access to your data</li>
          <li>deletion of your data</li>
          <li>information about data processing</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Contacts</h2>
        <p>
          For any request, write to:<br />
          <strong>mydatingame@gmail.com</strong>
        </p>
      </div>
    </div>
  );
}
