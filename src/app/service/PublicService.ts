import {Http, Headers} from "@angular/http";
import {MapService} from "./MapService";
import {Injectable} from "@angular/core";
/**
 * Created by gpapp on 2015.05.15..
 */
@Injectable()
export class PublicService {

    constructor(private http: Http, fileService:MapService) {

    }

    queryPublicTags(query: string): Promise< string[]> {
        return new Promise((resolve, reject) => {
            this.http.get("/public/fileTags/" + query).subscribe(
                data => resolve(data.json()),
                err => {
                    console.error(err);
                    reject();
                }
            )
        });
    }

    listPublicFilesForTags(query: string, tags: string[]): Promise< string[]> {
        return new Promise((resolve, reject) => {
            const headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            const body = JSON.stringify({query: query, tags: tags});
            this.http.post("/public/fileTags/", body, headers).subscribe(
                data => resolve(data.json()),
                err => {
                    console.error(err);
                    reject();
                }
            )
        });
    }

    load(fileId: string): Promise< File> {
        return new Promise((resolve, reject) => {

            this.http.get("/public/file/" + fileId).subscribe(
                data => {
                    resolve(data.json())
                },
                err => {
                    console.error(err);
                    reject();
                });
        });
    }
}