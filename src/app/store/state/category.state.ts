import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { ApiServiceService } from "src/app/Services/api-service.service"
import { tap } from 'rxjs/operators'
import { GetcategoriesAction } from '../actions/category.action'

export class FetchCategoryStateModel {
    categories: any;
    categoriesLoaded!: boolean
}

@State<FetchCategoryStateModel>({
    name: 'fetchcategories',
    defaults: {
        categories: [],
        categoriesLoaded: false
    }
})

@Injectable()
export class FetchedCategoriesState {

    //selector has logic
    constructor(private apidata: ApiServiceService) { }

    @Selector()
    static getFetchedCategory(state: FetchCategoryStateModel) {
        return state.categories;
    }

    @Selector()
    static getFetchedCategoryLoad(state: FetchCategoryStateModel) {
        return state.categoriesLoaded;
    }

    @Action(GetcategoriesAction)
    getfetchedcategories({ getState, setState }: StateContext<FetchCategoryStateModel>) {
        return this.apidata.getAllCategories().pipe(tap(res => {
            const state = getState();
            setState({
                ...state,
                categories: res,
                categoriesLoaded: true
            });
        }))
    }
}
