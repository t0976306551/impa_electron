import {Mark} from "@/model/mark.interface";
import { ipcRenderer } from "electron";

const getAllMark = async():Promise<Mark[]> => {
    try {
        const results:Mark[] = await ipcRenderer.invoke(
          "query-database",
          "SELECT * FROM marks"
        );
        return await results; 
    } catch (error) {
        return Promise.reject(error);
    }
}

const createMark = async(name:string):Promise<boolean> => {
    try {
        const results = await ipcRenderer.invoke(
          "query-database",
          `INSERT INTO marks (name) VALUES ("${name}")`,
        );
        if(results){
            return true;
        }
        return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

const deleteMark = async(id:number):Promise<boolean> => {
    try {
        const results = await ipcRenderer.invoke(
          "query-database",
          `DELETE FROM marks WHERE id = ${id}`
        );
        if(results){
            return true;
        }
        return false;
    } catch (error) {
        return Promise.reject(error);
    }
}


const checkMark = async(name:string):Promise<boolean> => {
    try {
        const results = await ipcRenderer.invoke(
          "query-database",
          `SELECT * FROM marks WHERE name = "${name}"`
        );
        if(results.length > 0){
            return true;
        }
        return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

export { getAllMark,  createMark, deleteMark, checkMark};