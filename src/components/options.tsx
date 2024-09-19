import {useState, useEffect} from "react"
interface Props{
    display: string;
    options:string[]
    change: (arg:number) => void;
}
export default function Options({display, options, change}:Props){

    const [optionIndex, setOptionIndex] = useState<number>(0);

    let optionsHTML = options.map((option, index) => {
        let selected = optionIndex == index ? "selected" : " ";
        let className = "menu-choice" + " " + selected
        return (
            <span className={className} onClick={()=>setOptionIndex(index)}>{option}</span>
        )
    })

    useEffect(()=>{
        change(optionIndex);
    },[optionIndex])

    return(
        <div className="options">
            <span className="option-selected">{display + " " + options[optionIndex]}</span>
            <div className="menu-choices">{optionsHTML}</div>
        </div>
    )
}