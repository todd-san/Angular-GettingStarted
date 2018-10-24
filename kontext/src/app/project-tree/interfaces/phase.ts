import {Design} from "./design";


export interface Phase {
  name: string;
  id: number;
  type: 'phase';
  children: Design[];

}
