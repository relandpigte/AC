import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  private _geocoder: google.maps.Geocoder;

  constructor(injector: Injector) {
    const httpClient = injector.get(HttpClient);
    httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=${environment.googleApiKey}`, 'callback').subscribe(() => {
      this._geocoder = new google.maps.Geocoder();
    });
  }

  public get geocoder(): google.maps.Geocoder {
    return this._geocoder;
  }
}
