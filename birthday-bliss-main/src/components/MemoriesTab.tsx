import { useState, useEffect } from 'react'
import { supabase } from '../integrations/supabase/client'

interface Memory {
  id: string
  image_url: string
  caption: string | null
  memory_date: string | null
}

export function MemoriesTab() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchMemories()
  }, [])

  const fetchMemories = async () => {
    const { data } = await supabase
      .from('memories' as any)
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setMemories(data as unknown as Memory[])
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('memories')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('memories')
        .getPublicUrl(filePath)

      const { error: insertError } = await supabase
        .from('memories' as any)
        .insert([
          {
            image_url: urlData.publicUrl,
            caption: caption || null,
          },
        ])

      if (insertError) throw insertError

      setCaption('')
      fetchMemories()
    } catch (error: any) {
      alert(error.message || 'Error uploading memory')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add a New Memory</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Add a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
          {uploading && <p className="text-sm text-purple-600">Uploading...</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {memories.map((memory) => (
          <div key={memory.id} className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
            <img src={memory.image_url} alt={memory.caption || 'Memory'} className="w-full h-48 object-cover" />
            {memory.caption && <p className="p-4 text-gray-700 font-medium">{memory.caption}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}