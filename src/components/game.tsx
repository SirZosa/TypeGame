import { useState, useEffect, useRef } from "react";
import confetti from 'canvas-confetti'
import Modal from "./modal";
import Menu from "./menu";
  type word = {
    letter: string;
    active: boolean;
    correct: boolean;
    incorrect: boolean;
    last: boolean;
    complete: boolean;
  }
export default function Game(): JSX.Element{
    const[data, setData] = useState<String[]| null>(null);
    const[wordLetters, setWordLetters] = useState<word[][]|null>(null);
    const[wordCopy, setWordCopy] = useState<word[][]|null>(null);
    const[paragraph, setParagraph] = useState<JSX.Element[]|null>(null);
    const[wordIndex, setWordIndex] = useState<number>(0);
    const[letterIndex, setLetterIndex] = useState<number>(0);
    const [correctLetters, setCorrectLetters] = useState<number>(0);
    const [incorrectLetters, setIncorrectLetters] = useState<number>(0);
    const [accuracy, setAccuracy] = useState<number>(0);
    const [completedWords, setCompletedWords] = useState<number>(0);
    const [timePass, setTimePass] = useState<number>(0);
    const [wpm, setWpm] = useState<number>(0);
    const [time, setTime] = useState<number>(60);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [difficulty, setDifficulty] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [confe, setConfe] = useState<boolean>(false);
    const inputRef = useRef(null);


    useEffect(() => {
      if(gameStarted){
      if(time == 0) {
        if(!confe){
          confetti()
        }
        setGameStarted(false);
        setConfe(true);
      }
        if (time > 0) {
            const timerId = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
            setTimePass(prev=>prev+1);
            return () => clearInterval(timerId); // Cleanup the interval on component unmount
        }
      }
    }, [time, gameStarted]);

    useEffect(()=>{
      setLoading(true)
      let length = difficulty == 0 ? "" : difficulty == 1 ? "&length=4" : difficulty == 2 ? "&length=6" : difficulty == 3 ? "&length=8" : difficulty == 4 ? "&length=10" : "&length=15"
      fetch(`https://random-word-api.herokuapp.com/word?number=50${length}`)
        .then(response => response.json())
        .then(data => {
          setData(data)
          setLoading(false)
        })
    }, [difficulty])

    useEffect(()=>{
      if(completedWords>0 && timePass>0 && gameStarted){
        let wpm = (completedWords * 60) /  timePass;
        setWpm(wpm);
      }
    }, [completedWords, timePass])

    useEffect(()=>{
      if(correctLetters>0 && gameStarted){
        let total = correctLetters + incorrectLetters
        let acc = (correctLetters / total) * 100;
        setAccuracy(acc)
      }
    },[correctLetters, incorrectLetters])

    useEffect(()=>{
        fetch("https://random-word-api.herokuapp.com/word?number=50")
        .then(response => response.json())
        .then(data => setData(data))
    }, []);

    useEffect(() => {
      focusInput();
    }, []);

    useEffect(() => {
      if (data) {
        const wordLetterss:word[][] = data.map(word =>{
          let newWord = word.split("");
          let letterObj = newWord.map(letter => {
            return {letter:letter, active:false, correct:false, incorrect:false, last: false, complete:false}
          })
          return letterObj;
        });
        setWordCopy(JSON.parse(JSON.stringify(wordLetterss)))
        setWordLetters(wordLetterss)
      }
    }, [data]);

    useEffect(()=>{
      if(wordLetters){
        let arr:word[][] = wordLetters;
        if(arr[wordIndex][letterIndex - 1] != undefined) {
          arr[wordIndex][letterIndex-1] = {...arr[wordIndex][letterIndex-1], last: letterIndex == arr[wordIndex].length ? true: false}
        }
        if(arr[wordIndex][letterIndex]){
          arr[wordIndex][letterIndex] = {...arr[wordIndex][letterIndex], active:true, last: false};
        }
        setWordLetters(arr);
      }
    },[letterIndex])

    useEffect(()=>{
      if(wordLetters){
        let arr:word[][] = wordLetters;
        if(arr[wordIndex-1] != undefined) {
          arr[wordIndex-1][arr[wordIndex-1].length-1] = {...arr[wordIndex-1][arr[wordIndex-1].length-1], active:false, last: false}
          let allTrue = true;
          for(let i = 0 ; i< arr[wordIndex-1].length; i++){
            if(arr[wordIndex-1][i].correct == false) allTrue = false;
          }
          if(allTrue){
            for(let i = 0 ; i< arr[wordIndex-1].length; i++){
              arr[wordIndex-1][i].complete = true;
            }
            if(arr[wordIndex][0].active){
              setCompletedWords(prev => prev+1);
            }
          }
        }
        setWordLetters(arr);
      }
    },[wordIndex])

   

    useEffect(()=>{
      if(wordLetters){
        const wordsHTML = wordLetters.map(word =>{
          return (
            <p className="word" key={crypto.randomUUID()}>{word.map(letter => {
              const isActive = letter.active ? "active" : "inactive";
              const isCorrect = letter.correct ? "correct" : " ";
              const isIncorrect = letter.incorrect ? "incorrect" : " ";
              const lastLetter = letter.last ? "last" : "";
              const isComplete = letter.complete ? "complete" : " ";
              const className = isActive + " " + isCorrect + " " + isIncorrect + " " + lastLetter + " " + isComplete;
              return (
                <span className={className} key={crypto.randomUUID()}>{letter.letter}</span>
              )
            })}</p>
          )
        })
        setParagraph(wordsHTML);
      }
    },[wordLetters, letterIndex, wordIndex])

    function checkLetter(key: string){
      if(!gameStarted){
        setGameStarted(true);
      }
      if(wordLetters && wordCopy){
        if(key == " "){
          space();
        }
        if(key == "Backspace"){
          erase();
        }
        else if(wordLetters[wordIndex][letterIndex]?.letter == key){
            correctLetter(key);
            if(wordLetters[wordIndex][letterIndex]){
              setLetterIndex(prev => prev + 1);
            }
            else setLetterIndex(prev => prev)
            
        }
        else if(wordLetters[wordIndex][letterIndex]?.letter != key && /^[a-zA-Z]$/.test(key)){
          wrongLetter(key);
          if(wordLetters[wordIndex][letterIndex]){
            setLetterIndex(prev => prev + 1);
          }
          else setLetterIndex(prev => prev)
        }
      }
    }

    function space(){
      if(wordLetters){
        let arr:word[][] = wordLetters;
        if(arr[wordIndex][letterIndex] != undefined) {
          arr[wordIndex].map(letter => letter.active = false);
          arr[wordIndex+1][0] = {...arr[wordIndex+1][0], active:true}
          setWordLetters(arr);
        }
        if(arr[wordIndex+1]){
          setWordIndex(prev => prev +1);
          setLetterIndex(0);
        }
      }
    }

    function setTimes(arg:number){
      setTime(arg);
    }

    function setDifficultys(arg:number){
      setDifficulty(arg);
    }

    function wrongLetter(arg:string){
      if(wordLetters){
        let arr:word[][] = wordLetters;
        if(arr[wordIndex][letterIndex] != undefined) {
          arr[wordIndex][letterIndex] = {letter:arg, active:false, correct: false, incorrect: true, last: letterIndex == arr[wordIndex].length ? true: false, complete:false}
          setWordLetters(arr);
          if(gameStarted && time != 0){
            setIncorrectLetters(prev => prev +1)
          }
        }
      }
    }

    function correctLetter(arg:string){
      if(wordLetters){
        let arr:word[][] = wordLetters;
        if(arr[wordIndex][letterIndex] != undefined) {
          arr[wordIndex][letterIndex] = {letter:arg, active:false, correct: true, incorrect: false, last: letterIndex == arr[wordIndex].length ? true: false, complete:false}
          setWordLetters(arr);
          if(gameStarted && time !=0){
            setCorrectLetters(prev => prev+1);
          }
        }
      }
    }

    function erase(){
      if(letterIndex == 0 && wordIndex > 0 && wordLetters){
        if(wordLetters && wordCopy){
          let arr:word[][] = wordLetters;
          if(arr[wordIndex-1] != undefined && arr[wordIndex-1][arr[wordIndex-1].length-1].complete) return;
          if(arr[wordIndex-1] != undefined) {
            arr[wordIndex-1][arr[wordIndex-1].length-1] = {...arr[wordIndex-1][arr[wordIndex-1].length-1], active:false, last:true};
            arr[wordIndex][letterIndex] = {...arr[wordIndex][letterIndex],active:false, correct:false, incorrect:false};
            setWordLetters(arr);
          }
        }
        setLetterIndex(wordLetters[wordIndex-1].length);
        setWordIndex(prev => prev-1);
      }
      else if(wordLetters && wordCopy){
        let arr:word[][] = wordLetters;
        if(arr[wordIndex][letterIndex-1]) {
          if(arr[wordIndex][letterIndex-1].last){
            arr[wordIndex][letterIndex-1] = {...arr[wordIndex][letterIndex-1], letter:wordCopy[wordIndex][letterIndex-1].letter, correct:false, incorrect:false}
          }
          else{
            arr[wordIndex][letterIndex] = {...arr[wordIndex][letterIndex], active:false}
            arr[wordIndex][letterIndex-1] = {...arr[wordIndex][letterIndex-1], letter:wordCopy[wordIndex][letterIndex-1].letter, correct:false, incorrect:false}
          }
          setWordLetters(arr);
          setLetterIndex(prev => prev-1);
        }
      }
    }

    function focusInput(){
      if(inputRef.current){
        inputRef.current.focus();
      }
    }

    function restart(){
      setGameStarted(false)
      setWordIndex(0)
      setLetterIndex(0)
      setTime(60)
      setCompletedWords(0)
      setCorrectLetters(0)
      setIncorrectLetters(0)
      setTimePass(0)
      setConfe(false)
      setAccuracy(0)
      setWpm(0)
      if(difficulty == 0){
        setDifficulty(1)
      }
      else{
        setDifficulty(0);
      }
    }
    return (
        <>
        <main>
        <Modal isOpen={loading}/>
        <Menu setDifficultys={setDifficultys} setTimes={setTimes} time={time} difficulty={difficulty} accuracy={accuracy} wpm={wpm} gameStarted={gameStarted}/>
        <section className="paragraph" onClick={()=> focusInput()}>
        {paragraph}
        </section>
        <button className="restart-button" onClick={() => restart()}>Restart</button>
        </main>
        <input className="input" type="text" ref={inputRef} autoFocus onKeyDown={(e)=>checkLetter(e.key)}/>
        </>
        
    )
}