import React from 'react'

const Hero = () => {
    return (
        <section className="relative bg-gradient-to-r from-saffron-500 via-saffron-400 to-green-500 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Welcome to{' '}
                        <span className="text-white drop-shadow-lg">Crptomart</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
                        Discover amazing products at unbeatable prices. Shop with confidence and enjoy a seamless shopping experience.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-saffron-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg">
                            Shop Now
                        </button>
                        <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-saffron-600 transition-colors duration-200">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-20 rounded-full"></div>
                <div className="absolute top-32 right-20 w-16 h-16 bg-green-300 opacity-30 rounded-full"></div>
                <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white opacity-20 rounded-full"></div>
            </div>
        </section>
    )
}

export default Hero
