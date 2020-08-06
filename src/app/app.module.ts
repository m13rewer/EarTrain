import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Renderer2 } from '@angular/core';

import { AppComponent } from './app.component';
import { ConfigComponent } from './config/config.component';
import { FormsModule }   from '@angular/forms';
import { ShortCutsPipe } from './short-cuts.pipe';
import { LowerCasePipe } from '@angular/common';
import { LearnerComponent } from './learner/learner.component';


@NgModule({
  declarations: [
    AppComponent,
    ConfigComponent,
    ShortCutsPipe,
    LearnerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule

  ],
  providers: [ShortCutsPipe, LowerCasePipe, ConfigComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }