import Database, { QueryResult } from "@tauri-apps/plugin-sql"

const db = Database.load('sqlite:track-time.db')
export abstract class BaseModel{
    table!:string
    // constructor(){}
    private _dbObject = async()=> await db.then(dbx=>dbx)

    get databaseObject(){
        return this._dbObject();
    }

    public createTableIfNotExist = async(schema:string[])=>await (await this.databaseObject).execute(`CREATE TABLE IF NOT EXISTS ${this.table} (${schema.join(", ")})`);

    public delete = async(id:number)=>await (await this.databaseObject).execute(`DELETE FROM ${this.table} WHERE id = ${id}`);

    public dropTable = async()=>await (await this.databaseObject).execute(`DROP TABLE ${this.table}`);

    abstract fetch(offset:number, amount:number):Promise<Notes|DurationState[]>

    abstract add<Type extends Note>(type:Type):Promise<QueryResult>
    abstract add<Type extends DurationState>(type:Type):Promise<QueryResult>

    abstract update<Type extends Note>(type: Type):Promise<QueryResult>
    abstract update<Type extends DurationState>(type: Type):Promise<QueryResult>
}