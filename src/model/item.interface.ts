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
}

// export interface CreateItem {
//   name: string;
// }

// export interface UpdateItem {
//   name: string;
// }
