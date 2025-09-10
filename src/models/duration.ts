export class Duration implements Duration{
    weeks:number;
    days:number;
    hours:number;
    minutes:number;
    seconds:number;
    milliseconds:number;
    millisecondsLeft = this.totalMilliseconds;
    isTimeUp = this.totalMilliseconds <= 0

    private _totalMilliseconds = 0;

    private get totalMilliseconds(){
       return this._totalMilliseconds;   
    }

    private set totalMilliseconds(milliseconds:number){
        this._totalMilliseconds = milliseconds;
    }

    private _tickID : number | undefined = 0;
    public _isPaused = false;

    public tickTime(){
        let tickID
        if(!this.totalMilliseconds){
            this.totalMilliseconds = this.toMilliseconds()
        }
        if(this.totalMilliseconds){
            tickID = setInterval(()=>{
                if(this.totalMilliseconds){
                    this.totalMilliseconds = this.totalMilliseconds - 100;
                }
            }, 100)
        }
        this._tickID = tickID;
        return tickID;
    }

    pauseTick(){
        clearInterval(this._tickID);
        // this._tickID = undefined;
        this._isPaused = true;
    }

    now(){
        const newDuration = Duration.toDuration(this.totalMilliseconds)
        this.weeks = newDuration.weeks;
        this.days = newDuration.days;
        this.hours = newDuration.hours;
        this.minutes = newDuration.minutes;
        this.seconds = newDuration.seconds;
        this.milliseconds = newDuration.milliseconds;
        this.millisecondsLeft = this.totalMilliseconds;
        this.isTimeUp = this.totalMilliseconds <= 0;
        return this;
    }

    private weeksToMilliseconds():number{
        return this.weeks * 7 * 24 * 60 * 60 * 1000;
    }

    private daysToMilliseconds():number{
        return this.days * 24 * 60 * 60 * 1000;
    }

    private hoursToMilliseconds():number{
        return this.hours * 60 * 60 * 1000;
    }

    private minutesToMilliseconds():number{
        return this.minutes * 60 * 1000;
    }

    private secondsToMilliseconds():number{
        return this.seconds * 1000;
    }

    toMilliseconds():number{
        const totalMilliseconds = this.weeksToMilliseconds() + this.daysToMilliseconds() + this.hoursToMilliseconds() + this.minutesToMilliseconds() + this.secondsToMilliseconds() + this.milliseconds;
        return totalMilliseconds;
    }

    public get inSeconds():number{
        return Math.floor(this.toMilliseconds()/(1000));
    }

    public get inMinutes():number{
        return this.inSeconds/60;
    }

    static toDuration(milliseconds:number):Duration{
        const weeks = Math.floor(milliseconds / (7 * 24 * 60 * 60 * 1000));
        const weeksMillisecondsRemainder = milliseconds % (7 * 24 * 60 * 60 * 1000)

        const days = Math.floor(weeksMillisecondsRemainder / (24 * 60 * 60 * 1000));
        const daysMillisecondsRemainder = weeksMillisecondsRemainder % (24 * 60 * 60 * 1000);
        
        const hours = Math.floor(daysMillisecondsRemainder / (60 * 60 * 1000));
        const hoursMillisecondsRemainder = daysMillisecondsRemainder % (60 * 60 * 1000)

        const minutes = Math.floor(hoursMillisecondsRemainder / (60 * 1000));
        const minutesMillisecondsRemainder = hoursMillisecondsRemainder % (60 * 1000);

        const seconds = Math.floor(minutesMillisecondsRemainder / (1000));
        const secondssMillisecondsRemainder = minutesMillisecondsRemainder % (1000);
        
        return new Duration({weeks:weeks, days: days, hours: hours, minutes: minutes, seconds:seconds, milliseconds: secondssMillisecondsRemainder})
    }

    

    constructor(duration:{weeks?:number, days?:number, hours?:number, minutes?:number, seconds?:number, milliseconds?:number}){
        this.weeks = duration.weeks??0;
        this.days = duration.days??0;
        this.hours = duration.hours??0;
        this.minutes = duration.minutes??0;
        this.seconds = duration.seconds??0;
        this.milliseconds = duration.milliseconds??0;
    }

}