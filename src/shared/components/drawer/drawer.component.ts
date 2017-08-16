import { Component, Renderer, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SiteService } from '../../../shared/services/site.service';
import { AppService } from '../../../shared/services/app.service';

declare var toast: any;

@Component({
    selector: 'respond-drawer',
    templateUrl: 'drawer.component.html',
    providers: [SiteService, AppService]
})

export class DrawerComponent {

  globalListener: any;

  status: string;
  hasAccount: boolean;
  daysRemaining: any;

  activationMethod: string;
  activationUrl: string;
  stripeAmount: any;
  stripeName: string;
  stripeDescription: string;
  stripePublishableKey: string;
  stripeCurrency: string;

  id;
  dev;
  siteUrl;
  _visible: boolean = false;
  _active: string;

  @Input()
  set visible(visible: boolean){
    this._visible = visible;
  }

  get visible() { return this._visible; }

  @Input()
  set active(active: string){
    this._active = active;
  }

  get active() { return this._active; }

  @Output() onHide = new EventEmitter<any>();

  constructor (private _siteService: SiteService, private _appService: AppService, private _router: Router, private renderer: Renderer) {}

  /**
   * Init pages
   */
  ngOnInit() {
    this.id = localStorage.getItem('respond.siteId');
    this.dev = false;
    this.siteUrl = '';
    this.status = 'Active';
    this.hasAccount = false;
    this.daysRemaining = 0;
    this.activationUrl = '';

    var url = window.location.href;

    if(url.indexOf('?dev') !== -1) {
      this.dev = true;
    }

    // get app settings
    this.settings();
  }

  /**
   * Get settings
   */
  settings() {

    // set trial information
    this.status = localStorage.getItem('site_status');
    this.hasAccount = (localStorage.getItem('site_has_account') == 'true'); // convert to boolean
    this.daysRemaining = parseInt(localStorage.getItem('site_trial_days_remaining'));

    // activation
    this.activationMethod = localStorage.getItem('activation_method');
    this.activationUrl = localStorage.getItem('activation_url');
    this.stripeAmount = parseInt(localStorage.getItem('stripe_amount'));
    this.stripeName = localStorage.getItem('stripe_name');
    this.stripeDescription = localStorage.getItem('stripe_description');
    this.stripePublishableKey = localStorage.getItem('stripe_publishable_key');
    this.stripeCurrency = localStorage.getItem('stripe_currency');

    // list themes in the app
    this._appService.retrieveSettings()
                     .subscribe(
                       data => {
                         this.siteUrl = data.siteUrl;
                         this.siteUrl = this.siteUrl.replace('{{siteId}}', this.id);
                       },
                       error =>  { }
                      );
  }

  /**
   * View the code editor
   */
  viewCode() {

    localStorage.setItem('respond.codeUrl', 'templates/default.html');
    localStorage.setItem('respond.codeType', 'template');

    var id = Math.random().toString(36).substr(2, 9);

    this._router.navigate( ['/code',  id] );

  }

  /**
   * Hides the add page modal
   */
  hide() {
    this._visible = false;
    this.onHide.emit(null);
  }

  /**
   * Reload system files
   */
  reload() {

    this._siteService.reload()
                     .subscribe(
                       data => { toast.show('success'); },
                       error => { toast.show('failure');  }
                      );

  }

  /**
   * Republish sitemap
   */
  sitemap() {
    this._siteService.sitemap()
                     .subscribe(
                       data => { toast.show('success'); },
                       error => { toast.show('failure');  }
                      );
  }

  /**
   * Stripe checkout
   */
  checkout() {

    var context = this;

    // handle stripe activation
    if(this.activationMethod == 'Stripe') {

      var handler = (<any>window).StripeCheckout.configure({
        key: this.stripePublishableKey,
        locale: 'auto',
        token: function (token: any) {

          // subscribe
          context._siteService.subscribe(token.id, token.email)
                       .subscribe(
                         data => { context.subscribed(); toast.show('success'); },
                         error => { toast.show('failure');  }
                        );

        }
      });

      handler.open({
        name: this.stripeName,
        description: this.stripeDescription,
        amount: this.stripeAmount,
        currency: this.stripeCurrency
      });

      this.globalListener = this.renderer.listenGlobal('window', 'popstate', () => {
        handler.close();
      });

    }
    else {
      window.location.href = this.activationUrl;
    }


  }

  /**
   * Successfully subscribed
   */
  subscribed() {
    localStorage.setItem('site_status', 'Active');
    this.status = 'Active';

    localStorage.setItem('site_has_account', 'true');
    this.hasAccount = true;
  }

  /**
   * Signs out of the system
   */
  signOut() {

    // remove token
    localStorage.removeItem('respond.siteId');

    // redirect
    this._router.navigate( ['/login'] );

  }

}