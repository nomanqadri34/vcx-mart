import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {/* Company Info */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-saffron-400 mb-3 sm:mb-4">VCX MART</h3>
                        <p className="text-gray-300 mb-4 text-sm sm:text-base">
                            India's premier multi-vendor marketplace. Discover quality products from trusted sellers at competitive prices.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://www.instagram.com/vtcx_001?igsh=Y2kwcGkxOWN3Znhz" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C9.901 2.013 10.256 2 12.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 3.807.058h.468c2.456 0 2.784-.011 3.807-.058.975-.045 1.504-.207 1.857-.344.467-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.054.058-1.37.058-3.807v-.468c0-2.456-.011-2.784-.058-3.807-.045-.975-.207-1.504-.344-1.857-.182-.467-.399-.8-.748-1.15-.35-.35-.683-.566-1.15-.748-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="https://www.linkedin.com/in/varun-teja-bodepudi-a174a327b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <span className="sr-only">LinkedIn</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                            <a href="https://t.me/vcxmart" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
                                <span className="sr-only">Telegram</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                </svg>
                            </a>
                            <a href="https://x.com/Vtcx0001?t=auxNrnqHUTvd0EKUFvyY1Q&s=09" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 transition-colors">
                                <span className="sr-only">X (Twitter)</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
                        <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                            <li><a href="/" className="text-gray-300 hover:text-saffron-400 transition-colors">Home</a></li>
                            <li><a href="/products" className="text-gray-300 hover:text-saffron-400 transition-colors">Products</a></li>
                            <li><a href="/categories" className="text-gray-300 hover:text-saffron-400 transition-colors">Categories</a></li>
                            <li><a href="/deals" className="text-gray-300 hover:text-saffron-400 transition-colors">Deals</a></li>
                            <li><a href="/seller/apply" className="text-gray-300 hover:text-saffron-400 transition-colors">Become a Seller</a></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Customer Service</h4>
                        <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                            <li><a href="/contact" className="text-gray-300 hover:text-green-400 transition-colors">Contact Us</a></li>
                            <li><a href="/help" className="text-gray-300 hover:text-green-400 transition-colors">Help Center</a></li>
                            <li><a href="/returns" className="text-gray-300 hover:text-green-400 transition-colors">Returns & Refunds</a></li>
                            <li><a href="/shipping" className="text-gray-300 hover:text-green-400 transition-colors">Shipping Info</a></li>
                            <li><a href="/track-order" className="text-gray-300 hover:text-green-400 transition-colors">Track Order</a></li>
                        </ul>
                    </div>

                    {/* Policies & Legal */}
                    <div>
                        <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Policies & Legal</h4>
                        <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                            <li><a href="/privacy-policy" className="text-gray-300 hover:text-saffron-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="/terms-of-service" className="text-gray-300 hover:text-saffron-400 transition-colors">Terms of Service</a></li>
                            <li><a href="/refund-policy" className="text-gray-300 hover:text-saffron-400 transition-colors">Refund Policy</a></li>
                            <li><a href="/seller-policy" className="text-gray-300 hover:text-saffron-400 transition-colors">Seller Policy</a></li>
                            <li><a href="/grievance-policy" className="text-gray-300 hover:text-saffron-400 transition-colors">Grievance Policy</a></li>
                        </ul>
                    </div>
                </div>

                {/* Additional Links */}
                <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
                        {/* About */}
                        <div>
                            <h4 className="text-base sm:text-lg font-semibold mb-3">About VCX MART</h4>
                            <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                                <li><a href="/about" className="text-gray-300 hover:text-saffron-400 transition-colors">About Us</a></li>
                                <li><a href="/careers" className="text-gray-300 hover:text-saffron-400 transition-colors">Careers</a></li>
                                <li><a href="/press" className="text-gray-300 hover:text-saffron-400 transition-colors">Press & Media</a></li>
                            </ul>
                        </div>
                        
                        {/* More Policies */}
                        <div>
                            <h4 className="text-base sm:text-lg font-semibold mb-3">More Policies</h4>
                            <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                                <li><a href="/security-policy" className="text-gray-300 hover:text-green-400 transition-colors">Security Policy</a></li>
                                <li><a href="/cookie-policy" className="text-gray-300 hover:text-green-400 transition-colors">Cookie Policy</a></li>
                                <li><a href="/intellectual-property" className="text-gray-300 hover:text-green-400 transition-colors">IP Policy</a></li>
                            </ul>
                        </div>
                        
                        {/* Newsletter */}
                        <div className="sm:col-span-2 lg:col-span-1">
                            <h4 className="text-base sm:text-lg font-semibold mb-3">Stay Updated</h4>
                            <p className="text-gray-300 mb-4 text-sm sm:text-base">Get exclusive deals and updates</p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-3 py-2 rounded-lg border-0 text-gray-900 text-sm focus:ring-2 focus:ring-saffron-500"
                                />
                                <button className="bg-gradient-to-r from-saffron-500 to-saffron-600 text-white px-4 py-2 rounded-lg hover:from-saffron-600 hover:to-saffron-700 transition-all text-sm font-medium">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-6 border-t border-gray-800">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-center sm:text-left">
                            <p className="text-gray-400 text-sm">
                                © 2024 VCX MART. All rights reserved.
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                                India's trusted multi-vendor marketplace
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap justify-center gap-4 text-xs">
                            <a href="/sitemap" className="text-gray-400 hover:text-saffron-400 transition-colors">Sitemap</a>
                            <a href="/accessibility" className="text-gray-400 hover:text-saffron-400 transition-colors">Accessibility</a>
                            <a href="/bug-bounty" className="text-gray-400 hover:text-saffron-400 transition-colors">Bug Bounty</a>
                            <a href="/responsible-disclosure" className="text-gray-400 hover:text-saffron-400 transition-colors">Security</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
