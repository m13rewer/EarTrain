import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Renderer2 } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ConfigComponent } from './config/config.component';
import { ShortCutsPipe } from './short-cuts.pipe';
import { LowerCasePipe } from '@angular/common';
import { LearnerComponent } from './learner/learner.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { LearnerService } from './shared/learner.service';

const appRoutes: Routes = [
  { path: 'config', component: ConfigComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ConfigComponent,
    ShortCutsPipe,
    LearnerComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
    ),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule

  ],
  providers: [ShortCutsPipe, LowerCasePipe, LearnerService],
  bootstrap: [AppComponent]
})
export class AppModule { }