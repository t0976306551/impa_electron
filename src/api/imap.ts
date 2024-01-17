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

const getImpaDataByCondition = async (): Promise<ItemWhole[]> => {
    try {
      const results:ItemWhole[] = await ipcRenderer.invoke(
        "query-database",
        "SELECT * FROM datas"
      );
        return await results; 
    } catch (error) {
        return Promise.reject(error);
    }
};


export { getImpaDataByTypeId, getImpaDataByCondition};