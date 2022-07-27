import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPipePipe } from '../custom-pipe/search-pipe.pipe';
import { TitlePipe } from '../custom-pipe/title.pipe';


const exportData :any = [
    SearchPipePipe,
    TitlePipe
]

@NgModule({
  declarations: [
    ...exportData
  ],
  imports: [
    CommonModule
  ],
  exports :[
    ...exportData
  ]
})
export class PipemoduleModule { }
