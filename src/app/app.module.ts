import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {CdkDrag, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
