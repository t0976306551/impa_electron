import {Mark} from "@/model/mark.interface";

export interface Item {
  id: number;
  code:string;
  chineseName: string;
  englishName : string;
  uom : string | null;
  mtmlUom : string | null;
  content: string | null;
  image : string | null;
  typeId : number;
  storeStatus : boolean;
  remark:string|null;
}


export interface ItemWhole {
  id: number;
  code:string;
  chineseName: string;
  englishName : string;
  uom : string | null;
  mtmlUom : string | null;
  content: string | null;
  image : string | null;
  typeId : number;
  typeName: string;
  storeStatus : boolean;
  marks?: Mark[] | null;
  remark:string|null;
}

// export interface CreateItem {
//   name: string;
// }

// export interface UpdateItem {
//   name: string;
// }
