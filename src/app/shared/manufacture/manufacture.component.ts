import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manufacture',
  templateUrl: './manufacture.component.html',
  styleUrls: ['./manufacture.component.scss']
})
export class ManufactureComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  manufacture_array:any=[
    {
      imgurl:"assets/test_tubes.jpg",
      heading:"Ecolink Manufacturing",
      content:"ECOLINK AT WORK FOR MANUFACTURING"
    },
    {
      imgurl:"assets/manufacture_factries.jpg",
      heading:"Manufacturing Case Studies",
      content:"Ecolink is especially proud of our work with the global mining sector"
    }
  ]

}
