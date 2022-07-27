import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-slider',
  templateUrl: './card-slider.component.html',
  styleUrls: ['./card-slider.component.scss']
})
export class CardSliderComponent implements OnInit {
  @Input() recommended_products: any;
  @Input() category: any;
  recommended_shimmer_load: boolean = true;
  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.recommended_products.length > 0) {
      this.recommended_shimmer_load = false;
    }
    // console.log(this.recommended_products);
  }
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  products = [
    {
      id: 1,
      name: "ECC (A) 13oz Aerosol – Case of 12 –",
      price: "$448"
    },
    {
      id: 2,
      name: "ECC (A) 13oz Aerosol – Case of 12 –",
      price: "$448"
    },
    {
      id: 3,
      name: "ECC (A) 13oz Aerosol – Case of 12 –",
      price: "$448"
    },
    {
      id: 4,
      name: "ECC (A) 13oz Aerosol – Case of 12 –",
      price: "$448"
    },
    {
      id: 5,
      name: "ECC (A) 13oz Aerosol – Case of 12 –",
      price: "$448"
    },
    {
      id: 6,
      name: "ECC (A) 13oz Aerosol – Case of 12 –",
      price: "$448"
    },
    {
      id: 7,
      name: "ECC (A) 13oz Aerosol – Case of 12 –",
      price: "$448"
    }
  ]

  routeOnSamePage(slug: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/shop/' + this.category + '/' + slug]);
  }

}
