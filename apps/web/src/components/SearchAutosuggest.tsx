import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Search } from 'lucide-react';

interface SuggestionItem {
  id: string;
  name: string;
  price: number;
  images: string[];
}

function useDebounced<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchAutosuggest({ className = '' }: { className?: string }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SuggestionItem[]>([]);
  const debouncedQ = useDebounced(q, 300);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize from URL `q`
  useEffect(() => {
    const qp = params.get('q') || '';
    setQ(qp);
  }, []);

  useEffect(() => {
    if (!debouncedQ || debouncedQ.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api
      .get('/products', { params: { q: debouncedQ, limit: 8 } })
      .then((res) => {
        if (cancelled) return;
        const list = (res.data || []).map((p: any) => ({
          id: p._id || p.id,
          name: p.name,
          price: p.price,
          images: p.images || [],
        })) as SuggestionItem[];
        setResults(list);
        setOpen(list.length > 0);
      })
      .catch(() => {
        if (!cancelled) {
          setResults([]);
          setOpen(false);
        }
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [debouncedQ]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const showClear = useMemo(() => q.length > 0, [q]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    setOpen(false);
    navigate(`/products?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <form onSubmit={onSubmit} className="flex items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => q.trim().length >= 2 && setOpen(true)}
            placeholder="Search products..."
            className="w-full pl-8 pr-8 py-2 rounded-full border border-gray-300 bg-white/80 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {showClear && (
            <button
              type="button"
              onClick={() => {
                setQ('');
                setResults([]);
                setOpen(false);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              Clear
            </button>
          )}
        </div>
      </form>
      {open && (
        <div className="absolute mt-2 w-[22rem] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg z-50">
          <div className="max-h-80 overflow-auto">
            {loading ? (
              <div className="p-4 text-sm text-gray-500">Searching…</div>
            ) : results.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">No results</div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {results.map((r) => (
                  <li
                    key={r.id}
                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-3"
                    onClick={() => {
                      setOpen(false);
                      navigate(`/products/${r.id}`);
                    }}
                  >
                    <img
                      src={r.images?.[0] || '/images/placeholder.jpg'}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                        (e.target as HTMLImageElement).onerror = null;
                      }}
                      alt={r.name}
                      className="w-10 h-10 rounded object-cover bg-gray-100"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium truncate">{r.name}</div>
                      <div className="text-xs text-gray-500">${r.price?.toFixed(2)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            className="w-full text-left p-3 text-sm text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20"
            onClick={() => {
              setOpen(false);
              navigate(`/products?q=${encodeURIComponent(q.trim())}`);
            }}
          >
            View all results
          </button>
        </div>
      )}
    </div>
  );
}
