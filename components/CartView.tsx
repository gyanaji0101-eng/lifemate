import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Icons } from './Icons';

const CartView: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  // FIX: Removed deprecated cart-related properties that no longer exist on AppContextType.
  const { t } = context;

  // FIX: Cart functionality is deprecated, so always show the empty cart view.
  return (
    <div className="text-center py-20">
      <Icons.ShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
      <h2 className="mt-4 text-xl font-semibold text-gray-700">{t({ en: 'Your Cart is Empty', hi: 'आपकी कार्ट खाली है', bho: 'रउवा कार्ट खाली बा', bn: 'আপনার কার্ট খালি', ta: 'உங்கள் வண்டி காலியாக உள்ளது' })}</h2>
      <p className="text-gray-500 mt-2">{t({ en: 'Add items from the shop to see them here.', hi: 'यहां देखने के लिए दुकान से आइटम जोड़ें।', bho: 'इहाँ देखे खातिर दोकान से आइटम जोड़ीं।', bn: 'এখানে দেখতে দোকান থেকে আইটেম যোগ করুন।', ta: 'இங்கே பார்க்க கடையில் இருந்து பொருட்களைச் சேர்க்கவும்.' })}</p>
    </div>
  );
};

export default CartView;
