import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PageService } from '../shared/services/page.service';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from '../shared/services/app.service';

@Component({
    selector: 'respond-pages',
    templateUrl: 'pages.component.html',
    providers: [PageService, AppService]
})

export class PagesComponent {

  id;
  page;
  pages;
  filteredPages: any;
  errorMessage;
  selectedPage;
  addVisible: boolean = false;
  removeVisible: boolean = false;
  drawerVisible: boolean = false;
  settingsVisible: boolean = false;
  search: string = null;

  constructor (private _pageService: PageService, private _router: Router, private _translate: TranslateService, private _appService: AppService) {}

  /**
   * Init pages
   *
   */
  ngOnInit() {

    this.id = localStorage.getItem('respond.siteId');
    this.addVisible = false;
    this.removeVisible = false;
    this.settingsVisible = false;
    this.drawerVisible = false;
    this.page = {};
    this.pages = [];
    this.filteredPages = [];
    this.search = null;

    this.list('load');

  }

  /**
   * Make a copy of the pages
   */
  copy() {
   this.filteredPages = Object.assign([], this.pages);
  }

  /**
   * Updates the list
   */
  list(source) {

    if(source != 'load') {
      this._appService.showToast('success', null);
    }

    this.reset();
    this._pageService.list()
                     .subscribe(
                       data => { this.pages = data; this.copy(); },
                       error =>  { this.failure(<any>error); }
                      );
  }

  /**
   * Searches the list
   */
  searchList() {

    var keys = 'title,url';

    // reset when nothing is typed
    if(!this.search) {
      this.copy();
    }

    // filter items
    /*
    this.filteredPages = Object.assign([], this.pages).filter(
      item => item.url.toLowerCase().indexOf(this.search.toLowerCase()) > -1
    )*/

    this.filteredPages = Object.assign([], this.pages).filter(
      item => keys.split(',').some(key => item.hasOwnProperty(key) && new RegExp(this.search, 'gi').test(item[key]))
    );


  }

  /**
   * Resets an modal booleans
   */
  reset() {
    this.removeVisible = false;
    this.addVisible = false;
    this.settingsVisible = false;
    this.drawerVisible = false;
    this.page = {};
  }

  /**
   * Sets the list item to active
   *
   * @param {Page} page
   */
  setActive(page) {
    this.selectedPage = page;
  }

  /**
   * Shows the drawer
   */
  toggleDrawer() {
    this.drawerVisible = !this.drawerVisible;
  }

  /**
   * Shows the add dialog
   */
  showAdd() {
    this.addVisible = true;
  }

  /**
   * Shows the remove dialog
   *
   * @param {Page} page
   */
  showRemove(page) {
    this.removeVisible = true;
    this.page = page;
  }

  /**
   * Shows the settings dialog
   *
   * @param {Page} page
   */
  showSettings(page) {
    this.settingsVisible = true;
    this.page = page;
  }

  /**
   * Edits a page
   *
   * @param {Page} page
   */
  edit(page) {
    localStorage.setItem('respond.pageUrl', page.url);
    localStorage.setItem('respond.editMode', 'page');

    var id = Math.random().toString(36).substr(2, 9);

    this._router.navigate( ['/edit',  id] );
  }

  /**
   * Edits code for a page
   *
   * @param {Page} page
   */
  editCode(page) {
    localStorage.setItem('respond.codeUrl', page.url);
    localStorage.setItem('respond.codeType', 'page');

    var id = Math.random().toString(36).substr(2, 9);

    this._router.navigate( ['/code',  id] );
  }

  /**
   * handles error
   */
  failure (obj) {
    
    this._appService.showToast('failure', obj._body);
    
    if(obj.status == 401) {
      this._router.navigate( ['/login'] );
    }

  }


}