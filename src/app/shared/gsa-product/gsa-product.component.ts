import { Component, Input, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { FetchedCategoriesState } from 'src/app/store/state/category.state';
import { GetcategoriesAction } from 'src/app/store/actions/category.action';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-gsa-product',
  templateUrl: './gsa-product.component.html',
  styleUrls: ['./gsa-product.component.scss']
})
export class GSAProductComponent implements OnInit {
  getCategory: any = [];
  categoriesData: any;
  @Select(FetchedCategoriesState.getFetchedCategory) categories$!: Observable<any>;
  @Select(FetchedCategoriesState.getFetchedCategoryLoad) categoriesLoaded$!: Observable<boolean>;
  // store: any;
  constructor(public __apiService: ApiServiceService , private store : Store) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.categories$.subscribe(res => {
      this.getCategory = res;
      console.log(res);
    });
  }

  getAllCategories() {
    this.categoriesData = this.categoriesLoaded$.subscribe(res => {
      if (!res) {
        this.store.dispatch(new GetcategoriesAction());
      }
    })
  }

  ngOnDestroy(){
    this.categoriesData.unsubscribe();
  }

}
