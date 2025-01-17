import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';

import {Router} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import {AppComponent} from './app.component';
import {LayoutModule} from './layout/layout.module';
import { TasksModule } from './tasks/tasks.module';
// import { UsersModule } from './users/users.module';
// import { AdminModule } from './admin/admin.module';
import { SpinnerModule } from './widgets/spinner/spinner.module';
import {httpInterceptorProviders} from "./core/interceptors";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    TasksModule,
    // UsersModule,
    // AdminModule,
    SpinnerModule.forRoot(),
    // MUST BE LAST
    AppRoutingModule
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(router: Router) {
    const replacer = (key: string, value: any): string =>
      typeof value === 'function' ? value.name : value;
    console.log('Routes: ', JSON.stringify(router.config, replacer, 2));
  }

}
