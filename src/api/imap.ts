import { ipcRenderer } from "electron";
import type { Item, ItemWhole } from "@/model/item.interface";
import type { Mark, DataMarks} from "@/model/mark.interface";

const getImpaDataByTypeId = async (typeId:any): Promise<ItemWhole[]> => {
    try {
        const results:ItemWhole[] = await ipcRenderer.invoke(
            "query-database",
            "SELECT datas.*, type.name AS typeName FROM datas "+
            "INNER JOIN type ON datas.typeId = type.id "+
            `WHERE typeId = ${typeId}`
        );
        for (const result of results) {
            const marks: Mark[] = await ipcRenderer.invoke(
              "query-database",
              `SELECT marks.* FROM marks `+
              "INNER JOIN dataMarks ON marks.Id = dataMarks.markId "+
              `WHERE dataMarks.dataId = ${result.id}`
            );
            if(marks.length > 0){
                result.marks = marks;
            }
        }   
        return await results; 
    } catch (error) {
        return Promise.reject(error);
    }
};


const getImpaDataByStore = async (): Promise<ItemWhole[]> => {
    try {
        const results:ItemWhole[] = await ipcRenderer.invoke(
            "query-database",
            "SELECT datas.*, type.name AS typeName FROM datas "+
            "INNER JOIN type ON datas.typeId = type.id "+
            `WHERE storeStatus = 1`
        );
        for (const result of results) {
            const marks: Mark[] = await ipcRenderer.invoke(
              "query-database",
              `SELECT marks.* FROM marks `+
              "INNER JOIN dataMarks ON marks.Id = dataMarks.markId "+
              `WHERE dataMarks.dataId = ${result.id}`
            );
            if(marks.length > 0){
                result.marks = marks;
            }
        }   
        return await results; 
    } catch (error) {
        return Promise.reject(error);
    }
};

const getImpaDataByCondition = async (code:string, chName:string, enName:string, remark:string, markId:string): Promise<ItemWhole[] | boolean> => {
    try {
        let query = "SELECT datas.*, type.name AS typeName FROM datas "+
                    "INNER JOIN type ON datas.typeId = type.id";
        if(code == "" && chName == "" && enName == "" && remark == "" && markId == ""){
            return false;
        }
        if(code!=""){
            query+=` WHERE datas.code LIKE '%${code}%'`;
        }
        if(chName!=""){
            if(code==""){
                query+=` WHERE datas.chineseName LIKE '%${chName}%'`;
            }else{
                query+` AND datas.chineseName LIKE '%${chName}%'`;
            }
        }
        if(enName != ""){
            if(code==""){
                if(chName==""){
                    query+=` WHERE datas.englishName LIKE '%${enName}%'`;
                }
            }else{
                query+=` AND datas.englishName LIKE '%${enName}%'`;
            }
        }
        if(remark != ""){
            if(code==""){
                if(chName==""){
                    if(enName == ""){
                        query+=` WHERE datas.remark LIKE '%${remark}%'`;
                    }
                }
            }else{
                query+=` AND datas.remark LIKE '%${remark}%'`;
            }
        }
        let results = [];
        if(code != "" || chName !="" ||  enName != "" || remark != ""){
            results = await startQuery(query);
        }
      
        if(markId != ""){   
            if(remark == ""){
                if(code==""){
                    if(chName==""){
                        if(enName == ""){
                            if(results.length<1){
                                query = "SELECT datas.*, type.name AS typeName FROM datas "+
                                "INNER JOIN type ON datas.typeId = type.id " +
                                "INNER JOIN dataMarks ON datas.id = dataMarks.dataId "+
                                `WHERE dataMarks.markId = ${markId}`;
                                results = await startQuery(query);
                            }
                        }
                    }
                }
            }else{
                query+=` AND dataMarks.markId = ${markId}`;
            }
        }
    
        for (const result of results) {
            const marks: Mark[] = await ipcRenderer.invoke(
              "query-database",
              `SELECT marks.* FROM marks `+
              "INNER JOIN dataMarks ON marks.Id = dataMarks.markId "+
              `WHERE dataMarks.dataId = ${result.id}`
            );
            if(marks.length > 0){
                result.marks = marks;
            }
        }   

        return await results; 
    } catch (error) {
        return Promise.reject(error);
    }
};

const getImpaDataById = async (id:number): Promise<ItemWhole> => {
    try {
        const results:ItemWhole[] = await ipcRenderer.invoke(
            "query-database",
            "SELECT datas.*, type.name AS typeName FROM datas "+
            "INNER JOIN type ON datas.typeId = type.id "+
            `WHERE datas.id = ${id}`
        );
        for (const result of results) {
            const marks: Mark[] = await ipcRenderer.invoke(
              "query-database",
              `SELECT marks.* FROM marks `+
              "INNER JOIN dataMarks ON marks.Id = dataMarks.markId "+
              `WHERE dataMarks.dataId = ${result.id}`
            );
            if(marks.length > 0){
                result.marks = marks;
            }
        }   
        return await results[0]; 
    } catch (error) {
        return Promise.reject(error);
    }
};


const updateRemarkById = async(id:number, remark:string) : Promise<boolean> => {
    try{
        const results = await ipcRenderer.invoke(
            "query-database",
            `UPDATE datas SET remark = "${remark}"  WHERE id = ${id}`,
          );
        if(results){
            return true;
        }
        return false;
    }catch(error){
        return Promise.reject(error);
    }
}


const updateStoreStatus = async(id:number, status:boolean) : Promise<boolean> => {
    try{
        const results = await ipcRenderer.invoke(
            "query-database",
            `UPDATE datas SET storeStatus = ${status}  WHERE id = ${id}`,
          );
        if(results){
            return true;
        }
        return false;
    }catch(error){
        return Promise.reject(error);
    }
}

const deleteAllStoreStatus = async() : Promise<boolean> => {
    try{
        const results = await ipcRenderer.invoke(
            "query-database",
            `UPDATE datas SET storeStatus = ${false}  WHERE storeStatus = ${true}`,
          );
        if(results){
            return true;
        }
        return false;
    }catch(error){
        return Promise.reject(error);
    }
}



const startQuery = async(query:string):Promise<any[]> => {
    const results = await ipcRenderer.invoke(
        "query-database",
        query
      );

      return results;
}

export { 
    getImpaDataByTypeId, 
    getImpaDataByStore, 
    getImpaDataByCondition, 
    getImpaDataById, 
    updateRemarkById, 
    updateStoreStatus,
    deleteAllStoreStatus
};