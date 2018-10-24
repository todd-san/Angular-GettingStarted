import {Spec} from "./spec";

export interface Design {
  name: string;
  id: number;
  type: 'design';
  children: Spec[];
}
