import {useState} from "react";
interface Props{
    setDifficultys : (arg:number)=>void;
    setTimes: (arg:number)=>void;
    time:number;
    difficulty: number;
    accuracy: number;
    wpm:number;
    gameStarted: boolean;
}
export default function Menu({setDifficultys, setTimes, time, difficulty, accuracy, wpm, gameStarted}:Props){
    const [open, setOpen] = useState<boolean>(false);
    const [open1, setOpen1] = useState<boolean>(false);
    const diff = difficulty == 0 ? "Any" : difficulty == 1 ? "Easy" : difficulty == 2 ? "Normal" : "Hard";
    
    

    function setDiff(arg:number){
        setOpen(false);
        if(gameStarted) return;
        setDifficultys(arg)
    }

    function settingTime(arg:number){
        setOpen1(false);
        if(gameStarted) return;
        setTimes(arg)
    }
    return(
        <div className="menu">
            <div className="options">
                <span className="options-selected">Timer: {time} seg</span>
            </div>
            <div className="options">
                <span className="options-selected">Accuracy: {accuracy.toFixed(2)} %</span>
            </div>
            <div className="options">
                <span className="options-selected">WPM: {wpm.toFixed(2)}</span>
            </div>
            <div className="options">
                <span className="options-selected" onClick={() => setOpen(prev =>!prev)}>Difficulty: {diff}</span>
                <div className={`menu-options ${open ? "open" : "closed"}`}>
                    <span className="menu-choices" onClick={()=>setDiff(0)}>Any</span>
                    <span className="menu-choices"onClick={()=>setDiff(1)}>Easy</span>
                    <span className="menu-choices"onClick={()=>setDiff(2)}>Normal</span>
                    <span className="menu-choices"onClick={()=>setDiff(3)}>Hard</span>
                    <span className="menu-choices"onClick={()=>setDiff(4)}>Very hard</span>
                    <span className="menu-choices"onClick={()=>setDiff(5)}>{">:C"}</span>
                </div>
            </div>
            <div className="options">
                <span className="options-selected" onClick={() => setOpen1(prev =>!prev)}>Time:seg</span>
                <div className={`menu-options ${open1 ? "open" : "closed"}`}>
                    <span className="menu-choices" onClick={()=> settingTime(15)}>15</span>
                    <span className="menu-choices"onClick={()=> settingTime(30)}>30</span>
                    <span className="menu-choices"onClick={()=> settingTime(45)}>45</span>
                    <span className="menu-choices"onClick={()=> settingTime(60)}>60</span>
                </div>
            </div>


        </div>
    )
}