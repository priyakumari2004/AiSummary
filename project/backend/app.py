from flask import Flask, request, jsonify
from moviepy.editor import VideoFileClip
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/extract-audio', methods=['POST'])
def extract_audio():
    if 'video' not in request.files:
        return jsonify({'error': 'No video uploaded'}), 400
    
    video = request.files['video']
    video_path = f'temp_{video.filename}'
    video.save(video_path)
    
    audio_path = f'{video_path}.mp3'
    
    # Extract audio
    video_clip = VideoFileClip(video_path)
    video_clip.audio.write_audiofile(audio_path)
    video_clip.close()
    
    # Return audio file as response (optional: you could upload to cloud storage)
    return jsonify({'audio_filename': audio_path})

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio uploaded'}), 400
    
    audio = request.files['audio']
    audio_path = f'temp_{audio.filename}'
    audio.save(audio_path)

    # Use OpenAI Whisper API (assuming you want to use OpenAI hosted Whisper)
    with open(audio_path, 'rb') as f:
        transcript = openai.Audio.transcribe("whisper-1", f)
    
    return jsonify({'transcription': transcript['text']})

@app.route('/summarize', methods=['POST'])
def summarize_text():
    data = request.get_json()
    text = data.get('text')
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You summarize meeting transcripts concisely."},
            {"role": "user", "content": text}
        ],
        max_tokens=300,
    )
    
    summary = response['choices'][0]['message']['content']
    return jsonify({'summary': summary})

if __name__ == '__main__':
    app.run(debug=True)
