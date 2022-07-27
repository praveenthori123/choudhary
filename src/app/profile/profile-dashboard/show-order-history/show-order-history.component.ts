import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-order-history',
  templateUrl: './show-order-history.component.html',
  styleUrls: ['./show-order-history.component.scss']
})
export class ShowOrderHistoryComponent implements OnInit {

  constructor() { }
  @Input() showdesc: any;
  ngOnInit(): void {
  }

}
