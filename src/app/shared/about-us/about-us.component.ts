import { style } from '@angular/animations';
import { AfterViewInit, Component, OnInit, QueryList, ViewChild } from '@angular/core';
import { CallToActionComponent } from 'src/app/shared/call-to-action/call-to-action.component';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit,AfterViewInit {
  
  @ViewChild(CallToActionComponent) child: QueryList<CallToActionComponent>|any;
  viewheight:any=250;
  constructor() { }
  action_array=[
    {
      imgurl:"assets/ChemicalImage.jpg",
      heading:"Who is Ecolink",
      content:"Providing chemical solutions for the next generation."
    },
    {
      imgurl:"assets/Rate.jpeg",
      heading:"We work with whom",
      content:"How much we sell our impact"
    },
    {
      imgurl:"assets/DollarProduct.jpg",
      heading:"Scholarship",
      content:"Chemical Solution for next generation"
    },
    {
      imgurl:"assets/TeamWork.jpg",
      heading:"Behind the Brand",
      content:"chemicals where we start."
    },
    {
      imgurl:"assets/Circuit.jpeg",
      heading:"Charities we support",
      content:"Women in chemicals"
    }
  ]

  ngOnInit(): void {
  }
  ngAfterViewInit() {
      console.log(this.child.height.nativeElement.offsetHeight);
  }

}
