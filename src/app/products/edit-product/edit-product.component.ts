import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';
import { AppService } from '../../shared/services/app.service';
import { SortablejsOptions } from 'angular-sortablejs';

@Component({
    selector: 'respond-edit-product',
    templateUrl: 'edit-product.component.html',
    providers: [ProductService, AppService]
})

export class EditProductComponent {

  tab: string = 'details';
  id;
  product: any = {};
  options: any = [];
  images: any = [];
  errorMessage;
  selectedImage;
  selectedIndex;
  editImageVisible;
  addVisible: boolean = false;;
  editVisible: boolean = false;
  removeVisible: boolean = false;
  selectVisible: boolean = false;
  removeImageVisible: boolean = false;
  drawerVisible: boolean;

  sortableOptions: SortablejsOptions = {
    handle: '.sortable-handle',
    onUpdate: () => this.updateOrder()
  };

  constructor (private _productService: ProductService, private _route: ActivatedRoute, private _router: Router, private _appService: AppService) {}

  /**
   * Init
   *
   */
  ngOnInit() {

    this.id = localStorage.getItem('respond.siteId');

    // reset model
    this.product = {
      id: '',
      name: '',
      shipped: false,
      price: 25.00,
      file: '', 
      subscription: false,
      plan: '',
      planPrice: ''
    };

    // get ID from route
    this._route.params.subscribe(params => {
      this.product.id = params['id'];
    });

    // retrieve product
    this.retrieve();

  }

  /**
   * Retrieve the product
   */
  retrieve() {

    let context = this;

    this._productService.retrieve(this.product.id)
                     .subscribe(
                       data => { 
                          context.product.name = data.name;
                          context.product.shipped = data.shipped;
                          context.product.price = data.price;
                          context.product.file = data.file;
                          context.product.subscription = data.subscription;
                          context.product.plan = data.plan;
                          context.product.planPrice = data.planPrice;
                          context.product.images = data.images;
                          context.product.options = data.options;
                        },
                       error =>  { this.failure(<any>error); }
                      );

  }

  /**
   * Updates the list
   */
  list() {

    this.reset();

    /*
    this._productService.list()
                     .subscribe(
                       data => { this.galleries = data; this.success(); },
                       error =>  { this.failure(<any>error); }
                      );*/

  }

  /**
   * list images for the product
   */
  listImages() {

    /*
    this._productService.list(this.selectedGallery.id)
                     .subscribe(
                       data => { this.images = data; },
                       error => { this.failure(<any>error); }
                      ); */

  }

  /**
   * go back
   */
  back() {
    this._router.navigate( ['/products'] );
  }

  /**
   * Resets screen
   */
  reset() {
    this.addVisible = false;
    this.editVisible = false;
    this.removeVisible = false;
    this.selectVisible = false;
    this.removeImageVisible = false;
    this.editImageVisible = false;
    this.drawerVisible = false;
  }

  /**
   * Sets the tab to active
   *
   * @param {String} tab
   */
  setActive(tab) {
    this.tab = tab;
  }

  /**
   * Sets the image to active
   *
   * @param {Image} image
   */
  setImageActive(image) {
    this.selectedImage = image;
    this.selectedIndex = this.images.indexOf(image);
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
   * Shows the edit dialog
   */
  showEdit() {
    this.editVisible = true;
  }

  /**
   * Shows the remove dialog
   *
   */
  showRemove() {
    this.removeVisible = true;
  }

  /**
   * Shows the select dialog
   */
  showSelect() {
    this.selectVisible = true;
  }

  /**
   * Handles the selection of an image
   */
  select(event) {

   var caption = '';

   /*
   this._galleryImageService.add(event.name, event.url, event.thumb, caption, this.selectedGallery.id)
                   .subscribe(
                     data => { this.listImages(); this._appService.showToast('success', null); },
                     error => { this.failure(<any>error); }
                    ); */

    this.selectVisible = false;
  }

  /**
   * Shows the remove dialog
   *
   * @param {Image} image
   */
  showRemoveImage(image) {
    this.selectedImage = image;
    this.removeImageVisible = true;
  }

  /**
   * Shows the remove dialog
   *
   * @param {Image} image
   */
  showEditImage(image) {
    this.selectedImage = image;
    this.editImageVisible = true;
  }


  /**
   * Updates the order of the field fields
   *
   */
  updateOrder() {

    /*
    this._galleryImageService.updateOrder(this.images, this.selectedGallery.id)
                     .subscribe(
                       data => { this._appService.showToast('success', 'Order updated successfully'); },
                       error =>  { this.failure(<any>error); }
                      ); */
  }

  /**
   * submits the form
   */
  submit() {
    this._productService.edit(this.product.id, this.product.name, this.product.shipped, this.product.price, this.product.file, this.product.subscription, this.product.plan, this.product.planPrice)
                     .subscribe(
                       data => { this.success(); },
                       error =>  { this.failure(<any>error); }
                      );
  }

  /**
   * handles the list successfully updated
   */
  success() {
    this._appService.showToast('success', null);
  }

  /**
   * handles error
   */
  failure(obj) {

    this._appService.showToast('failure', obj._body);

    if(obj.status == 401) {
      this._router.navigate( ['/login'] );
    }

  }


}