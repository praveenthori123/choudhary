import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss']
})
export class ImageModalComponent implements OnInit {

  @Output() closeModal = new EventEmitter<boolean>();

  constructor(private __apiservice:ApiServiceService,private datePipe: DatePipe) { }

  dataObject:any={};
  modalcheck:boolean=false;
  ngOnInit(): void {
    this.__apiservice.getNotice()
    .then((response:any)=> {
      console.log(localStorage.getItem('dataObject'))
      console.log(JSON.stringify(response.data))
      console.log(localStorage.getItem(JSON.stringify('dataObject'))==JSON.stringify(response.data))
      if(localStorage.getItem('dataObject')==null) {
        if(!this.isInThePast(response.data.end_date.slice(0,10), response.data.start_date.slice(0,10), response.data.start_date.slice(11,19), response.data.end_date.slice(11,19))) {
          this.dataObject= response.data;
          let dataValue = {
            image:this.dataObject.image,
            message:this.dataObject.message,
            title:this.dataObject.title
          }
          let datavalues = JSON.stringify(dataValue)
          localStorage.setItem('dataObject',datavalues);
          localStorage.removeItem('modal');
          console.log("not changed",datavalues)
          this.modalcheck=true;
        }
      }
      else {
        let modalvalue = {
          image:response.data.image,
          message:response.data.message,
          title:response.data.title
        }
        if(localStorage.getItem('dataObject')==JSON.stringify(modalvalue)) {
          if(!this.isInThePast(response.data.end_date.slice(0,10),response.data.start_date.slice(0,10), response.data.start_date.slice(11,19), response.data.end_date.slice(11,19))) {
            localStorage.setItem('modal','false');
            console.log('same hai')
            this.closeModal.emit(false)
            this.modalcheck=false
          }
        }
        else {
          if(!this.isInThePast(response.data.end_date.slice(0,10),response.data.start_date.slice(0,10), response.data.start_date.slice(11,19), response.data.end_date.slice(11,19))) {
            this.modalcheck=true
            console.log('value changed')
            this.dataObject=response.data;
            let dataValue = {
              image:this.dataObject.image,
              message:this.dataObject.message,
              title:this.dataObject.title
            }
            let datavalues = JSON.stringify(dataValue)
            localStorage.setItem('dataObject',datavalues);
            localStorage.removeItem('modal');
          }
        }
      }
      let date = response.data.end_date.slice(0,10);
      console.log(response)
      console.log(date)
      // console.log(this.isInThePast("2023-02-28"))
      // console.log(this.isInThePast(date))
    })
    .catch((error:any)=> {
      console.log(error)
    })
  }

  closeModel(value:any) {
    // localStorage.setItem('modal','false');
    console.log(value);
    this.closeModal.emit(value);
  }
  isInThePast(enddate:any,startdate:any,starttime:any,endtime:any) {
    var curr_date = new Date();
    let todayDate:any;
    let todayTime:any;
    todayDate = this.datePipe.transform(curr_date, 'yyyy-MM-dd');
    todayTime = this.datePipe.transform(curr_date, 'hh:mm:ss');
    console.log(this.datePipe.transform(curr_date, 'hh:mm:ss'))
    console.log(enddate,startdate,todayDate,starttime,endtime,enddate < todayDate && startdate > todayDate ,startdate > todayDate)
    console.log("overall",(enddate < todayDate || startdate > todayDate)||(endtime < todayTime || starttime> todayTime))
    return ((enddate < todayDate || startdate > todayDate));
    // return ((enddate < todayDate || startdate > todayDate) || (endtime < todayTime || starttime> todayTime) );
  }
}
