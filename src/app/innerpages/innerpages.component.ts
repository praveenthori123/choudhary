import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-innerpages',
  templateUrl: './innerpages.component.html',
  styleUrls: ['./innerpages.component.scss']
})
export class InnerpagesComponent implements OnInit {

  slug: any;
  data: any = []
  innershimmerLoad: boolean = true;
  constructor(private route: ActivatedRoute, public _apiService: ApiServiceService, private router: Router) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.slug = this.route.snapshot.params;
    if (this.slug.subsubsubsublink) {
      this._apiService.getPageBySlug(this.slug.subsubsubsublink).subscribe((res: any) => {
        this.data = res.data;
        this.innershimmerLoad = false;
      },
      (error: HttpErrorResponse) => {
        this.router.navigateByUrl('page-not-found');
      });
    }
    if (this.slug.subsubsublink) {
      this._apiService.getPageBySlug(this.slug.subsubsublink).subscribe((res: any) => {
        this.data = res.data;
        this.innershimmerLoad = false;
      },
      (error: HttpErrorResponse) => {
        this.router.navigateByUrl('page-not-found');
      });
    }
    else if (this.slug.subsublink) {
      this._apiService.getPageBySlug(this.slug.subsublink).subscribe((res: any) => {
        this.data = res.data;
        this.innershimmerLoad = false;
      },
      (error: HttpErrorResponse) => {
        this.router.navigateByUrl('page-not-found');
      });
    }
    else if (this.slug.sublink) {
      this._apiService.getPageBySlug(this.slug.sublink).subscribe((res: any) => {
        this.data = res.data;
        this.innershimmerLoad = false;
      },

        (error: HttpErrorResponse) => {
          this.router.navigateByUrl('page-not-found');
        });
    }
    else if (this.slug.slug) {
      console.log("Came here 5");
      this._apiService.getPageBySlug(this.slug.slug).subscribe((res: any) => {
        this.data = res.data;
        console.log("inner-page route", res);
        this.innershimmerLoad = false;
      }, (error: HttpErrorResponse) => {
        this.router.navigateByUrl('page-not-found');
      });
    }
  }
  chemist_array: any = [
    {
      imgurl: "assets/Philosophy.jpg",
      heading: "Philosophy and Methodology",
      content: "We always seek multi-use over single use chemical solutions "
    },
    {
      imgurl: "assets/test_tubes.jpg",
      heading: "Manufacturing Case Studies",
      content: "Ecolink is especially proud of our work with the global mining sector"
    }
  ]

  routeOnSamePage(slug: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/' + slug]);
  }

}
