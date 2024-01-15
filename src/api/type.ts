import { ipcRenderer } from "electron";
import type { Type } from "@/model/type.interface";

const getTypeDatas = async (): Promise<Type[]> => {
    try {
      const results:Type[] = await ipcRenderer.invoke(
        "query-database",
        "SELECT * FROM type"
      );
        return await results; 
    } catch (error) {
        return Promise.reject(error);
    }
};
  
export { getTypeDatas };