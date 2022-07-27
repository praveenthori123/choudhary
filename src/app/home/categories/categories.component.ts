
import { Component, Input, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { FetchedCategoriesState } from 'src/app/store/state/category.state';
import { GetcategoriesAction } from 'src/app/store/actions/category.action';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  getCategory: any = [];
  CategoryContent:any=[];
  categoriesData: any;
  @Select(FetchedCategoriesState.getFetchedCategory) categories$!: Observable<any>;
  @Select(FetchedCategoriesState.getFetchedCategoryLoad) categoriesLoaded$!: Observable<boolean>;
  constructor(public __apiService: ApiServiceService, private store: Store) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.categories$.subscribe(res => {
      console.log(res.data);
      this.getCategory = res.data;
      this.CategoryContent=res.content;
      console.log(this.getCategory);
    });
  }
  //Get all product category
  getAllCategories() {
    this.categoriesData = this.categoriesLoaded$.subscribe(res => {
      if (!res) {
        this.store.dispatch(new GetcategoriesAction());
      }
    })
    // this.__apiService.getAllCategoriesonshop().then((res:any)=> {
    //   console.log(res);
    //   res.data.map((response:any)=> {
    //     this.getCategory.push(response);
    //   })
    // })
  }

  ngOnDestroy() {
    this.categoriesData.unsubscribe();
  }
}