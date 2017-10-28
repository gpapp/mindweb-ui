import {MapService} from './MapService';
import {Http} from '@angular/http';
import {Injectable} from '@angular/core';

/**
 * Created by gpapp on 2015.05.15..
 */
@Injectable()
export class TaskService {

    constructor(private http: Http, private fileService: MapService) {

    }

    parseTasks(id: string): Promise < File > {
        return new Promise((resolve, reject) => {
            this.http.get('/task/parse/' + id).subscribe(
                data => resolve(data.json()),
                err => {
                    console.error(err);
                    reject();
                }
            )
        });
    }
}
