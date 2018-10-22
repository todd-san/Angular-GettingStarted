import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'convertToSlashes'
})

export class ConvertToSlashesPipe implements PipeTransform {

  transform(value: string, character: string): string {
    if (value){
      return value.replace( new RegExp('_', 'g'), "/");
    }

    return value
  }

}
