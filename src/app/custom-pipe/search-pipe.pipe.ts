import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipe'
})
export class SearchPipePipe implements PipeTransform {

  transform(value:any, searchTerm: any): any {
    return value.filter(function(search:any){
       if(search.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1){
         return search.name
       } 
       else{
         return "no data found"
       }
    })
  }

}
