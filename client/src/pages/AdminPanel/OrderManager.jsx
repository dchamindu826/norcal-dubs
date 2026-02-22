import React, { useState, useEffect } from 'react';
// deleteOrder api function එක import කරගත්තා
import { getOrders, updateOrder, deleteOrder } from '../../utils/api'; 
// Trash2 icon එක import කරගත්තා delete button එකට
import { Search, Eye, X, Settings, Trash2 } from 'lucide-react'; 

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

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
        if (Array.isArray(data)) {
            const sorted = data.sort((a, b) => b.id - a.id);
            setOrders(sorted);
            setFilteredOrders(sorted);
        }
    } catch (error) { console.error("Failed to fetch orders:", error); }
  };

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    let result = orders;
    if (filter !== 'All') result = result.filter(o => o.status === filter);
    if (search) result = result.filter(o => o.id.toString().includes(search) || o.customer.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredOrders(result);
  }, [filter, search, orders]);

  const handleUpdateStatus = async (newStatus, note) => {
    if(!selectedOrder) return;
    setLoading(true);
    try {
        await updateOrder(selectedOrder.id, { status: newStatus, adminNote: note });
        alert("Order Updated Successfully!");
        fetchOrders();
        setSelectedOrder(null);
    } catch (error) { alert("Failed to update order"); } 
    finally { setLoading(false); }
  };

  // --- DELETE ORDER FUNCTION ---
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
        setLoading(true);
        try {
            await deleteOrder(orderId);
            alert("Order Deleted Successfully!");
            fetchOrders(); // List එක refresh කරනවා
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder(null); // Modal එක open වෙලා තිබ්බොත් close කරනවා
            }
        } catch (error) {
            alert("Failed to delete order");
        } finally {
            setLoading(false);
        }
    }
  };

  return (
    <div className="pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3">
        <h1 className="text-2xl sm:text-3xl font-black text-white">ORDER MANAGER</h1>
        <div className="text-[#39FF14] text-xs sm:text-sm font-bold bg-[#39FF14]/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#39FF14]/20">
            {orders.length} Total Orders
        </div>
      </div>

      <div className="bg-[#111] p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 mb-4 sm:mb-6 flex flex-col xl:flex-row gap-3 sm:gap-4 justify-between items-start xl:items-center">
        <div className="flex gap-2 overflow-x-auto w-full pb-2 xl:pb-0 scrollbar-hide">
            {['All', 'Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'].map(f => (
                <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border transition-all whitespace-nowrap ${filter === f ? 'bg-white text-black border-white' : 'bg-black text-gray-500 border-white/10 hover:border-white/50'}`}
                >
                    {f}
                </button>
            ))}
        </div>
        <div className="relative w-full xl:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
            <input 
                type="text" 
                placeholder="Search Order ID..." 
                className="w-full bg-black border border-white/10 rounded-full py-2 pl-9 sm:pl-10 pr-4 text-white text-xs sm:text-sm focus:border-[#39FF14] outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      <div className="bg-[#111] rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-gray-400 whitespace-nowrap">
                <thead className="bg-black text-[10px] sm:text-xs uppercase font-bold text-gray-500">
                    <tr>
                        <th className="p-3 sm:p-4">Order ID</th>
                        <th className="p-3 sm:p-4">Customer</th>
                        <th className="p-3 sm:p-4 hidden sm:table-cell">Date</th>
                        <th className="p-3 sm:p-4">Total</th>
                        <th className="p-3 sm:p-4">Status</th>
                        <th className="p-3 sm:p-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 sm:p-4 font-mono text-white text-xs">#{order.id.toString().slice(-6)}</td>
                            <td className="p-3 sm:p-4">
                                <p className="text-white font-bold truncate max-w-[100px] sm:max-w-[200px]">{order.customer.name}</p>
                                <p className="text-[9px] sm:text-[10px] text-gray-500 truncate max-w-[100px] sm:max-w-[200px]">{order.customer.telegram}</p>
                            </td>
                            <td className="p-3 sm:p-4 hidden sm:table-cell">{order.date.split(',')[0]}</td>
                            <td className="p-3 sm:p-4 font-bold text-[#39FF14]">${order.total}</td>
                            <td className="p-3 sm:p-4"><span className={`px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-bold border uppercase ${getStatusColor(order.status)}`}>{order.status}</span></td>
                            <td className="p-3 sm:p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button onClick={() => setSelectedOrder(order)} className="bg-white text-black p-1.5 sm:p-2 rounded-lg hover:bg-[#39FF14] transition-colors">
                                        <Eye size={14} className="sm:w-4 sm:h-4"/>
                                    </button>
                                    <button onClick={() => handleDeleteOrder(order.id)} className="bg-red-500/10 text-red-500 border border-red-500/20 p-1.5 sm:p-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors" title="Delete Order">
                                        <Trash2 size={14} className="sm:w-4 sm:h-4"/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredOrders.length === 0 && <div className="p-6 sm:p-8 text-center text-gray-600 text-sm">No orders found.</div>}
        </div>
      </div>

      {selectedOrder && (
          <OrderDetailsModal 
              order={selectedOrder} 
              onClose={() => setSelectedOrder(null)} 
              onUpdate={handleUpdateStatus} 
              onDelete={handleDeleteOrder} // Delete function එක Modal එකටත් pass කළා
              loading={loading} 
          />
      )}
    </div>
  );
};

const OrderDetailsModal = ({ order, onClose, onUpdate, onDelete, loading }) => {
    const [status, setStatus] = useState(order.status);
    const [note, setNote] = useState(order.adminNote || '');

    const getImageUrl = (filename) => {
        if (!filename) return null;
        return `https://norcalbudz.com/uploads/${filename}`;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:px-4 bg-black/90 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#111] w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl relative flex flex-col md:flex-row">
                <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-white bg-black/50 p-1 rounded-full z-10"><X size={20} className="sm:w-6 sm:h-6"/></button>

                {/* LEFT: ORDER INFO */}
                <div className="p-4 sm:p-8 w-full md:w-2/3 order-2 md:order-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6 mt-4 md:mt-0">
                        <h2 className="text-lg sm:text-2xl font-black text-white">ORDER #{order.id}</h2>
                        <span className="bg-[#39FF14]/20 text-[#39FF14] text-[10px] sm:text-xs font-bold px-2 py-1 rounded border border-[#39FF14]/30 w-fit">{order.paymentMethod}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 bg-black/50 p-4 rounded-xl border border-white/5">
                        <div>
                            <h4 className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase mb-1">Customer Info</h4>
                            <p className="text-white font-bold text-sm sm:text-base">{order.customer.name}</p>
                            <p className="text-gray-400 text-xs sm:text-sm">{order.customer.phone}</p>
                            <p className="text-[#0088cc] text-xs sm:text-sm cursor-pointer hover:underline truncate" onClick={() => window.open(`https://t.me/${order.customer.telegram.replace('@','')}`, '_blank')}>
                                {order.customer.telegram}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase mb-1">Shipping Address</h4>
                            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{order.customer.address}</p>
                        </div>
                    </div>

                    <h4 className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase mb-2 sm:mb-3 border-b border-white/10 pb-2">Order Items</h4>
                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between bg-black p-2 sm:p-3 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <img src={item.images[0]} className="w-8 h-8 sm:w-10 sm:h-10 rounded object-cover border border-white/10" />
                                    <div>
                                        <p className="text-white font-bold text-xs sm:text-sm truncate max-w-[120px] sm:max-w-full">{item.name}</p>
                                        <p className="text-gray-500 text-[10px] sm:text-xs">Qty: {item.quantity || 1}</p>
                                    </div>
                                </div>
                                <span className="text-[#39FF14] font-mono text-xs sm:text-sm font-bold">${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center text-lg sm:text-xl font-black bg-white/5 p-3 sm:p-4 rounded-xl border border-white/10">
                        <span>TOTAL</span>
                        <span className="text-[#39FF14]">${order.total}</span>
                    </div>
                    
                    {order.customer.notes && (
                        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                            <span className="text-yellow-500 text-[10px] sm:text-xs font-bold uppercase block mb-1">Customer Note:</span>
                            <p className="text-gray-300 text-xs sm:text-sm italic">{order.customer.notes}</p>
                        </div>
                    )}
                </div>

                {/* RIGHT: ADMIN ACTIONS */}
                <div className="bg-[#0a0a0a] md:bg-black/50 border-b md:border-b-0 md:border-l border-white/10 w-full md:w-1/3 p-4 sm:p-8 flex flex-col order-1 md:order-2">
                    <h3 className="text-white font-bold mb-4 sm:mb-6 flex items-center gap-2 text-sm sm:text-base"><Settings size={16} className="sm:w-5 sm:h-5"/> Manage Order</h3>
                    
                    <div className="mb-4 sm:mb-8">
                        <h4 className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase mb-2">Payment Proof</h4>
                        {order.slip ? (
                            <a href={getImageUrl(order.slip)} target="_blank" rel="noreferrer" className="block relative group overflow-hidden rounded-xl border border-white/20">
                                <img src={getImageUrl(order.slip)} className="w-full h-24 sm:h-40 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-xs font-bold flex items-center gap-1"><Eye size={14}/> View Full</span>
                                </div>
                            </a>
                        ) : (
                            <div className="h-16 sm:h-20 bg-white/5 rounded-xl flex items-center justify-center text-gray-600 text-[10px] sm:text-xs italic border border-dashed border-white/10">
                                No slip uploaded
                            </div>
                        )}
                    </div>

                    <div className="mb-3 sm:mb-4">
                        <label className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase mb-1 sm:mb-2 block">Order Status</label>
                        <select 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-black sm:bg-[#111] border border-white/20 text-white p-2.5 sm:p-3 rounded-lg outline-none focus:border-[#39FF14] text-xs sm:text-sm font-bold"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="mb-4 sm:mb-6 flex-1">
                        <label className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase mb-1 sm:mb-2 block">Admin Note</label>
                        <textarea 
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Tracking info..."
                            className="w-full h-20 sm:h-32 bg-black sm:bg-[#111] border border-white/20 text-white p-2.5 sm:p-3 rounded-lg outline-none focus:border-[#39FF14] resize-none text-xs sm:text-sm"
                        />
                    </div>

                    <button 
                        onClick={() => onUpdate(status, note)} 
                        disabled={loading}
                        className="w-full bg-[#39FF14] text-black font-black py-3 sm:py-4 rounded-xl hover:bg-white transition-colors text-xs sm:text-base"
                    >
                        {loading ? 'SAVING...' : 'UPDATE ORDER'}
                    </button>

                    {/* Modal එක ඇතුලෙත් Delete Button එක දැම්මා */}
                    <button 
                        onClick={() => onDelete(order.id)} 
                        disabled={loading}
                        className="w-full mt-3 bg-red-500/10 border border-red-500/20 text-red-500 font-black py-3 sm:py-4 rounded-xl hover:bg-red-500 hover:text-white transition-colors text-xs sm:text-base flex items-center justify-center gap-2"
                    >
                        <Trash2 size={16} /> {loading ? 'DELETING...' : 'DELETE ORDER'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderManager;