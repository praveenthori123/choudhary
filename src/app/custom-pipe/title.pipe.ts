import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'title'
})
export class TitlePipe implements PipeTransform {

  transform(value:any, searchTerm: any): any {
    return value?.filter((search:any)=>{
       return search.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
    })
  }

}
