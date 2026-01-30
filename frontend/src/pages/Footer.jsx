function Footer() {
    return (
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-gray-600">
  
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">RentEasy</h3>
            <p>Find unique places to stay anywhere in the world.</p>
          </div>
  
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Explore</h3>
            <ul className="space-y-2">
              <li>Stays</li>
              <li>Experiences</li>
              <li>Online Experiences</li>
            </ul>
          </div>
  
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
            <ul className="space-y-2">
              <li>Help Center</li>
              <li>Cancellation Options</li>
              <li>Safety Information</li>
            </ul>
          </div>
  
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>Privacy Policy</li>
              <li>Terms</li>
              <li>Sitemap</li>
            </ul>
          </div>
  
        </div>
  
        <div className="border-t text-center py-4 text-sm text-gray-500">
          © 2026 RentEasy · All rights reserved
        </div>
      </footer>
    );
  }
  
  export default Footer;
  