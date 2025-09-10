
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import type { ShoppingList, ShoppingListItem, Product, Unit } from '../types';
import { UNITS, CATEGORIES } from '../constants';
import { Icons } from './Icons';

interface ShoppingListDetailProps {
  list: ShoppingList;
  onBack: () => void;
}

const AddItemModal: React.FC<{onAddItems: (products: Product[]) => void, onClose: () => void, existingItems: ShoppingListItem[]}> = ({ onAddItems, onClose, existingItems }) => {
    const context = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

    if (!context) return null;
    const { products, categories, t } = context;

    const mainCategories = categories.filter(c => !c.parentId);
    const existingItemNames = existingItems.map(item => item.name.toLowerCase());

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === null || product.categoryId === selectedCategory || categories.find(c => c.id === product.categoryId)?.parentId === selectedCategory;
        const matchesSearch = searchTerm === '' || t(product.name).toLowerCase().includes(searchTerm.toLowerCase());
        const notInList = !existingItemNames.includes(t(product.name).toLowerCase());
        return matchesCategory && matchesSearch && notInList;
    });
    
    const handleToggleProduct = (product: Product) => {
        setSelectedProducts(prev => 
            prev.some(p => p.id === product.id)
                ? prev.filter(p => p.id !== product.id)
                : [...prev, product]
        );
    };

    const handleAddSelected = () => {
        onAddItems(selectedProducts);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">{t({en: "Add Items to List", hi: "सूची में आइटम जोड़ें", bho: "लिस्ट में आइटम जोड़ीं", bn: "তালিকায় আইটেম যোগ করুন", ta: "பட்டியலில் பொருட்களைச் சேர்க்கவும்"})}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200"><Icons.Close className="h-5 w-5" /></button>
                </div>
                <div className="p-4 border-b">
                    <input
                        type="text"
                        placeholder={t({en: "Search products...", hi: "उत्पाद खोजें...", bho: "उत्पाद खोजीं...", bn: "পণ্য খুঁজুন...", ta: "பொருட்களைத் தேடு..."})}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg mb-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                     <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
                        <button onClick={() => setSelectedCategory(null)} className={`px-3 py-1 text-sm rounded-full shrink-0 ${selectedCategory === null ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                            {t({en: "All", hi: "सब", bho: "सब", bn: "সব", ta: "அனைத்தும்"})}
                        </button>
                        {mainCategories.map(category => (
                            <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-3 py-1 text-sm rounded-full shrink-0 ${selectedCategory === category.id ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                            {t(category.name)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-y-auto flex-grow p-4">
                    {filteredProducts.length > 0 ? filteredProducts.map(p => {
                        const isSelected = selectedProducts.some(sp => sp.id === p.id);
                        return (
                            <div key={p.id} onClick={() => handleToggleProduct(p)} className={`p-3 rounded-lg cursor-pointer flex justify-between items-center transition-colors ${isSelected ? 'bg-teal-100' : 'hover:bg-slate-100'}`}>
                                <span className="text-slate-800">{t(p.name)}</span>
                                <div className={`h-6 w-6 rounded-full flex items-center justify-center border-2 ${isSelected ? 'bg-teal-600 border-teal-600' : 'border-slate-300'}`}>
                                    {isSelected && <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                            </div>
                        )
                    }) : <p className="text-center text-slate-500">{t({en:"No products found", hi: "कोई उत्पाद नहीं मिला", bho: "कोनो उत्पाद ना मिलल", bn: "কোন পণ্য পাওয়া যায়নি", ta: "பொருட்கள் எதுவும் இல்லை"})}</p>}
                </div>
                <div className="p-4 border-t">
                    <button onClick={handleAddSelected} disabled={selectedProducts.length === 0} className="w-full bg-teal-600 text-white font-semibold py-3 rounded-lg disabled:bg-slate-400 hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                        {t({en: `Add ${selectedProducts.length} Selected Items`, hi: `${selectedProducts.length} चयनित आइटम जोड़ें`, bho: `${selectedProducts.length} चुनल आइटम जोड़ीं`, bn: `${selectedProducts.length} টি নির্বাচিত আইটেম যোগ করুন`, ta: `${selectedProducts.length} தேர்ந்தெடுக்கப்பட்ட பொருட்களைச் சேர்`})}
                    </button>
                </div>
            </div>
        </div>
    )
}


const ShoppingListDetail: React.FC<ShoppingListDetailProps> = ({ list, onBack }) => {
  const context = useContext(AppContext);
  const [isAddingItem, setIsAddingItem] = useState(false);
  
  if (!context) return null;
  const { language, updateShoppingList, t, findProductByName } = context;
  const { isListening, transcript, startListening, stopListening, setTranscript } = useVoiceRecognition(language || 'en');

  const handleAddItemsFromMaster = useCallback((products: Product[]) => {
    const newItems: ShoppingListItem[] = products.map(product => ({
        id: product.id,
        name: t(product.name),
        quantity: 1,
        unit: product.unit,
        actualPrice: 0,
        expectedPrice: 0,
        isChecked: false,
    }));
    
    const updatedItems = [...list.items, ...newItems];
    updateShoppingList(list.id, { items: updatedItems });
  }, [list.id, list.items, t, updateShoppingList]);

  const parseAndAddItemFromVoice = useCallback((command: string) => {
    if (!command) return;
    
    const allUnitLabels = UNITS.flatMap(u =>
        Object.values(u.label).map(l => ({ value: u.value, label: String(l).toLowerCase() }))
    );
    const sortedUnitLabels = [...allUnitLabels].sort((a,b) => b.label.length - a.label.length);

    let text = command.toLowerCase().trim();
    const quantityMatch = text.match(/^(\d+(\.\d+)?)/);
    const quantity = quantityMatch ? parseFloat(quantityMatch[0]) : 1;
    if (quantityMatch) {
        text = text.substring(quantityMatch[0].length).trim();
    }

    let unit: Unit | null = null;
    for (const unitLabel of sortedUnitLabels) {
        const regex = new RegExp(`\\b${unitLabel.label}\\b`);
        if (regex.test(text)) {
            unit = unitLabel.value;
            text = text.replace(regex, '').trim();
            break;
        }
    }
    
    const productName = text.replace(/^(add|joड़ें|जोड़ीं)\s*/i, '').trim();
    if (!productName) return;

    const product = findProductByName(productName);

    const newItem: ShoppingListItem = {
        id: product ? product.id : Date.now(),
        name: product ? t(product.name) : (productName.charAt(0).toUpperCase() + productName.slice(1)),
        quantity: quantity,
        unit: unit || (product ? product.unit : 'pcs'),
        actualPrice: 0,
        expectedPrice: 0,
        isChecked: false,
    };

    const isAlreadyInList = list.items.some(item => item.name.toLowerCase() === newItem.name.toLowerCase());
    if(!isAlreadyInList) {
        const updatedItems = [...list.items, newItem];
        updateShoppingList(list.id, { items: updatedItems });
    }
}, [list.id, list.items, findProductByName, updateShoppingList, t]);

  useEffect(() => {
    if (transcript && !isListening) {
        parseAndAddItemFromVoice(transcript);
        setTranscript('');
    }
  }, [transcript, isListening, parseAndAddItemFromVoice, setTranscript]);

  const handleUpdateItem = (itemId: number, updates: Partial<ShoppingListItem>) => {
    const updatedItems = list.items.map(item => {
        if (item.id === itemId) {
            const updatedItem = { ...item, ...updates };
            
            // If rate or quantity changed, recalculate total
            if (updates.quantity !== undefined || updates.expectedPrice !== undefined) {
                const quantity = updates.quantity !== undefined ? updates.quantity : item.quantity;
                const rate = updates.expectedPrice !== undefined ? updates.expectedPrice : item.expectedPrice;
                updatedItem.actualPrice = (quantity || 0) * (rate || 0);
            } 
            // If total changed, recalculate rate
            else if (updates.actualPrice !== undefined) {
                if (updatedItem.quantity > 0) {
                    updatedItem.expectedPrice = updatedItem.actualPrice / updatedItem.quantity;
                } else {
                    updatedItem.expectedPrice = 0;
                }
            }
            return updatedItem;
        }
        return item;
    });
    updateShoppingList(list.id, { items: updatedItems });
  };
  
  const handleRemoveItem = (itemId: number) => {
    const updatedItems = list.items.filter(item => item.id !== itemId);
    updateShoppingList(list.id, { items: updatedItems });
  };
  
  const handleShare = () => {
    if(navigator.share) {
        let shareText = `${list.name}\n\n`;
        list.items.forEach(item => {
            shareText += `${item.isChecked ? '[x]' : '[ ]'} ${item.name} - ${item.quantity} ${t(UNITS.find(u=>u.value===item.unit)!.label)}\n`;
        });
        navigator.share({
            title: `Shopping List: ${list.name}`,
            text: shareText
        }).catch(console.error);
    }
  };

  const listTotal = list.items.reduce((sum, item) => sum + (item.actualPrice || 0), 0);
  const purchasedTotal = list.items.reduce((sum, item) => sum + (item.isChecked ? (item.actualPrice || 0) : 0), 0);
  
  return (
    <div>
      {isAddingItem && <AddItemModal onAddItems={handleAddItemsFromMaster} onClose={() => setIsAddingItem(false)} existingItems={list.items} />}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
            <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-slate-200"><Icons.ArrowLeft className="h-6 w-6 text-slate-700" /></button>
            <h2 className="text-2xl font-bold text-slate-800">{list.name}</h2>
        </div>
        <button onClick={handleShare} className="p-2 rounded-full hover:bg-slate-200 text-teal-600"><Icons.Share className="h-6 w-6" /></button>
      </div>

      <div className="space-y-3">
        {list.items.map(item => (
          <div key={item.id} className={`p-3 rounded-lg flex flex-col sm:flex-row items-start gap-3 transition-all ${item.isChecked ? 'bg-green-100 opacity-80' : 'bg-white shadow'}`}>
            <input type="checkbox" checked={item.isChecked} onChange={e => handleUpdateItem(item.id, { isChecked: e.target.checked })} className="h-6 w-6 rounded text-teal-600 focus:ring-teal-500 border-slate-300 mt-1 shrink-0"/>
            <div className="flex-grow">
              <span className={`font-medium text-lg ${item.isChecked ? 'line-through text-slate-500' : 'text-slate-800'}`}>{item.name}</span>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 items-center">
                 <input type="number" value={item.quantity} onChange={e => handleUpdateItem(item.id, { quantity: Number(e.target.value) || 0 })} className="w-full p-1 border rounded" disabled={item.isChecked} placeholder="0"/>
                 <select value={item.unit} onChange={e => handleUpdateItem(item.id, { unit: e.target.value as Unit})} className="p-1 border rounded" disabled={item.isChecked}>
                    {UNITS.map(u => <option key={u.value} value={u.value}>{t(u.label)}</option>)}
                 </select>
                 <div className="flex items-center gap-1 col-span-2 md:col-span-1">
                    <span className="text-slate-500 text-sm">{t({en:"Rate (₹)", hi:"भाव (₹)", bho: "भाव (₹)", bn: "দর (₹)", ta: "விகிதம் (₹)"})}</span>
                    <input type="number" value={item.expectedPrice || ''} onChange={e => handleUpdateItem(item.id, { expectedPrice: parseFloat(e.target.value) || 0 })} className="w-full p-1 border rounded text-right" placeholder="0.00" disabled={item.isChecked}/>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 self-stretch">
                <div className="flex items-center gap-1 flex-grow">
                    <span className="text-slate-500 font-semibold">₹</span>
                    <input type="number" value={item.actualPrice || ''} onChange={e => handleUpdateItem(item.id, { actualPrice: parseFloat(e.target.value) || 0 })} className="w-28 p-1 border-2 border-teal-200 rounded text-right font-bold text-lg" placeholder={t({en:"Total", hi:"कुल", bho:"कुल", bn:"মোট", ta: "மொத்தம்"})} disabled={item.isChecked}/>
                </div>
                <button onClick={() => handleRemoveItem(item.id)} className="text-red-400 hover:text-red-600 p-1"><Icons.Trash className="h-5 w-5"/></button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button onClick={() => setIsAddingItem(true)} className="w-full text-teal-600 font-semibold flex items-center justify-center gap-2 border-2 border-dashed border-teal-300 rounded-lg py-3 hover:bg-teal-50 transition-colors">
            <Icons.PlusCircle className="h-6 w-6"/>
            {t({en: 'Add from List', hi: 'सूची से जोड़ें', bho: 'लिस्ट से जोड़ीं', bn: 'তালিকা থেকে যোগ করুন', ta: 'பட்டியலிலிருந்து சேர்'})}
        </button>
        <button
            onClick={isListening ? stopListening : startListening}
            className={`w-full text-white font-semibold flex items-center justify-center gap-2 rounded-lg py-3 transition-colors ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-600 hover:bg-teal-700'}`}
        >
            <Icons.Mic className="h-6 w-6"/>
            {isListening ? 
                t({en: 'Listening...', hi: 'सुन रहा है...', bho: 'सुनत बानी...', bn: 'শুনছি...', ta: 'கேட்கிறது...'}) : 
                t({en: 'Add by Voice', hi: 'बोलकर जोड़ें', bho: 'बोल के जोड़ीं', bn: 'ভয়েস দ্বারা যোগ করুন', ta: 'குரல் மூலம் சேர்'})}
        </button>
      </div>


      {list.items.length === 0 && (
        <div className="text-center py-10 text-slate-500 mt-4">
          <p>{t({en: 'This list is empty. Add items to get started.', hi: 'यह सूची खाली है। शुरू करने के लिए आइटम जोड़ें।', bho: 'ई लिस्ट खाली बा। शुरू करे खातिर आइटम जोड़ीं।', bn: 'এই তালিকাটি খালি। শুরু করতে আইটেম যোগ করুন।', ta: 'இந்த பட்டியல் காலியாக உள்ளது. தொடங்குவதற்கு பொருட்களைச் சேர்க்கவும்.'})}</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg sticky bottom-4 z-10 border border-slate-200 space-y-2">
        <div className="flex justify-between items-center text-md">
          <span className="font-semibold text-slate-600">{t({ en: 'List Total', hi: 'सूची का कुल योग', bho: 'लिस्ट के कुल जोग', bn: 'তালিকার মোট', ta: 'பட்டியல் மொத்தம்' })}:</span>
          <span className="font-bold text-lg text-slate-800">₹{listTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-lg">
          <span className="font-semibold text-slate-700">{t({ en: 'Purchased Total', hi: 'खरीदा हुआ कुल', bho: 'खरिदाइल कुल', bn: 'কেনা মোট', ta: 'வாங்கிய மொத்தம்' })}:</span>
          <span className="font-bold text-2xl text-teal-600">₹{purchasedTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default ShoppingListDetail;
