import React, { useEffect, useRef, useState } from 'react';

export default function UploadModal({ onClose, onCreated, onNotify }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState('');
  const [tag, setTag] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [category, setCategory] = useState('recent');
  const [loading, setLoading] = useState(false);
  const firstRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    // focus first input when mounted
    firstRef.current?.focus();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!title || !driveLink) {
      onNotify?.({ type: 'error', message: 'Title and Drive link are required' });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        title,
        subtitle,
        author,
        image,
        tag,
        drive_link: driveLink,
        category,
        likes: 0,
        starred: false
      };
      const res = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create note');
      const note = await res.json();
      onNotify?.({ type: 'success', message: 'Note uploaded' });
      onCreated?.(note);
      onClose?.();
    } catch (err) {
      console.error(err);
      onNotify?.({ type: 'error', message: 'Upload failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="relative bg-gray-900 rounded-lg p-6 w-full max-w-xl z-60">
        <h3 className="text-lg font-semibold mb-4">Upload Note (Google Drive link)</h3>
        <label className="block text-sm text-gray-300">Title</label>
        <input ref={firstRef} required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 mb-3 rounded bg-gray-800" />

        <label className="block text-sm text-gray-300">Drive Link</label>
        <input required value={driveLink} onChange={(e) => setDriveLink(e.target.value)} placeholder="https://drive.google.com/..." className="w-full p-2 mb-3 rounded bg-gray-800" />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-300">Subtitle</label>
            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full p-2 mb-3 rounded bg-gray-800" />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Author</label>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full p-2 mb-3 rounded bg-gray-800" />
          </div>
        </div>

        <label className="block text-sm text-gray-300">Image URL</label>
        <input value={image} onChange={(e) => setImage(e.target.value)} className="w-full p-2 mb-3 rounded bg-gray-800" />

        {image && (
          <div className="mb-3">
            <div className="text-sm text-gray-300 mb-2">Preview</div>
            <img src={image} alt="preview" className="w-full h-40 object-cover rounded" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-300">Tag</label>
            <input value={tag} onChange={(e) => setTag(e.target.value)} className="w-full p-2 mb-3 rounded bg-gray-800" />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 mb-3 rounded bg-gray-800">
              <option value="recent">recent</option>
              <option value="trending">trending</option>
              <option value="recommended">recommended</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-700">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-blue-600">{loading ? 'Uploading...' : 'Upload'}</button>
        </div>
      </form>
    </div>
  );
}
