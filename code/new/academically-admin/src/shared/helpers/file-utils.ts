import { SafeUrl } from '@angular/platform-browser';
import { AppComponentBase } from '@shared/app-component-base';
import { FileParameter } from '@shared/service-proxies/service-proxies';

export class FileUtils {
    static getFileUrl(file: File): string {
        return URL.createObjectURL(file);
    }

    static getFileName(fileName: string | null): string {
        return fileName?.toLowerCase().split('.')?.[0] ?? '-';
    }

    static getFileExtension(fileName: string | null): string {
        return fileName?.toLowerCase().split('.').pop() ?? '-';
    }

    static getSanitizedFileUrl(component: AppComponentBase, file: File): SafeUrl {
        return component.sanitizer.bypassSecurityTrustUrl(this.getFileUrl(file));
    }

    static getFileParameter(file: File): FileParameter {
        if (!file) return null;
        return { fileName: file.name, data: file } as FileParameter;
    }

    static validateFile(component: AppComponentBase, files: File[], maxSize: number, maxFiles: number, allowedExtensions: string[]): boolean {
        if (maxSize > 0) {
            if (files.some(f => f.size > maxSize)) {
                component.notify.error(component.l('InvalidFileSizeUploadError', '5MB'), component.l('InvalidFileUploadError'));
                return false;
            }
        }

        if (maxFiles && files.length > maxFiles) {
            const sFile = maxFiles > 1 ? `${maxFiles} files` : '1 file';
            component.notify.error(`You are allowed to upload only ${sFile} at a time.`);
            return false;
        }

        if (allowedExtensions.length) {
            const invalidExtension = files.map(f => this.getFileExtension(f.name)).find(n => !allowedExtensions.includes(`.${n}`));
            if (invalidExtension) {
                component.notify.error(component.l('InvalidFileExtensionUploadError', invalidExtension), component.l('InvalidFileUploadError'));
                return false;
            }
        }
        return true;
    }
}
