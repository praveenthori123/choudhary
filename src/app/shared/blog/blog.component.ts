import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { environment } from 'src/environments/environment';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  slug: any;
  imageurl = environment.assetsurl;
  getBlog: any = [];
  navigation: any;
  userQuestion: any;
  userQuestionUpdate = new Subject<string>();
  constructor(private route: ActivatedRoute, public __apiService: ApiServiceService, private router: Router) {
    this.userQuestionUpdate.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(value => {
        console.log("value", value);
        // this.consoleMessages.push(value);
        this.getInputValue(value);
      });
  }

  ngOnInit(): void {
    this.slug = this.route.snapshot.params;
    setTimeout(() => {
      console.log(this.slug);
    }, 500);

    this.__apiService.getBlog(this.slug).subscribe(res => {
      this.getBlog.push(res);
      setTimeout(() => {
        console.log(this.getBlog);
        this.navigation = this.getBlog[0].data.title
      }, 500);
    })
  }
  routeOnSamePage(slug: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/' + slug]);
  }

  squary: any;
  getInputValue(searchValue: any) {
    console.log("searchValue", searchValue);
    this.squary = searchValue;
    if (this.squary.length > 0) {
      this.FilterApi();
    }
    else {
      this.getAllBlog = [];
    }
  }

  getAllBlog: any = [];
  getCategoryBlog: any = [];
  count: any = 1;
  category: any;
  month: any;
  year: any;
  async FilterApi(category?: any) {
    this.getAllBlog = [];
    if (category) {
      this.category = category;
    }
    await this.__apiService.getAllBlogs(this.count, this.month ? this.month : '', this.year ? this.year : '', this.squary ? this.squary : '', this.category ? this.category : '')
      .then(res => {
        this.getAllBlog = res.data.data;
      })

      .catch((error: any) => {
        let object = {title : "No Result Found"}
        this.getAllBlog.push(object);
      })
      console.log("this.getAllBlog" , this.getAllBlog);      
  }

  async getCategory(category: any) {
    console.log(category);
    await this.FilterByCategory(category);
    console.log(this.getCategoryBlog);
  }

  async FilterByCategory(category?: any) {
    this.getAllBlog = [];
    if (category) {
      this.category = category;
    }
    await this.__apiService.getAllBlogs(this.count, this.month ? this.month : '', this.year ? this.year : '', this.squary ? this.squary : '', this.category ? this.category : '')
      .then(res => {
        console.log(res);
        this.getCategoryBlog = res.data.data;
      })

      .catch((error: any) => {
        this.getCategoryBlog = [];
      })
  }

}
