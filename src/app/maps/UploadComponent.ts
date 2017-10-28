import {Component} from '@angular/core';
import {UploadService} from '../service/UploadService';
import {MapListComponent} from './MapListComponent';

@Component({
    selector: 'file-upload',
    template: `
	  <div>
	    <input type='file'  accept='.mm' (change)='onChange($event)'/>
	  </div>
	`,
    providers: [UploadService]
})
export class UploadComponent {
    constructor(private service: UploadService, private parent: MapListComponent) {
        this.service.progress.subscribe(
            data => {
                console.log('progress = ' + data);
            });
    }

    onChange(event: Event) {
        console.log('onChange');
        const files: FileList = (event.srcElement as HTMLInputElement).files;
        console.log(files);
        this.service.makeFileRequest('/map/upload', files).subscribe(() => {
            console.log('sent');
            this.parent.refreshFiles();
        });
    }
}