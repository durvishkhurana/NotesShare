# Carevo Backend (Notes API)

This small Flask API provides endpoints used by the Carevo frontend notes page.

Endpoints

- `GET /` — simple welcome message
- `GET /api/notes` — returns all notes. Optional query: `?category=trending|recent|recommended`
- `GET /api/notes/<id>` — returns one note by id
- `POST /api/notes` — create a new note. Expects JSON body with at least `title` and `drive_link`. Optional: `subtitle`, `author`, `image`, `tag`, `category`.

Notes store

Notes are persisted to `notes.json` in this folder. Each note object contains `id`, `title`, `subtitle`, `author`, `image`, `tag`, `drive_link`, and `category`.

Run locally

1. Create a virtualenv (optional) and install requirements:

```powershell
cd d:\brooooo\backend
python -m venv .venv
.\.venv\Scripts\Activate
pip install -r requirements.txt
```

2. Start the app:

```powershell
python app.py
```

By default the app runs on `http://0.0.0.0:5000`.

Example curl

List all notes:

```powershell
curl http://localhost:5000/api/notes
```

Create a note (example):

```powershell
curl -X POST http://localhost:5000/api/notes -H "Content-Type: application/json" -d '{"title":"New Note","drive_link":"https://drive.google.com/file/d/FILE_ID/view?usp=sharing"}'
```

Frontend integration hints

- When rendering a note card, use the note's `drive_link` to point a click action to open the link in a new tab (e.g., anchor target="_blank").
- To allow users to upload a Google Drive link, call `POST /api/notes` with the provided metadata from the upload form.
