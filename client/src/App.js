import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-quill/dist/quill.snow.css';
const App = () => {
  const [error, setError] = useState(null)
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)

  const [chatHistory, setChatHistory] = useState([])
  //to clear the input field
  const clear = () => {
    setError(null)
    setValue('')
    setChatHistory([])
  }


  //options to select randomly from 
  const selectRandomOPtions = [
    "How were  you made?",
    "How do i make a pizza ?",
    "What time is it today?",
    "What is the best coding language?",
    "What's your favorite hobby or pastime?",
"If you could travel anywhere in the world right now, where would you go?",
"What's the most interesting thing you've learned recently?",
"Do you prefer reading books or watching movies?",
"If you could have any superpower, what would it be and why?",
"What's your go-to comfort food?",
"If you could meet any historical figure, who would it be and what would you ask them?",
"What's your favorite way to relax after a long day?",
"What's the best piece of advice you've ever received?",
"If you could switch lives with any fictional character for a day, who would it be and what would you do?"
  ]


  const selectRandomly = () => {
    const randomValue = selectRandomOPtions[Math.floor(Math.random() * selectRandomOPtions.length)]
    setValue(randomValue)
  }

  // use to send our query to the server`
  const getResponse = async () => {
    if (!value) {
      setError(" Error: please enter a value")
      return
    }

    try {


      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          history: chatHistory,
          message: value
        })
      }

      //loading while awaitind response 
      setLoading(true)
      // its use to recieve messages from the server


      const response = await fetch("https://gemini-server-1kvg.onrender.com/gemini/send-response", options)
      const data = await response.text()
      console.log(data)
     // Format bot response
    
     const formattedRes = data.split('.').join('. \n ');
     setChatHistory(oldChatHsitory =>
        [...oldChatHsitory, {
          role: "user",
          parts: value
        },
        {
          role: "model",
          parts: formattedRes
        }]
      )

       setValue('')
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setError("something went wrong")

    }
  }

        const listenEnter = (e)=>{
    if(e.key === "Enter") {
      getResponse()
    }
  }

  return (
    <div className="app">
      <h1 className='app-title'>Geminiod</h1>
      <section className='app'>
        <p>
          what do you want to know?
          <button className='suprise-me' onClick={selectRandomly} disabled={!chatHistory}> suprise me </button>
        </p>



        <div className='search-container'>
          <input value={value} placeholder='What is todays weather?' onKeyDown={listenEnter}  onChange={e => setValue(e.target.value)}></input>
          {!error && <button className='search-button' onClick={getResponse}>Search</button>}
          {error && <button className='search-button' onClick={clear}>clear</button>
          }

        </div>
        <p>{error}</p>

        <div className='search-result'>
        {loading ?(<div className='Answer'>
            <div class="d-flex justify-content-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div></div>)
            :
          (
            
            chatHistory.map((chatItem, _index) => {
            return <div className='Answer' key={_index}>
              <p>
            {chatItem.role} : {chatItem.parts}
              </p>
            </div>

          }))}
       
        </div>
      </section>

    </div>
  );

}

export default App;
