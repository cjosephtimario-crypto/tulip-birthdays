import { useState, useEffect } from 'react'
import { supabase } from '../integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Gift, CheckCircle2, Circle } from 'lucide-react'

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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    const { data, error } = await supabase
      .from('wishlist_items' as any)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching wishlist:', error)
    } else if (data) {
      setItems(data as unknown as WishlistItem[])
    }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    const { error } = await supabase.from('wishlist_items' as any).insert([
      {
        title: title.trim(),
        price: price ? parseFloat(price) : null,
        url: url.trim() || null,
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
    setLoading(false)
  }

  const togglePurchased = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('wishlist_items' as any)
      .update({ purchased: !currentStatus })
      .eq('id', id)

    if (!error) fetchWishlist()
  }

  const deleteItem = async (id: string) => {
    const { error } = await supabase
      .from('wishlist_items' as any)
      .delete()
      .eq('id', id)

    if (!error) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <form onSubmit={handleAddItem} className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-purple-100 space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold">
          <Gift className="w-5 h-5" />
          <h3 className="text-lg font-display text-gray-800">Add to Wishlist</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Item title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-2 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white text-sm"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price ($)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="px-4 py-2 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white text-sm"
          />
          <input
            type="text"
            placeholder="Store, Note, or URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="px-4 py-2 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white text-sm"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-6 py-2 rounded-xl gradient-dream text-white font-bold shadow-soft"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.length === 0 ? (
          <div className="col-span-full text-center py-8 bg-white/50 rounded-3xl border border-purple-100 text-muted-foreground italic text-sm">
            Your wishlist is currently empty. Add your first dream item above!
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                item.purchased ? 'bg-gray-50 border-gray-200 opacity-70' : 'bg-white/90 border-purple-100 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <h4 className={`font-bold text-gray-900 ${item.purchased ? 'line-through text-gray-500' : ''}`}>
                    {item.title}
                  </h4>
                  {item.price !== null && (
                    <p className="text-sm text-purple-600 font-extrabold">${item.price.toFixed(2)}</p>
                  )}
                  {item.url && (
                    item.url.startsWith('http') ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline block truncate max-w-[200px]"
                      >
                        View Link
                      </a>
                    ) : (
                      <p className="text-xs text-gray-500 italic">Note: {item.url}</p>
                    )
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteItem(item.id)}
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => togglePurchased(item.id, item.purchased)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-semibold flex items-center gap-1.5 transition-colors ${
                    item.purchased
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
                  }`}
                >
                  {item.purchased ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                  {item.purchased ? 'Bought' : 'Mark as Bought'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}