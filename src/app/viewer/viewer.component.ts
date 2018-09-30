import { Component, OnInit, ViewChild } from '@angular/core';
import { Http, ResponseContentType} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {

  pdfSrc: String = '';
  filenames: String[];
  public uploader: FileUploader = new FileUploader({
    url: 'http://localhost:3001/upload',
    allowedFileType: ['pdf']
  });
  isPdfPreview: Boolean = false;
  pageNumber = 1;
  @ViewChild('selectedFile') selectedFile: any;

  constructor(private http: Http) { }

  ngOnInit() {
    this.getFileNames().subscribe(response => {
      console.log(response);
      this.filenames = response;
    });

    this.uploader.onCompleteItem = (item, res, status, header) => {
      if (status === 200) {
        console.log('Upload successful.....');
        this.uploader.queue[0].remove();
        this.selectedFile.nativeElement.value = '';
        this.getFileNames().subscribe(response => {
          console.log(response);
          this.filenames = response;
        });
      }
    };
  }

  getFileNames(): Observable<String[]> {
    return this.http.get('http://localhost:3001/filenames/').pipe(map(res => res.json()['files']));
  }


  uploadItem(): void {
    console.log('Uploading.....');
    this.uploader.queue[0].upload();
  }

  previewItem(item): void {
    this.isPdfPreview = false;
    console.log(item);
    this.pdfSrc = 'http://localhost:3001/pdf/' + item;
    this.isPdfPreview = true;
  }

  downloadItem(item): void {
    console.log(item);
    this.http.get('http://localhost:3001/download?filename=' + item,{responseType: ResponseContentType.Blob}).subscribe(
      success => {
          let blob = new Blob([success.blob()], { type: 'application/pdf' });

          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(blob, item);
          } else {
              let a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = item;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
          }
      },
      err => {
          alert('Server error while downloading file.');
      }
  );
  }

  nextPage(): void {
    if (this.pageNumber < 3) {
      this.pageNumber++;
    }
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
    }
  }

}
