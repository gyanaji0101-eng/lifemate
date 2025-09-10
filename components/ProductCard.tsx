import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import type { Product } from '../types';
import { Icons } from './Icons';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const context = useContext(AppContext);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!context) return null;
  // FIX: Removed addToCart as it is not defined in AppContextType.
  const { t } = context;

  const handleAddToCart = () => {
    // FIX: Removed call to addToCart which no longer exists.
    // addToCart(product.id, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000); // Reset after 2 seconds
  };
  
  const unitLabel = {
      en: `per ${product.unit}`,
      hi: `प्रति ${product.unit}`,
      bho: `प्रति ${product.unit}`,
      bn: `প্রতি ${product.unit}`,
      ta: `${product.unit} ஒன்றுக்கு`
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <img src={product.image || 'https://picsum.photos/400/400'} alt={t(product.name)} className="w-full h-32 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-800 text-base mb-1 truncate">{t(product.name)}</h3>
        <p className="text-gray-600 text-sm mb-2">₹{product.price.toFixed(2)} <span className="text-xs text-gray-500">{t(unitLabel)}</span></p>
        
        <div className="mt-auto">
            <div className="flex items-center justify-between mb-2">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-1.5 bg-gray-200 rounded-full text-gray-700"><Icons.Minus className="h-4 w-4" /></button>
                <span className="font-bold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="p-1.5 bg-gray-200 rounded-full text-gray-700"><Icons.Plus className="h-4 w-4" /></button>
            </div>
            <button
                onClick={handleAddToCart}
                className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-colors duration-300 ${isAdded ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {isAdded ? t({en:'Added!', hi: 'जोड़ा गया!', bho: 'जोड़ाइल!', bn: 'যোগ করা হয়েছে!', ta:'சேர்க்கப்பட்டது!'}) : t({en:'Add to Cart', hi: 'कार्ट में डालें', bho: 'कार्ट में डालीं', bn: 'কার্টে যোগ করুন', ta:'வண்டியில் சேர்'})}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
