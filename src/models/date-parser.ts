export class DateParser{
    date!: Date | number;
    constructor(date:Date|number){
        this.date = date;
    }

    toInt(){
        return new Date(this.date).getTime()
    }

    toDate(){
        return new Date(this.date);
    }
}