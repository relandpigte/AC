import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export interface LinkPreviewRequest {
    url: string;
}

export interface LinkPreviewResponse {
    title: string;
    description: string;
    image: string;
    url: string;
}

export const urlValidation = /(?:^|[^@\.\w-])([a-z0-9]+:\/\/)?(\w(?!ailto:)\w+:\w+@)?([\w.-]+\.(com|net|info|core|us|group|gov|ly|site|org|co|new|network|movies|space|store|work|io|me))(:[0-9]+)?(\/.*)?(?=$|[^@\.\w-])/gi;
export const urlRegex = new RegExp(urlValidation);

@Injectable({
    providedIn: 'root'
})
export class LinkPreviewService {
    private _accessKey = '5b54e80a65c77848ceaa4630331e8384950e09d392365';
    private _apiURL = 'https://api.linkpreview.net/';

    constructor(
        private http: HttpClient
    ) { }

    getLinkPreview(requestBody: LinkPreviewRequest): Observable<LinkPreviewResponse> {
        if (!requestBody.url) return of(null);
        try {
            const params = new HttpParams().append('key', this._accessKey).append('q', requestBody.url);
            return this.http.get(this._apiURL, {params: params}).pipe(map(value => value as LinkPreviewResponse));
        } catch (e) {
            console.warn('Failed to get link preview.', e);
            return of(null);
        }
    }
}
