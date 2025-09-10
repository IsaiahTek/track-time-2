interface Duration{
    weeks?:number,
    days?:number,
    hours?:number,
    minutes?:number,
    seconds?:number,
    milliseconds?:number,
    // millisecondsFraction:number
    toMilliseconds?():number,
    // getMillisecondsFraction():number
};

type NoteAddType = {
    title: String,
    details: String,
    date: number,
}
interface Note extends NoteAddType{
    id: number,
}
type Notes = Note[]

type DurationState = {duration: number}