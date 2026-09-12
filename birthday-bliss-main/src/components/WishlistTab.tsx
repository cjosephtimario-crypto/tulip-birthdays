import { useState, useEffect } from 'react'
import { supabase } from '../integrations/supabase/client'

interface WishlistItem {
  id: string
  title: string
  price: number | null
  url: string | null
  purchased: boolean
}

export function WishlistTab() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    const { data } = await supabase
      .from('wishlist_items' as any)
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setItems(data as unknown as WishlistItem[])
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const { error } = await supabase.from('wishlist_items' as any).insert([
      {
        title,
        price: price ? parseFloat(price) : null,
        url: url || null,
        purchased: false,
      },
    ])

    if (!error) {
      setTitle('')
      setPrice('')
      setUrl('')
      fetchWishlist()
    } else {
      alert(error.message)
    }
  }

  const togglePurchased = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('wishlist_items' as any)
      .update({ purchased: !currentStatus })
      .eq('id', id)

    if (!error) fetchWishlist()
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddItem} className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Add to Wishlist</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Item title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price ($)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="text"
            placeholder="Store, Note, or URL (e.g. SS)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          Add Item
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border transition-all ${
              item.purchased ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-purple-100 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className={`font-semibold text-gray-800 ${item.purchased ? 'line-through' : ''}`}>
                  {item.title}
                </h4>
                {item.price && <p className="text-sm text-purple-600 font-medium">${item.price}</p>}
                {item.url && (
                  item.url.startsWith('http') ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-500 hover:underline block mt-1"
                    >
                      View Item Link
                    </a>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">Note: {item.url}</p>
                  )
                )}
              </div>
              <button
                type="button"
                onClick={() => togglePurchased(item.id, item.purchased)}
                className={`text-xs px-3 py-1 rounded-full border ${
                  item.purchased
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-purple-50 border-purple-200 text-purple-700'
                }`}
              >
                {item.purchased ? 'Bought' : 'Mark as Bought'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}