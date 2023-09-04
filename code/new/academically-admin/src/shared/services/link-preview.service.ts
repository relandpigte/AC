import { Injectable } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { PostsServiceProxy, ServicesType } from '@shared/service-proxies/service-proxies';
import * as lodash from 'lodash';
import { of } from 'rxjs';
// import { getLinkPreview } from 'link-preview-js';

export interface LinkPreviewRequest {
    url: string;
}

export interface LinkPreviewResponse {
    title: string;
    description: string;
    image: string;
    url: string;
    type: ServicesType;
}

export const httpTestExpression = /^(http|https)/;
export const urlValidation = /(?:^|[^@\.\w-])(([a-z0-9]+):\/\/)?(\w(?!ailto:)\w+:\w+@)?([\w.-]+\.(com|net|info|core|us|group|gov|ly|site|org|co|new|network|movies|space|store|work|io|me|co|uk)|localhost)(:[0-9]+)?(\/[^\s]*)?(?=$|[^@\.\w-])/gi;
export const urlRegex = new RegExp(urlValidation);
export const serviceRegex = new RegExp(`^(${AppConsts.appBaseUrl})/app/(tutorial|course|coaching|event|article|)/[^\/\s]+\/(about|discussion|review)$`, 'i');

@Injectable({
    providedIn: 'root'
})
export class LinkPreviewService {
    constructor(
        private _postsService: PostsServiceProxy
    ) { }

    getLinkPreview(requestBody: LinkPreviewRequest) {
        if (!requestBody.url) return of(null);
        try {
        //    return from(getLinkPreview(requestBody.url, { followRedirects: 'follow' }));
        } catch (e) {
            console.warn('Failed to get link preview.', e);
            return of(null);
        }
    }

    getAllQualifiedLinks(message: string) {
        const links = lodash.uniq(message?.match(urlRegex)) as string[];
        return links.map(l => {
            let link = l.replace('www.', '').trim();
            if (!(httpTestExpression.test(link.toLowerCase()))) link = `http://${link}`;
            return link;
        }).filter(l => serviceRegex.test(l));
    }

    async getAllLinkPreviews(message: string) {
        const links = this.getAllQualifiedLinks(message);
        const previews: LinkPreviewResponse[] = [];
        await Promise.all(
        links.map(
            async link => {
                const fragments = link.split('/');
                if (!fragments.length) return;
                const service = await this._postsService.getAvailableService(fragments[fragments.length - 2]).toPromise();
                if (!service) return;
                previews.push({
                    title: service.name,
                    type: service.serviceType,
                    description: service.description,
                    image: service.thumbnailImageUrl,
                    url: link
                } as LinkPreviewResponse);
            })
        );
        return previews;
    }
}
