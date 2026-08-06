import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, ShoppingBag, Trash2, ShieldCheck, ArrowRight, Tag, Heart, Sparkles, Edit2, Check } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  cartItems: CartItem[];
  onClose: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onProceedToCheckout: () => void;
  onUpdateGiftNote?: (id: string, note: string) => void;
  isPage?: boolean;
  onViewAiResult?: (result: any) => void;
  onViewItemDetail?: (item: CartItem) => void;
}

export default function CartDrawer({
  isOpen,
  cartItems,
  onClose,
  onRemoveItem,
  onUpdateQuantity,
  onProceedToCheckout,
  onUpdateGiftNote,
  isPage = false,
  onViewAiResult,
  onViewItemDetail,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal > 500 || discountAmount > 0 ? 0 : 49;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromoCode = (codeToApply?: string) => {
    const code = (codeToApply || promoCode).trim().toLowerCase();
    if (code === 'happinio' || code === 'happinio10') {
      const calculatedDiscount = Math.round(subtotal * 0.1);
      setDiscountAmount(calculatedDiscount > 0 ? calculatedDiscount : 80);
      setPromoMessage('HAPPINIO10 kuponu uygulandı! %10 İlk Sipariş İndirimi!');
      setPromoCode('happinio10');
    } else if (code === 'hapyai') {
      setDiscountAmount(100);
      setPromoMessage('HAPYAI kuponu uygulandı! -100 TL İndirim!');
      setPromoCode('hapyai');
    } else {
      setPromoMessage('Geçersiz indirim kuponu. "HAPPINIO10" kodunu deneyebilirsiniz.');
    }
  };

  if (isPage) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fadeIn text-left">
        <div className="bg-white rounded-3xl shadow-xl border border-pink-100 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-pink-200" />
              <span className="font-bold font-serif text-xl">Hediye Sepetim ({cartItems.length})</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Alışverişe Devam Et</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <ShoppingBag className="w-16 h-16 mx-auto stroke-1 mb-3 text-pink-300" />
                <p className="text-sm font-bold text-slate-700">Sepetinizde henüz ürün bulunmuyor.</p>
                <p className="text-xs text-slate-500 mt-1">Yapay zeka asistanımız Hapy ile hediye kutusu oluşturun!</p>
              </div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 relative">
                    <div className="flex items-start gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          if (onViewItemDetail) onViewItemDetail(item);
                          else if (item.isAiGenerated && onViewAiResult && item.rawAiResult) onViewAiResult(item.rawAiResult);
                        }}
                        className="relative shrink-0 overflow-hidden rounded-xl border border-purple-100 hover:border-purple-300 hover:scale-105 transition-all group/img cursor-pointer text-left"
                        title="Ürün Detayını Gör"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                      </button>

                      <div className="flex-1 min-w-0 pr-6 text-left">
                        {item.isAiGenerated && item.rawAiResult ? (
                          <div className="space-y-1 mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded border border-purple-200 inline-flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5 text-amber-500 fill-amber-500 animate-pulse" />
                                <span>Joy-Genie Özel Tasarımı</span>
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (onViewItemDetail) onViewItemDetail(item);
                                else if (onViewAiResult && item.rawAiResult) onViewAiResult(item.rawAiResult);
                              }}
                              className="text-sm font-bold text-purple-950 hover:text-pink-600 text-left line-clamp-2 leading-snug hover:underline cursor-pointer group block"
                              title="Ürün Detayını Gör"
                            >
                              <span>{item.title}</span>
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1 mb-2">
                            <button
                              type="button"
                              onClick={() => onViewItemDetail && onViewItemDetail(item)}
                              className="group text-left cursor-pointer block w-full"
                              title="Ürün Detayını Gör"
                            >
                              <h4 className="text-sm font-bold text-slate-800 group-hover:text-purple-800 group-hover:underline line-clamp-2 leading-snug">
                                {item.title}
                              </h4>
                            </button>
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-base font-black text-pink-600 font-serif">{item.price} TL</span>

                          {/* Quantity Controls */}
                          <div className="flex items-center border border-slate-200 rounded-lg bg-white shadow-2xs">
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-l-lg"
                            >
                              -
                            </button>
                            <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-r-lg"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 p-1.5 transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Kutu İçi Basılacak Özel Hediye Kartı Notu (Düzenlenebilir) */}
                    {editingItemId === item.id ? (
                      <div className="bg-gradient-to-br from-amber-50/90 via-purple-50/60 to-pink-50/80 p-3.5 rounded-xl border border-purple-200/50 shadow-2xs space-y-2 text-left">
                        <div className="flex items-center justify-between border-b border-purple-200/40 pb-1 text-[10px] font-bold text-purple-900">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Kutu İçi Özel Hediye Kartı Notu</span>
                          </span>
                          <span className="text-[9px] text-purple-700 font-bold bg-white/95 px-2 py-0.5 rounded-md border border-purple-100">
                            {(item.giftNote || '').length}/250 Karakter
                          </span>
                        </div>
                        <textarea
                          value={item.giftNote || ''}
                          onChange={(e) => onUpdateGiftNote && onUpdateGiftNote(item.id, e.target.value)}
                          maxLength={250}
                          rows={2}
                          placeholder="Sevdiklerinize iletmek istediğiniz özel kart mesajını buraya yazın..."
                          className="w-full text-xs p-2.5 rounded-xl bg-white border border-purple-100 text-slate-800 font-serif italic leading-relaxed focus:outline-none focus:ring-1 focus:ring-pink-400"
                          autoFocus
                        />
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingItemId(null)}
                            className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold rounded-lg transition-all shadow-xs cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>Kaydet</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-slate-50 to-purple-50/40 p-3.5 rounded-xl border border-slate-200/60 shadow-2xs space-y-2 text-left">
                        <div className="flex items-center justify-between border-b border-slate-200/40 pb-1 text-[10px] font-bold text-slate-600">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                            <span>Kutu İçi Özel Hediye Kartı Notu</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingItemId(item.id)}
                            className="flex items-center gap-1 text-[10px] font-extrabold text-pink-600 hover:text-pink-700 hover:underline transition-all cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Düzenle</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 font-serif italic leading-relaxed">
                          {item.giftNote ? `"${item.giftNote}"` : 'Kart notu yazılmamış. Eklemek için Düzenle\'ye tıklayın.'}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {/* Promo code field */}
                <div className="bg-pink-50/60 p-4 rounded-2xl border border-pink-100 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-pink-500" />
                      <span className="text-xs font-bold text-slate-700">İndirim Kuponu</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyPromoCode('happinio')}
                      className="text-[10px] font-bold text-pink-600 bg-pink-100 hover:bg-pink-200 px-2.5 py-1 rounded-full border border-pink-200 transition-colors"
                    >
                      🎁 İlk Siparişe Özel: happinio (%10 İndirim)
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Kupon Kodunuz (Örn: happinio)"
                      className="flex-1 text-xs p-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyPromoCode()}
                      className="bg-slate-800 hover:bg-slate-950 text-white text-xs font-bold px-4 py-3 rounded-xl transition-all cursor-pointer"
                    >
                      Uygula
                    </button>
                  </div>
                  {promoMessage && (
                    <p className={`text-xs font-medium ${discountAmount > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {promoMessage}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="space-y-2 text-xs text-slate-600 max-w-md ml-auto">
                <div className="flex justify-between">
                  <span>Ara Toplam:</span>
                  <span className="font-bold">{subtotal} TL</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Kupon İndirimi:</span>
                    <span>-{discountAmount} TL</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Kargo Bedeli:</span>
                  <span className="font-bold">{shippingFee === 0 ? 'ÜCRETSİZ' : `${shippingFee} TL`}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 font-serif pt-3 border-t border-slate-200">
                  <span>Ödenecek Tutar:</span>
                  <span className="text-pink-600 text-2xl">{grandTotal} TL</span>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => {
                    onProceedToCheckout();
                  }}
                  className="w-full sm:w-72 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:opacity-95 text-white font-bold text-sm py-4 rounded-2xl shadow-md transition-all flex items-center justify-center cursor-pointer animate-pulse"
                >
                  <span>Ödemeye Geç</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fadeIn">
      <div className="bg-white w-full max-w-4xl mx-auto h-full flex flex-col justify-between relative overflow-hidden">
        
        {/* Drawer Header */}
        <div className="p-5 bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-pink-200" />
            <span className="font-bold font-serif text-xl">Hediye Sepetim ({cartItems.length})</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Alışverişe Devam Et</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <ShoppingBag className="w-16 h-16 mx-auto stroke-1 mb-3 text-pink-300" />
              <p className="text-sm font-bold text-slate-700">Sepetinizde henüz ürün bulunmuyor.</p>
              <p className="text-xs text-slate-500 mt-1">Yapay zeka asistanımız Hapy ile hediye kutusu oluşturun!</p>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3 relative">
                  <div className="flex items-start gap-3">
                    {item.isAiGenerated && onViewAiResult && item.rawAiResult ? (
                      <button
                        onClick={() => {
                          onClose();
                          onViewAiResult(item.rawAiResult);
                        }}
                        className="relative shrink-0 overflow-hidden rounded-xl border border-purple-200 hover:scale-105 transition-transform group/img cursor-pointer"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div className="absolute inset-0 bg-purple-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-amber-300" />
                        </div>
                      </button>
                    ) : (
                      <img
                        src={item.image}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-2xs"
                      />
                    )}

                    <div className="flex-1 min-w-0 pr-6">
                      {item.isAiGenerated && onViewAiResult && item.rawAiResult ? (
                        <div className="space-y-0.5 text-left mb-1.5">
                          <div className="flex items-center gap-1">
                            <span className="text-[8px] font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded border border-purple-200 inline-flex items-center gap-0.5">
                              <Sparkles className="w-2 h-2 text-amber-500 fill-amber-500 animate-pulse" />
                              <span>Joy-Genie Tasarımı</span>
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              onClose();
                              onViewAiResult(item.rawAiResult);
                            }}
                            className="text-xs font-bold text-purple-950 hover:text-pink-600 text-left line-clamp-2 leading-snug hover:underline cursor-pointer flex items-center gap-1 flex-wrap"
                          >
                            <span>{item.title}</span>
                            <span className="text-[9px] font-bold text-pink-600 bg-pink-100/50 hover:bg-pink-100 px-1.5 py-0.5 rounded border border-pink-200 transition-colors no-underline">
                              İncele 🌸
                            </span>
                          </button>
                        </div>
                      ) : (
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug text-left">{item.title}</h4>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-black text-pink-600 font-serif">{item.price} TL</span>

                        {/* Quantity Controls */}
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white shadow-2xs">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-l-lg"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-r-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="absolute top-2.5 right-2.5 text-slate-400 hover:text-rose-500 p-1 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Kutu İçi Basılacak Özel Hediye Kartı Notu (Düzenlenebilir) */}
                  {editingItemId === item.id ? (
                    <div className="bg-gradient-to-br from-amber-50/90 via-purple-50/60 to-pink-50/80 p-3.5 rounded-xl border border-purple-200/50 shadow-2xs space-y-2 text-left">
                      <div className="flex items-center justify-between border-b border-purple-200/40 pb-1 text-[10px] font-bold text-purple-900">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Kutu İçi Özel Hediye Kartı Notu</span>
                        </span>
                        <span className="text-[9px] text-purple-700 font-bold bg-white/95 px-2 py-0.5 rounded-md border border-purple-100">
                          {(item.giftNote || '').length}/250 Karakter
                        </span>
                      </div>
                      <textarea
                        value={item.giftNote || ''}
                        onChange={(e) => onUpdateGiftNote && onUpdateGiftNote(item.id, e.target.value)}
                        maxLength={250}
                        rows={2}
                        placeholder="Sevdiklerinize iletmek istediğiniz özel kart mesajını buraya yazın..."
                        className="w-full text-xs p-2.5 rounded-xl bg-white border border-purple-100 text-slate-800 font-serif italic leading-relaxed focus:outline-none focus:ring-1 focus:ring-pink-400"
                        autoFocus
                      />
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingItemId(null)}
                          className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold rounded-lg transition-all shadow-xs cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Kaydet</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-slate-50 to-purple-50/40 p-3.5 rounded-xl border border-slate-200/60 shadow-2xs space-y-2 text-left">
                      <div className="flex items-center justify-between border-b border-slate-200/40 pb-1 text-[10px] font-bold text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                          <span>Kutu İçi Özel Hediye Kartı Notu</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingItemId(item.id)}
                          className="flex items-center gap-1 text-[10px] font-extrabold text-pink-600 hover:text-pink-700 hover:underline transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Düzenle</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 font-serif italic leading-relaxed">
                        {item.giftNote ? `"${item.giftNote}"` : 'Kart notu yazılmamış. Eklemek için Düzenle\'ye tıklayın.'}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Promo code field */}
              <div className="bg-pink-50/60 p-3 rounded-2xl border border-pink-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-pink-500" />
                    <span className="text-xs font-bold text-slate-700">İndirim Kuponu</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyPromoCode('happinio')}
                    className="text-[10px] font-bold text-pink-600 bg-pink-100 hover:bg-pink-200 px-2 py-0.5 rounded-full border border-pink-200 transition-colors"
                  >
                    🎁 İlk Siparişe Özel: happinio (%10 İndirim)
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Kupon Kodunuz (Örn: happinio)"
                    className="flex-1 text-xs p-2 rounded-xl bg-white border border-slate-200 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyPromoCode()}
                    className="bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl"
                  >
                    Uygula
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-[11px] font-medium ${discountAmount > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {promoMessage}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Ara Toplam:</span>
                <span>{subtotal} TL</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Kupon İndirimi:</span>
                  <span>-{discountAmount} TL</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Kargo Bedeli:</span>
                <span>{shippingFee === 0 ? 'ÜCRETSİZ' : `${shippingFee} TL`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 font-serif pt-2 border-t border-slate-200">
                <span>Ödenecek Tutar:</span>
                <span className="text-pink-600 text-lg">{grandTotal} TL</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-sm py-4 rounded-2xl shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Ödemeye Geç</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
