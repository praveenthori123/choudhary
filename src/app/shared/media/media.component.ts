import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { environment } from 'src/environments/environment';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import * as moment from 'moment'
interface City {
  name: string,
  code: string
}
@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  @ViewChild('selectElem') el!: ElementRef;
  @ViewChild('calendar') private calendar: any;
  getAllBlog: any = [];
  backupBlog: any = [];
  firstBlock: any = [];
  searchValue: string = '';
  showSuggestedList: boolean = false;
  innershimmerLoad: boolean = true;
  count: any = 1;
  imageurl = environment.assetsurl;
  rangeDates: Date[] | any;
  dateFrom: any;
  dateTo!: any;
  displayModal: boolean = false;
  public userQuestion: string = '';
  cities!: City[];
  selectedCity!: City;
  userQuestionUpdate = new Subject<string>();
  date: any;
  constructor(private __apiservice: ApiServiceService, private router: Router) {
    // Debounce search. 
    console.log(this.date);
    this.userQuestionUpdate.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(value => {
        console.log("value", value);
        this.getInputValue(value);
      });

    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];
  }

  maxDate = new Date();
  selected_date: any;
  async ngOnInit() {
    console.log(this.rangeDates);
    this.loadMoreApi();
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

  allCategoriesCopy: any = [];
  async loadMoreApi() {
    await this.__apiservice.getAllBlogs(this.count).then(res => {
      this.allCategories = res[0];
      this.allCategoriesCopy = Object.assign([], this.allCategories);
      res.data.data.map((blog: any) => {
        this.getAllBlog.push(blog);
        this.innershimmerLoad = false;
      })
    })
  }


  allCategories: any = [];
  async FilterApi() {
    await this.__apiservice.getAllBlogs(this.count, this.dateTo ? this.dateTo : '', this.dateFrom ? this.dateFrom : '', this.squary ? this.squary : '', this.category ? this.category : '')
      .then(res => {
        // console.log(res[0]);
        this.getAllBlog = [];
        res.data.data.map((blog: any) => {
          this.getAllBlog.push(blog);
          this.innershimmerLoad = false;
        })
        console.log(this.getAllBlog);
      })

      .catch((error: any) => {
        this.getAllBlog = [];
      })
  }


  routeOnSamePage(slug: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([slug]);
  }

  getInputValue(searchValue: any) {
    console.log("searchValue", searchValue);
    this.squary = searchValue;
    this.FilterApi();
  }


  getInputSelectedValue(value: any) {
    this.searchValue = value;
    this.showSuggestedList = false
  }



  getSearchedBlog() {
    console.log(this.searchValue);
    if (this.searchValue.length > 0) {
      this.showSuggestedList = true;
    }
    else {
      this.showSuggestedList = false;
    }
  }


  squary: any;
  category: any;
  category_dropdown_list: boolean = false;
  selectedDate() {
    console.log(this.rangeDates[0], this.rangeDates[1]);
    this.dateFrom = moment(this.rangeDates[0]).format('YYYY-MM-DD');
    this.dateTo = moment(this.rangeDates[1]).format('YYYY-MM-DD');
    console.log(this.dateTo, this.dateFrom, this.rangeDates);
    if (this.dateTo != "Invalid date") {
      this.calendar.overlayVisible = false;
    }

    this.FilterApi();
  }

  selected_category: any;
  selected_month: any = "Select Month";
  selectedValues(event: any) {
    this.category_dropdown_list = false;
    console.log(event.target.value);
    this.category = event.target.value;
    this.selected_category = this.category;
    if (this.category == '') {
      this.category = '';
    }
    this.FilterApi();
  }

  clearFilter() {
    this.rangeDates = undefined;
    this.userQuestion = '';
    this.selected_category = "";
    this.dateFrom = '';
    this.dateTo = '';
    this.category = '';
    this.squary = '';
    console.log(this.rangeDates);
    this.FilterApi();
    this.calendar.value = '';
  }

  clear(event: any) {
    this.dateFrom = '';
    this.dateTo = '';
    this.FilterApi();
  }

  showCategoryDropdown: boolean = false;
  getCategory(data: any) {
    this.selected_category = data;
    this.category = data;
    this.FilterApi();
    this.showCategoryDropdown = false;
  }

  getCategoryInputValue() {
    if (this.selected_category.length > 0) {
      this.showCategoryDropdown = true;
      const filter = this.allCategoriesCopy.filter((blog: any) => blog.blog_category.toLowerCase().indexOf(this.selected_category.toLowerCase()) > -1);
      if (filter.length > 0) {
        this.allCategories = filter;
      }
      else {
        this.allCategories = [];
        let blog = {
          blog_category: 'No Result Found'
        }
        this.allCategories.push(blog);
      }
    }
    else {
      this.allCategories = this.allCategoriesCopy;
      this.category = '';
      this.showCategoryDropdown = false;
      this.FilterApi();
    }
  }
}
