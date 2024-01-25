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

        await ipcRenderer.invoke(
            "query-database",
            `DELETE FROM dataMarks WHERE markId = ${id}`
        );
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

const getMarkByNotObtained = async(marks:number[]|null):Promise<Mark[]> => {
    try {
        let query = "";
        if(marks != null){
            query = `SELECT * FROM marks WHERE NOT (`;
            for (let i = 0; i < marks.length; i++) {
               if(i == marks.length -1){
                query +=`id = ${marks[i]} )`;
               }else{
                query +=`id = ${marks[i]} OR `;
               }
            }
           
        }else{
            query = `SELECT * FROM marks`
        }
        const results = await ipcRenderer.invoke(
          "query-database",
          query
        );
       
        return await results;
    } catch (error) {
        return Promise.reject(error);
    }
}

const createImpaMark = async(impaId:number , items:any[]):Promise<boolean> => {
    try {
        const values = items.map(item => `(${impaId}, ${item})`).join(',');
        const results = await ipcRenderer.invoke(
          "query-database",
          `INSERT INTO dataMarks (dataId, markId) VALUES ${values}`,
        );
        if(results){
            return true;
        }
        return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

const deleteImpaMark = async(dataId:number, markId:number):Promise<boolean> => {
    try {
        const results = await ipcRenderer.invoke(
          "query-database",
          `DELETE FROM dataMarks WHERE dataId = ${dataId} AND markId = ${markId}`
        );
        if(results){
            return true;
        }
        return false;
    } catch (error) {
        return Promise.reject(error);
    }
}



export { getAllMark,  createMark, deleteMark, checkMark, getMarkByNotObtained, createImpaMark, deleteImpaMark};