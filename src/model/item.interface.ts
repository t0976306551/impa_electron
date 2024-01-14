export interface Item {
  id: number;
  code:string;
  image : string;
  chineseName: string;
  englishName : string;
  type : string;
  uom : string;
  content: string;
}

export interface CreateItem {
  name: string;
}

export interface UpdateItem {
  name: string;
}
