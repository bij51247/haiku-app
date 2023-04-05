import { useCallback, useEffect, useState } from 'react';
import { PromptInput } from './PromptInput';
import classes from "./CssModules.module.scss"
import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/';
const API_KEY = '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';

const App = () => {
  const [imageData, setImageData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [upperPrompt, setUpperPrompt] = useState('');
  const [middlePrompt, setMiddlePrompt] = useState('');
  const [bottomoPrompt, setBottomoPrompt] = useState('');
  const [error, setError] = useState('');
  const [format, setFormat] = useState('b64_json');
  const [generateSize, setGenerateSize] = useState('512x512');
  const [imageSize, setImageSize] = useState(512);
  var prompt = upperPrompt +  middlePrompt +  bottomoPrompt;

  const isButtonActive = upperPrompt !== '' && middlePrompt !== '' && bottomoPrompt !== '';

  //Google API_KEY
  // AIzaSyAlxn5LKcNw083_QJRaZQyy2b5OA3xSnAA

  const generateImage = useCallback(async () => {
    console.log(prompt)

    if (isLoading) return;

    setIsLoading(true);

    try {

      const URL = "https://translation.googleapis.com/language/translate/v2?key=" + "AIzaSyAlxn5LKcNw083_QJRaZQyy2b5OA3xSnAA" +
        "&q=" + encodeURI(prompt) + "&source=" + 'ja' + "&target=" + 'en'
      let xhr = new XMLHttpRequest()
      xhr.open('POST', [URL], false)
      xhr.send();
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        prompt = res["data"]["translations"][0]["translatedText"]
      }
      console.log(prompt)

      const response = await axios.post(
        `${API_URL}images/generations`,
        {
          prompt,
          n: 1,
          size: "512x512",
          response_format: "b64_json",
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          }
        }
      );

      setImageData(response.data.data[0][format]);

    } catch (error) {
      setError(error.toString());

    } finally {
      setIsLoading(false);
    }
  }, [format, generateSize, prompt, isButtonActive, isLoading]);

  return (
    <div className={classes.container}>
      <div className={classes.header}>ぼくの俳句世界</div>
      <div className='generate-form'>

        <label>俳句を描いてみよう！</label>
        <PromptInput
          prompt={upperPrompt}
          maxLength='60'
          onChange={(e) => setUpperPrompt(e.target.value)}
        />
        <PromptInput
          prompt={middlePrompt}
          maxLength='80'
          onChange={(e) => setMiddlePrompt(e.target.value)}
        />
        <PromptInput
          prompt={bottomoPrompt}
          maxLength='60'
          onChange={(e) => setBottomoPrompt(e.target.value)}
        />
        <button
          onClick={generateImage}
          disabled={!upperPrompt || !middlePrompt || !bottomoPrompt || isLoading}
        >
          {isLoading ? '作成中...' : '画像作成'}
        </button>
      </div>
      {error && (
        <div className='error-message'>
          <pre>{error}</pre>
        </div>
      )}
      {imageData && (
        <div className='generated-image-area'>
          <figure>
            <img
              src={format === 'b64_json'
                ? `data:image/png;base64,${imageData}`
                : imageData
              }
              alt="Received Data"
              width={imageSize}
              height={imageSize}
            />
          </figure>
        </div>
      )}
    </div>
  );
};

export default App;