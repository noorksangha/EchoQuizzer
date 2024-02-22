import subprocess
from pyannote.audio import Pipeline
from pydub import AudioSegment
import whisper
import numpy as np
import gc

# Path to the original audio file
# original_audio_path = "C:\\Users\\16043\\Desktop\\whisper\\recording.wav"
original_audio_path = "C:\\Users\\16043\\Downloads\\recording.wav"
# Path to the converted audio file
converted_audio_path = "C:\\Users\\16043\\Desktop\\whisper\\output.wav"
# Path to the transcription file
transcription_file_path = "C:\\Users\\16043\\Desktop\\whisper\\tr_file.txt"

# Convert the audio file to the desired format and sample rate using ffmpeg
subprocess.run(["ffmpeg", "-i", original_audio_path, "-acodec", "pcm_s16le", "-ar", "44100", converted_audio_path], check=True)

pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.1", use_auth_token='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')

def read(k):
    y = np.array(k.get_array_of_samples())
    return np.float32(y) / 32768

def millisec(timeStr):
    try:
        spl = timeStr.split(":")
        return int(int(spl[0]) * 60 * 60 + int(spl[1]) * 60 + float(spl[2])) * 1000
    except ValueError:
        print(f"Invalid time format: {timeStr}")
        return 0

# Use the converted file for further processing
k = str(pipeline(converted_audio_path)).split('\n')

del pipeline
gc.collect()

audio = AudioSegment.from_wav(converted_audio_path)
audio = audio.set_frame_rate(16000)

model = whisper.load_model("small.en")

for l in range(len(k)):
    j = k[l].split(" ")
    start = int(millisec(j[1].rstrip(']')))
    end = int(millisec(j[4].rstrip(']')))

    tr = read(audio[start:end])

    result = model.transcribe(tr, fp16=False)

    with open(transcription_file_path, "a") as f:
        f.write(f'\n[ {j[1]} -- {j[3]} ] {j[6]} : {result["text"]}')

    del result, tr, j
    gc.collect()
