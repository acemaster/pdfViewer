import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ViewerComponent } from './viewer/viewer.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { HttpModule } from '@angular/http';
import { FileSelectDirective } from 'ng2-file-upload';


@NgModule({
  declarations: [
    AppComponent,
    ViewerComponent,
    FileSelectDirective
  ],
  imports: [
    BrowserModule, PdfViewerModule, HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
