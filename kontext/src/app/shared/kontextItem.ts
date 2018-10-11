export class KontextItem {
  name: string;
  id: number;
  type: string;
  children: KontextItem[];

  constructor(item: object){
    this.name = item['name'] ? item['name'] : null;
    this.id = item['id'] ? item['id'] : null;
    this.type = item['type'] ? item['type'] : null;
    this.children = item['children'] ? item['children'] : null;
  }

}
