import React, { useState } from 'react';
import { Order } from '../types';
import { X, Search, PackageCheck, CheckCircle2, Clock, Truck, Home } from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  userOrders: Order[];
  onClose: () => void;
}

export default function OrderTrackingModal({ isOpen, userOrders, onClose }: OrderTrackingModalProps) {
  if (!isOpen) return null;

  const [searchCode, setSearchCode] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    userOrders[0] || {
      id: 'HAPPINIO-884210',
      createdAt: 'Bugün (14:20)',
      items: [],
      totalAmount: 850,
      status: 'preparing',
      trackingCode: 'HAPPINIO-884210',
      recipientName: 'Selin Yılmaz',
      recipientAddress: 'Eskişehir Tepebaşı Mah. No:12',
      deliveryDate: 'Aynı Gün Kargo (Yarın Teslim)',
      paymentMethod: 'PCI DSS Sanal POS',
      giftNote: 'İyi ki doğdun! Senin kadar tatlı günlerin olsun.',
    }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = userOrders.find((o) => o.trackingCode.toLowerCase() === searchCode.trim().toLowerCase());
    if (found) {
      setSelectedOrder(found);
    } else {
      alert('Sipariş bulunamadı. Lütfen kargo/sipariş kodunuzu kontrol edin.');
    }
  };

  const steps = [
    { key: 'received', label: 'Sipariş Alındı', icon: Clock },
    { key: 'preparing', label: 'Hediye Kutusu Hazırlanıyor', icon: PackageCheck },
    { key: 'note_printed', label: 'Kişiye Özel Not Basıldı', icon: CheckCircle2 },
    { key: 'shipped', label: 'Kargoya Verildi', icon: Truck },
    { key: 'delivered', label: 'Teslim Edildi', icon: Home },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'received': return 0;
      case 'preparing': return 1;
      case 'note_printed': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  const currentStepIdx = selectedOrder ? getStepIndex(selectedOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full my-8 shadow-2xl border border-pink-100 overflow-hidden relative">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold font-serif">
            <PackageCheck className="w-5 h-5" />
            <span>Sipariş & Kargo Takibi</span>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Sipariş / Kargo Kodunuz (Örn: HAPPINIO-884210)"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            <button
              type="submit"
              className="bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl"
            >
              Sorgula
            </button>
          </form>

          {/* Selected Order Detail */}
          {selectedOrder && (
            <div className="space-y-6 text-left">
              <div className="bg-pink-50/60 p-4 rounded-2xl border border-pink-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">SİPARİŞ KODU</span>
                  <span className="text-sm font-black text-pink-700 font-mono">{selectedOrder.trackingCode}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold block">ALICI</span>
                  <span className="text-xs font-bold text-slate-800">{selectedOrder.recipientName}</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-800">Sipariş Durumu Süreci:</h4>

                <div className="space-y-3 relative pl-6 border-l-2 border-slate-200">
                  {steps.map((step, idx) => {
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    const IconComp = step.icon;

                    return (
                      <div key={step.key} className="relative flex items-center gap-3 text-xs">
                        {/* Dot */}
                        <div
                          className={`absolute -left-[31px] w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isCurrent
                              ? 'bg-pink-500 text-white ring-4 ring-pink-100 animate-pulse'
                              : isDone
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>

                        <div className="flex-1">
                          <span className={`block font-bold ${isCurrent ? 'text-pink-600' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                            {step.label}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] text-pink-500 font-medium">Şu anda Happinio ekibi bu aşamayı gerçekleştiriyor ✨</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recipient details */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <p><strong>Adres:</strong> {selectedOrder.recipientAddress}</p>
                <p><strong>Teslimat:</strong> {selectedOrder.deliveryDate}</p>
                {selectedOrder.giftNote && (
                  <p className="text-pink-600 italic">"Not: {selectedOrder.giftNote}"</p>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
