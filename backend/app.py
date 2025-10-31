from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app)


DATA_PATH = os.path.join(os.path.dirname(__file__), 'notes.json')


def load_notes():
    if not os.path.exists(DATA_PATH):
        return []
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_notes(notes):
    with open(DATA_PATH, 'w', encoding='utf-8') as f:
        json.dump(notes, f, ensure_ascii=False, indent=2)


@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Carevo notes API!"})


@app.route('/api/notes', methods=['GET'])
def list_notes():
    """Return all notes. Optionally filter by ?category=trending/recent/recommended"""
    notes = load_notes()
    category = request.args.get('category')
    if category:
        notes = [n for n in notes if n.get('category') == category]
    return jsonify(notes)


@app.route('/api/search', methods=['GET'])
def search_notes():
    """Search notes by title, subtitle, or author. Use ?q=search_term"""
    query = request.args.get('q', '').lower().strip()
    if not query:
        return jsonify([])
    
    notes = load_notes()
    results = []
    
    for note in notes:
        # Search in title, subtitle, and author fields
        title = note.get('title', '').lower()
        subtitle = note.get('subtitle', '').lower()
        author = note.get('author', '').lower()
        
        if (query in title or 
            query in subtitle or 
            query in author):
            results.append(note)
    
    return jsonify(results)


@app.route('/api/notes/<int:note_id>', methods=['GET'])
def get_note(note_id):
    notes = load_notes()
    for n in notes:
        if n.get('id') == note_id:
            return jsonify(n)
    abort(404, description='Note not found')


@app.route('/api/notes', methods=['POST'])
def create_note():
    """Create a new note. Expect JSON: title, subtitle, author, image, tag (optional), drive_link, category"""
    if not request.is_json:
        abort(400, description='Expected application/json')
    payload = request.get_json()
    required = ['title', 'drive_link']
    if not all(k in payload for k in required):
        abort(400, description=f'Missing required fields: {required}')

    notes = load_notes()
    next_id = max((n.get('id', 0) for n in notes), default=0) + 1
    note = {
        'id': next_id,
        'title': payload.get('title'),
        'subtitle': payload.get('subtitle', ''),
        'author': payload.get('author', ''),
        'image': payload.get('image', ''),
        'tag': payload.get('tag', ''),
        'drive_link': payload.get('drive_link'),
        'category': payload.get('category', 'recent'),
        'likes': int(payload.get('likes', 0)),
        'starred': bool(payload.get('starred', False))
    }
    notes.append(note)
    save_notes(notes)
    return jsonify(note), 201


@app.route('/api/notes/<int:note_id>/like', methods=['POST'])
def like_note(note_id):
    """Toggle like state for a note and return updated note."""
    notes = load_notes()
    user_id = request.headers.get('User-ID')
    if not user_id:
        abort(400, description='User-ID header is required')

    for n in notes:
        if n.get('id') == note_id:
            if 'liked_by' not in n:
                n['liked_by'] = []

            if user_id in n['liked_by']:
                n['liked_by'].remove(user_id)
                n['likes'] -= 1
                liked = False
            else:
                n['liked_by'].append(user_id)
                n['likes'] += 1
                liked = True

            save_notes(notes)
            return jsonify({'id': note_id, 'likes': n['likes'], 'liked': liked})

    abort(404, description='Note not found')


@app.route('/api/notes/<int:note_id>/star', methods=['POST'])
def star_note(note_id):
    """Toggle or set starred state for a note. Accepts optional JSON {"starred": true/false}.
    If no JSON provided, toggle the current state."""
    notes = load_notes()
    body = request.get_json(silent=True) or {}
    for n in notes:
        if n.get('id') == note_id:
            if 'starred' in body:
                n['starred'] = bool(body.get('starred'))
            else:
                n['starred'] = not bool(n.get('starred', False))
            save_notes(notes)
            return jsonify({'id': note_id, 'starred': n['starred']})
    abort(404, description='Note not found')


if __name__ == '__main__':
    # When run directly, ensure notes.json exists
    if not os.path.exists(DATA_PATH):
        save_notes([])
    app.run(debug=True, host='0.0.0.0')