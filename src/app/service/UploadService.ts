import {Observer} from "rxjs/Observer";
import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";

@Injectable()
export class UploadService {
    get progressObserver(): Observer<any> {
        return this._progressObserver;
    }

    get progress(): Observable<any> {
        return this._progress;
    }


    private _progress: Observable<any>;
    private _progressObserver: Observer<any>;

    constructor() {
        this._progress = Observable.create((observer: any) => {
            this._progressObserver = observer
        }).share();
    }

    public makeFileRequest(url: string, files: FileList): Observable<any> {
        return Observable.create((observer: any) => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();


            for (let i = 0; i < files.length; i++) {
                formData.append("files", files[i], files[i].name);
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.upload.onprogress = (event) => {
                const progress = Math.round(event.loaded / event.total * 100);

                this._progressObserver.next(progress);
            };
            xhr.open('POST', url, true);
            xhr.send(formData);
        });
    }
}
