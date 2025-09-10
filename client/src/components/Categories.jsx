import React from 'react'

const Categories = () => {
    const categories = [
        {
            id: 1,
            name: 'Electronics',
            description: 'Latest gadgets and devices',
            icon: '📱',
            color: 'from-saffron-500 to-saffron-600'
        },
        {
            id: 2,
            name: 'Fashion',
            description: 'Trendy clothing and accessories',
            icon: '👕',
            color: 'from-green-500 to-green-600'
        },
        {
            id: 3,
            name: 'Home & Garden',
            description: 'Everything for your home',
            icon: '🏠',
            color: 'from-saffron-400 to-saffron-500'
        },
        {
            id: 4,
            name: 'Sports',
            description: 'Equipment and activewear',
            icon: '⚽',
            color: 'from-green-400 to-green-500'
        },
        {
            id: 5,
            name: 'Books',
            description: 'Knowledge and entertainment',
            icon: '📚',
            color: 'from-saffron-600 to-saffron-700'
        },
        {
            id: 6,
            name: 'Beauty',
            description: 'Health and beauty products',
            icon: '💄',
            color: 'from-green-600 to-green-700'
        }
    ]

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore our wide range of products organized into convenient categories
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="group cursor-pointer"
                        >
                            <div className={`bg-gradient-to-br ${category.color} rounded-xl p-6 text-white text-center transition-transform duration-200 group-hover:scale-105 shadow-lg`}>
                                <div className="text-4xl mb-3">{category.icon}</div>
                                <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                                <p className="text-xs opacity-90">{category.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Categories
