import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, NavigationStart, Router, RouterOutlet} from '@angular/router';
import {Title} from '@angular/platform-browser';
// rxjs
import {Subscription} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';


import {CustomPreloadingStrategyService, MessagesService} from './core';
import {SpinnerService} from './widgets';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {

  private sub: { [key: string]: Subscription } = {};

  constructor(
    public messagesService: MessagesService,
    private router: Router,
    public spinnerService: SpinnerService,
    private preloadingStrategy: CustomPreloadingStrategyService,
    private titleService: Title
  ) {
  }

  ngOnInit(): void {
    console.log(
      `Preloading Modules: `,
      this.preloadingStrategy.preloadedModules
    );
    //this.setPageTitles();
    this.setMessageServiceOnRefresh();
  }

  ngOnDestroy(): void {
    //this.sub.navigationEnd.unsubscribe();
    this.sub.navigationStart.unsubscribe();
  }

  onActivate($event: any, routerOutlet: RouterOutlet): void {
    console.log('Activated Component', $event, routerOutlet);
    // another way to set titles
    this.titleService.setTitle(routerOutlet.activatedRouteData.title);
  }

  onDeactivate($event: any, routerOutlet: RouterOutlet): void {
    console.log('Deactivated Component', $event, routerOutlet);
  }

  onDisplayMessages(): void {
    this.router.navigate([{outlets: {messages: ['messages']}}]);
    this.messagesService.isDisplayed = true;
  }

  private setPageTitles(): void {
    this.sub.navigationEnd = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.router.routerState.root),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        switchMap(route => route.data)
      )
      .subscribe(
        data => this.titleService.setTitle(data.title)
      );
  }

  private setMessageServiceOnRefresh(): void {
    this.sub.navigationStart = this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(event => {
        this.messagesService.isDisplayed = (event as NavigationStart).url.includes('messages:');
      });
  }

}
