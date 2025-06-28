import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-4">Open Earth Tools Directory</h3>
            <p className="text-gray-300 mb-4">
              Curated open source Earth science visualization tools for safe embedding 
              and storytelling. Maintained by the community for the community.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/developmentseed" className="text-gray-400 hover:text-white">
                GitHub
              </a>
              <a href="https://developmentseed.org" className="text-gray-400 hover:text-white">
                Development Seed
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white">Embedding Guide</a></li>
              <li><a href="#" className="hover:text-white">Security Best Practices</a></li>
              <li><a href="#" className="hover:text-white">Assessment Framework</a></li>
              <li><a href="#" className="hover:text-white">Submit a Tool</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white">Disasters</a></li>
              <li><a href="#" className="hover:text-white">Climate</a></li>
              <li><a href="#" className="hover:text-white">Water Resources</a></li>
              <li><a href="#" className="hover:text-white">Satellite Imagery</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Open Earth Tools Directory. All tools subject to their respective licenses.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
