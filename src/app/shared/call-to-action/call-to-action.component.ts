import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-call-to-action',
  templateUrl: './call-to-action.component.html',
  styleUrls: ['./call-to-action.component.scss']
})
export class CallToActionComponent implements OnInit {
  imageurl = environment.calltoaction;
  @Input() data: any = [];
  @ViewChild('height') height: ElementRef | any;
  constructor() {
    // this.assetsUrl = environment.staticurl;
  }

  ngOnInit(): void {
  }

  getImageUrl(path: string): string {
    return `${this.imageurl + path}`;
  }
}
