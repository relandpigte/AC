import { Injectable } from '@angular/core';
import { from, of } from 'rxjs';
// import { getLinkPreview } from 'link-preview-js';

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
    constructor() { }

    getLinkPreview(requestBody: LinkPreviewRequest) {
        if (!requestBody.url) return of(null);
        try {
           // return from(getLinkPreview(requestBody.url, { followRedirects: 'follow' }));
           return of(null);
        } catch (e) {
            console.warn('Failed to get link preview.', e);
            return of(null);
        }
    }
}
