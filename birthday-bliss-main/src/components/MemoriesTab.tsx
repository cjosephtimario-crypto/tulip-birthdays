import { useState, useEffect } from 'react'
import { supabase } from '../integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Trash2, ImagePlus, Upload, Loader2 } from 'lucide-react'

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
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    fetchMemories()
  }, [])

  const fetchMemories = async () => {
    const { data, error } = await supabase
      .from('memories' as any)
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Error fetching memories:', error)
    } else if (data) {
      setMemories(data as unknown as Memory[])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
    }
  }

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
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
            caption: caption.trim() || null,
          },
        ])

      if (insertError) throw insertError

      setCaption('')
      setFile(null)
      setPreview(null)
      fetchMemories()
    } catch (error: any) {
      alert(error.message || 'Error uploading memory')
    } finally {
      setUploading(false)
    }
  }

  const deleteMemory = async (id: string) => {
    const { error } = await supabase
      .from('memories' as any)
      .delete()
      .eq('id', id)

    if (!error) {
      setMemories(memories.filter((item) => item.id !== id))
    } else {
      alert('Could not delete memory.')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <form onSubmit={handleFileUpload} className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-purple-100 space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold">
          <ImagePlus className="w-5 h-5" />
          <h3 className="text-lg font-display text-gray-800">Add a New Memory</h3>
        </div>

        <div className="flex flex-col items-center justify-center border-2 border-dashed border-purple-200 rounded-2xl p-4 bg-purple-50/30 relative overflow-hidden">
          {preview ? (
            <div className="relative w-full h-48">
              <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
              <button
                type="button"
                onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full px-2.5 py-1 text-xs hover:bg-black"
              >
                Change Photo
              </button>
            </div>
          ) : (
            <label className="cursor-pointer flex flex-col items-center space-y-2 py-6 w-full">
              <Upload className="w-8 h-8 text-purple-400" />
              <span className="text-xs font-semibold text-purple-700">Click to upload photo</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          )}
        </div>

        <input
          type="text"
          placeholder="Add a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full px-4 py-2 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white text-sm"
          maxLength={120}
        />

        <Button
          type="submit"
          disabled={!file || uploading}
          className="w-full md:w-auto px-6 py-2 rounded-xl gradient-dream text-white font-bold shadow-soft flex items-center justify-center"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
          {uploading ? 'Uploading...' : 'Save Memory'}
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white/50 rounded-3xl border border-purple-100 text-muted-foreground italic text-sm">
            No memories uploaded yet. Capture your special moments above!
          </div>
        ) : (
          memories.map((memory) => (
            <div key={memory.id} className="bg-white/90 backdrop-blur-md rounded-2xl border border-purple-100 shadow-sm overflow-hidden flex flex-col justify-between group">
              <div className="relative h-48 overflow-hidden bg-purple-50">
                <img src={memory.image_url} alt={memory.caption || 'Memory'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <button
                  type="button"
                  onClick={() => deleteMemory(memory.id)}
                  className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-red-500 hover:text-red-700 hover:bg-white p-2 rounded-full shadow transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                {memory.caption ? (
                  <p className="text-sm font-medium text-gray-800">{memory.caption}</p>
                ) : (
                  <p className="text-xs text-gray-400 italic">No caption</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}