import {Phase} from "./phase";


export interface Project {
  name: string;
  id: number;
  type: 'project';
  children: Phase[];

}
