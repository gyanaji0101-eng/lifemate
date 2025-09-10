
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from './ProductCard';
import { Icons } from './Icons';

const ProductGrid: React.FC = () => {
  const context = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMainCat, setActiveMainCat] = useState<number | null>(null);
  const [activeSubCat, setActiveSubCat] = useState<number | null>(null);
  
  if (!context) return null;
  const { products, categories, t } = context;

  const mainCategories = categories.filter(c => !c.parentId);
  const visibleSubCats = activeMainCat ? categories.filter(c => c.parentId === activeMainCat) : [];

  const handleMainCatClick = (id: number | null) => {
    setActiveMainCat(id);
    setActiveSubCat(null); // Reset sub-category when main category changes
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || t(product.name).toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCategory = true;
    if (activeSubCat) {
      matchesCategory = product.categoryId === activeSubCat;
    } else if (activeMainCat) {
      const subCatIds = categories.filter(c => c.parentId === activeMainCat).map(sc => sc.id);
      matchesCategory = product.categoryId === activeMainCat || subCatIds.includes(product.categoryId);
    }

    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <div className="sticky top-0 bg-gray-100 py-4 z-5">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder={t({en: "Search products...", hi: "उत्पाद खोजें...", bho: "उत्पाद खोजीं...", bn: "পণ্য খুঁজুন...", ta: "பொருட்களைத் தேடு..."})}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icons.Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        {/* Main Categories */}
        <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
          <button
            onClick={() => handleMainCatClick(null)}
            className={`px-4 py-2 text-sm font-medium rounded-full shrink-0 ${activeMainCat === null ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            {t({en: "All", hi: "सब", bho: "सब", bn: "সব", ta: "அனைத்தும்"})}
          </button>
          {mainCategories.map(category => (
            <button
              key={category.id}
              onClick={() => handleMainCatClick(category.id)}
              className={`px-4 py-2 text-sm font-medium rounded-full shrink-0 ${activeMainCat === category.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
            >
              {t(category.name)}
            </button>
          ))}
        </div>

        {/* Sub Categories */}
        {visibleSubCats.length > 0 && (
            <div className="flex space-x-2 overflow-x-auto pt-2 -mx-4 px-4 mt-2 border-t">
                 <button
                    onClick={() => setActiveSubCat(null)}
                    className={`px-3 py-1 text-xs font-medium rounded-full shrink-0 ${activeSubCat === null ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 border'}`}
                >
                    {t({en: "All", hi: "सब", bho: "सब", bn: "সব", ta: "அனைத்தும்"})} {t(categories.find(c=>c.id === activeMainCat)?.name || {en:'', hi:'', bho:'', bn:'', ta:''})}
                </button>
                {visibleSubCats.map(category => (
                    <button
                    key={category.id}
                    onClick={() => setActiveSubCat(category.id)}
                    className={`px-3 py-1 text-xs font-medium rounded-full shrink-0 ${activeSubCat === category.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 border'}`}
                    >
                    {t(category.name)}
                    </button>
                ))}
            </div>
        )}

      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="text-center py-10 text-gray-500">
            <p>{t({en: "No products found.", hi: "कोई उत्पाद नहीं मिला।", bho: "कोनो उत्पाद ना मिलल।", bn: "কোনো পণ্য পাওয়া যায়নি।", ta: "பொருட்கள் எதுவும் இல்லை."})}</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;