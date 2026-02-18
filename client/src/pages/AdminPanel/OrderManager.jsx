import React, { useState, useEffect } from 'react';
import { getOrders, updateOrder } from '../../utils/api'; // Make sure API_URL in api.js is set to 'https://norcalbudz.com/api'
import { Search, Eye, X, Settings } from 'lucide-react';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // Status Colors Helper
  const getStatusColor = (status) => {
    switch(status) {
        case 'Pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        case 'Processing': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        case 'Shipped': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
        case 'Completed': return 'text-[#39FF14] bg-[#39FF14]/10 border-[#39FF14]/20';
        case 'Cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
        default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const fetchOrders = async () => {
    try {
        const data = await getOrders();
        // Sort by newest first
        if (Array.isArray(data)) {
            const sorted = data.sort((a, b) => b.id - a.id);
            setOrders(sorted);
            setFilteredOrders(sorted);
        }
    } catch (error) {
        console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = orders;
    if (filter !== 'All') {
        result = result.filter(o => o.status === filter);
    }
    if (search) {
        result = result.filter(o => 
            o.id.toString().includes(search) || 
            o.customer.name.toLowerCase().includes(search.toLowerCase())
        );
    }
    setFilteredOrders(result);
  }, [filter, search, orders]);

  // Handle Status Update
  const handleUpdateStatus = async (newStatus, note) => {
    if(!selectedOrder) return;
    setLoading(true);
    try {
        await updateOrder(selectedOrder.id, { status: newStatus, adminNote: note });
        alert("Order Updated Successfully!");
        fetchOrders(); // Refresh list
        setSelectedOrder(null); // Close modal
    } catch (error) {
        alert("Failed to update order");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-white">ORDER MANAGER</h1>
        <div className="text-[#39FF14] font-bold bg-[#39FF14]/10 px-4 py-2 rounded-full border border-[#39FF14]/20">
            {orders.length} Total Orders
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-[#111] p-4 rounded-2xl border border-white/10 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide">
            {['All', 'Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'].map(f => (
                <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all whitespace-nowrap ${filter === f ? 'bg-white text-black border-white' : 'bg-black text-gray-500 border-white/10 hover:border-white/50'}`}
                >
                    {f}
                </button>
            ))}
        </div>
        <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
                type="text" 
                placeholder="Search Order ID or Name..." 
                className="w-full bg-black border border-white/10 rounded-full py-2 pl-10 pr-4 text-white text-sm focus:border-[#39FF14] outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-black text-xs uppercase font-bold text-gray-500">
                    <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-mono text-white">#{order.id}</td>
                            <td className="p-4">
                                <p className="text-white font-bold">{order.customer.name}</p>
                                <p className="text-[10px] text-gray-500">{order.customer.telegram}</p>
                            </td>
                            <td className="p-4">{order.date.split(',')[0]}</td>
                            <td className="p-4 font-bold text-[#39FF14]">${order.total}</td>
                            <td className="p-4"><span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusColor(order.status)}`}>{order.status}</span></td>
                            <td className="p-4 text-right">
                                <button onClick={() => setSelectedOrder(order)} className="bg-white text-black p-2 rounded-lg hover:bg-[#39FF14] transition-colors">
                                    <Eye size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredOrders.length === 0 && <div className="p-8 text-center text-gray-600">No orders found.</div>}
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
          <OrderDetailsModal 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
            onUpdate={handleUpdateStatus} 
            loading={loading}
          />
      )}
    </div>
  );
};

// --- MODAL COMPONENT ---
const OrderDetailsModal = ({ order, onClose, onUpdate, loading }) => {
    const [status, setStatus] = useState(order.status);
    const [note, setNote] = useState(order.adminNote || '');

    // Image URL Builder (Strictly VPS)
    const getImageUrl = (filename) => {
        if (!filename) return null;
        // WARNING: Meka VPS Link eka witharai
        return `https://norcalbudz.com/uploads/${filename}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/90 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#111] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl relative flex flex-col md:flex-row">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24}/></button>

                {/* LEFT: ORDER INFO */}
                <div className="p-8 w-full md:w-2/3">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-black text-white">ORDER #{order.id}</h2>
                        <span className="bg-[#39FF14]/20 text-[#39FF14] text-xs font-bold px-2 py-1 rounded border border-[#39FF14]/30">{order.paymentMethod}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <h4 className="text-gray-500 text-xs font-bold uppercase mb-1">Customer Info</h4>
                            <p className="text-white font-bold">{order.customer.name}</p>
                            <p className="text-gray-400 text-sm">{order.customer.phone}</p>
                            <p className="text-[#0088cc] text-sm cursor-pointer hover:underline" onClick={() => window.open(`https://t.me/${order.customer.telegram.replace('@','')}`, '_blank')}>
                                {order.customer.telegram}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-gray-500 text-xs font-bold uppercase mb-1">Shipping Address</h4>
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{order.customer.address}</p>
                        </div>
                    </div>

                    <h4 className="text-gray-500 text-xs font-bold uppercase mb-3 border-b border-white/10 pb-2">Order Items</h4>
                    <div className="space-y-3 mb-6">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between bg-black p-3 rounded-lg border border-white/5">
                                <div className="flex items-center gap-3">
                                    <img src={item.images[0]} className="w-10 h-10 rounded object-cover" />
                                    <div>
                                        <p className="text-white font-bold text-sm">{item.name}</p>
                                        <p className="text-gray-500 text-xs">Qty: {item.quantity || 1}</p>
                                    </div>
                                </div>
                                <span className="text-[#39FF14] font-mono">${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center text-xl font-black bg-white/5 p-4 rounded-xl border border-white/10">
                        <span>TOTAL</span>
                        <span className="text-[#39FF14]">${order.total}</span>
                    </div>
                    
                    {/* CUSTOMER NOTES */}
                    {order.customer.notes && (
                        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                            <span className="text-yellow-500 text-xs font-bold uppercase block mb-1">Customer Note:</span>
                            <p className="text-gray-300 text-sm">{order.customer.notes}</p>
                        </div>
                    )}
                </div>

                {/* RIGHT: ADMIN ACTIONS */}
                <div className="bg-black/50 border-l border-white/10 w-full md:w-1/3 p-8 flex flex-col">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2"><Settings size={18}/> Manage Order</h3>
                    
                    {/* PAYMENT SLIP */}
                    <div className="mb-8">
                        <h4 className="text-gray-500 text-xs font-bold uppercase mb-2">Payment Proof</h4>
                        {order.slip ? (
                            <a href={getImageUrl(order.slip)} target="_blank" rel="noreferrer" className="block relative group overflow-hidden rounded-xl border border-white/20">
                                <img src={getImageUrl(order.slip)} className="w-full h-40 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-xs font-bold flex items-center gap-1"><Eye size={14}/> View Full</span>
                                </div>
                            </a>
                        ) : (
                            <div className="h-20 bg-white/5 rounded-xl flex items-center justify-center text-gray-600 text-xs italic border border-dashed border-white/10">
                                No slip uploaded
                            </div>
                        )}
                    </div>

                    {/* STATUS UPDATE */}
                    <div className="mb-4">
                        <label className="text-gray-500 text-xs font-bold uppercase mb-2 block">Order Status</label>
                        <select 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-[#111] border border-white/20 text-white p-3 rounded-lg outline-none focus:border-[#39FF14]"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* ADMIN NOTE */}
                    <div className="mb-6 flex-1">
                        <label className="text-gray-500 text-xs font-bold uppercase mb-2 block">Admin Note (Internal)</label>
                        <textarea 
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Tracking number, private remarks..."
                            className="w-full h-32 bg-[#111] border border-white/20 text-white p-3 rounded-lg outline-none focus:border-[#39FF14] resize-none text-sm"
                        />
                    </div>

                    <button 
                        onClick={() => onUpdate(status, note)} 
                        disabled={loading}
                        className="w-full bg-[#39FF14] text-black font-black py-4 rounded-xl hover:bg-white transition-colors"
                    >
                        {loading ? 'SAVING...' : 'UPDATE ORDER'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderManager;