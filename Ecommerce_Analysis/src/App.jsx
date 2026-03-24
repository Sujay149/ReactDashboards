import { useEffect, useMemo, useState } from 'react';
import Stats from './components/Stats';
import Filters from './components/Filters';
import RevenuePie from './components/charts/RevenuePie';
import DailyOrdersLine from './components/charts/DailyOrdersLine';
import AVGOrderBar from './components/charts/AVGOrderBar';
import PaymentDonut from './components/charts/PaymentDonut';
import DeliveryTimeBar from './components/charts/DeliveryTimeBar';
import CustomerTierGroupedBar from './components/charts/CustomerTierGroupedBar';
import TopProductsHorizontalBar from './components/charts/TopProductsHorizontalBar';
import DiscountImpactBar from './components/charts/DiscountImpactBar';

function App() {
  const [orders, setOrders] = useState([]);
  // All filter values live here so every chart can react instantly.
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    cities: [],
    tiers: [],
    methods: [],
  });

  useEffect(() => {
      const apiBase = (import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '');
      const primaryUrl = apiBase ? `${apiBase}/orders` : '/db.json';

      const loadOrders = (url) =>
        fetch(url)
          .then(res => {
            if (!res.ok) throw new Error('Request failed');
            return res.json();
          })
          .then(data => {
            const list = Array.isArray(data) ? data : data?.orders;
            setOrders(Array.isArray(list) ? list : []);
          });

      loadOrders(primaryUrl)
        .catch(() => {
          if (primaryUrl === '/db.json') {
            setOrders([]);
            return;
          }
          loadOrders('/db.json').catch(() => setOrders([]));
        });
  }, []);

  const normalizeTier = (tier) => {
    if (tier === 'premium') return 'Gold';
    if (tier === 'regular') return 'Silver';
    return 'Bronze';
  };

  const cityOptions = useMemo(
    () => [...new Set(orders.map(o => o.customer?.city).filter(Boolean))],
    [orders]
  );

  const methodOptions = useMemo(
    () => [...new Set(orders.map(o => o.payment?.method).filter(Boolean))],
    [orders]
  );

  // Single source of truth used by stats + all charts.
  const yourFilteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const placed = order.payment?.timestamps?.placed || order.placedAt;
      const day = placed ? String(placed).slice(0, 10) : '';
      const city = order.customer?.city || '';
      const tier = normalizeTier(order.customer?.tier);
      const method = order.payment?.method || '';

      if (filters.startDate && day < filters.startDate) return false;
      if (filters.endDate && day > filters.endDate) return false;
      if (filters.cities.length && !filters.cities.includes(city)) return false;
      if (filters.tiers.length && !filters.tiers.includes(tier)) return false;
      if (filters.methods.length && !filters.methods.includes(method)) return false;
      return true;
    });
  }, [orders, filters]);

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8">
      <Filters
        filters={filters}
        setFilters={setFilters}
        cityOptions={cityOptions}
        methodOptions={methodOptions}
      />

      <Stats orders={yourFilteredOrders} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenuePie orders={yourFilteredOrders} />
        <PaymentDonut orders={yourFilteredOrders} />
        <DailyOrdersLine orders={yourFilteredOrders} />
        <DeliveryTimeBar orders={yourFilteredOrders} />
        <CustomerTierGroupedBar orders={yourFilteredOrders} />
        <DiscountImpactBar orders={yourFilteredOrders} />
        <div className="lg:col-span-2">
          <AVGOrderBar orders={yourFilteredOrders || []} />
        </div>
        <div className="lg:col-span-2">
          <TopProductsHorizontalBar orders={yourFilteredOrders} />
        </div>
      </div>
    </div>
  );
}

export default App;