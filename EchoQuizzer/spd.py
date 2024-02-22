from pyannote.audio import Pipeline
from pydub import AudioSegment
import whisper
import numpy as np
import gc

pipeline = Pipeline.from_pretrained(
    "pyannote/speaker-diarization-3.1", use_auth_token='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')


def read(k):
    y = np.array(k.get_array_of_samples())
    return np.float32(y) / 32768


def millisec(timeStr):
    try:
        spl = timeStr.split(":")
        return int(int(spl[0]) * 60 * 60 + int(spl[1]) * 60 + float(spl[2])) * 1000
    except ValueError:
        print(f"Invalid time format: {timeStr}")
        return 0  # or appropriate error handling


k = str(pipeline(
    "C:\\tomcat\\webapps\\trivia\\WEB-INF\\classes\\test.wav")).split('\n')

del pipeline
gc.collect()

audio = AudioSegment.from_wav(
    "C:\\tomcat\\webapps\\trivia\\WEB-INF\\classes\\test.wav")
audio = audio.set_frame_rate(16000)

model = whisper.load_model("small.en")

for l in range(len(k)):
    j = k[l].split(" ")
    start = int(millisec(j[1].rstrip(']')))  # remove trailing ']'
    end = int(millisec(j[4].rstrip(']')))

    tr = read(audio[start:end])

    result = model.transcribe(tr, fp16=False)

    f = open("C:\\Users\\cassi\\Documents\\Cassidy\\BCIT\\TERM4\\COMP4941\\EchoQuizzer\\EchoQuizzer\\output.txt", "a")
    f.write(f'\n[ {j[1]} -- {j[3]} ] {j[6]} : {result["text"]}')
    f.close()

    del f
    del result
    del tr
    del j
    gc.collect()
