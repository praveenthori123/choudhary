import { Component, HostListener } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { Loader, LoaderOptions } from 'google-maps';
import { ApiServiceService } from './Services/api-service.service';
import { ConnectionService } from 'ng-connection-service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  template: `<h1>{{title}}</h1>
    <h3>v{{currentApplicationVersion}}</h3>`
})
export class AppComponent {
  title = 'Ecolink';
  appVersion:any;
  deferredPrompt: any;
  showButton = false;
  addHomeScreenbtn: boolean = true
  isShow: boolean = true;
  topPosToStartShowing = 100;
  GoogleMapAPIKey: string = 'AIzaSyDG8Z4FQOFQ9ddX0INeSaY11MLRTyr-0Xw'
  constructor(private geolocation: GeolocationService, private _apiService: ApiServiceService, private connectionService: ConnectionService) {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = "ONLINE";
      }
      else {
        this.status = "OFFLINE";
      }
    })
  }
  ngOnInit() {
    // this.getCurrentLocation();
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        let customerLatitude = position.coords.latitude;
        let customerLongitude = position.coords.longitude;
        this.getGeoLocation(customerLatitude, customerLongitude);
      });
    }
    else {
      alert("Geolocation is not supported by this browser.");

    }
  }

  async getGeoLocation(lat: number, lng: number) {

    const options: LoaderOptions = {/* todo */ };
    const loader = new Loader(this.GoogleMapAPIKey, options);

    const google = await loader.load();

    if (navigator.geolocation) {
      let geocoder = new google.maps.Geocoder();
      let latlng = new google.maps.LatLng(lat, lng);
      let request: any = { latLng: latlng };
      geocoder.geocode(request, (results: any, status: any) => {
        if (status == google.maps.GeocoderStatus.OK) {
          let result = results[0];
          if (result != null) {
            console.log("Adddres:", result);
            console.log("Adddres:", result.formatted_address);
            this._apiService.UserLocation.next(result.address_components)
            localStorage.setItem("Address", JSON.stringify(result.address_components));
          } else {
            alert("No address available!");
          }
        }

        else {
          if (localStorage.getItem("Address")) {
            localStorage.removeItem("Address");
          }
        }
      });
    }
  }

  // public addToHomeScreen(): void {
  //   // hide our user interface that shows our A2HS button
  //   this.showButton = false;
  //   // Show the prompt
  //   this.deferredPrompt.prompt();
  //   // Wait for the user to respond to the prompt
  //   this.deferredPrompt.userChoice
  //     .then((choiceResult: any) => {
  //       if (choiceResult.outcome === 'accepted') {
  //         console.log('User accepted the A2HS prompt');
  //         this.addHomeScreenbtn = false;
  //       } else {
  //         console.log('User dismissed the A2HS prompt');
  //       }
  //       this.deferredPrompt = null;
  //     });
  // }
  status = 'ONLINE';
  isConnected = true;
  // title = 'Demo application for version numbering';
    // currentApplicationVersion = environment.appVersion;
}
