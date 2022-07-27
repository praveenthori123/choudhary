import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { ApiServiceService } from "src/app/Services/api-service.service"
import { tap } from 'rxjs/operators'
import { HeaderMenuAction } from '../actions/header.action'

export class FetchHeaderStateModel {
    headerMenu: any;
    headerMenuLoaded!: boolean
}

@State<FetchHeaderStateModel>({
    name: 'fetchheader',
    defaults: {
        headerMenu: [],
        headerMenuLoaded: false
    }
})

@Injectable()
export class FetchedHeaderState {

    //selector has logic
    constructor(private apidata: ApiServiceService) { }

    @Selector()
    static getFetchedHeader(state: FetchHeaderStateModel) {
        return state.headerMenu;
    }

    @Selector()
    static getFetchedHeaderLoad(state: FetchHeaderStateModel) {
        return state.headerMenuLoaded;
    }

    @Action(HeaderMenuAction)
    getfetchedmenues({ getState, setState }: StateContext<FetchHeaderStateModel>) {
        return this.apidata.home().pipe(tap(res => {
            const state = getState();
            setState({
                ...state,
                headerMenu: res,
                headerMenuLoaded: true
            });
        }))
    }
}
