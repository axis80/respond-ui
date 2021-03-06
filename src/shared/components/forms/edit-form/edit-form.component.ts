import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormService } from '../../../../shared/services/form.service';
import { AppService } from '../../../../shared/services/app.service';

@Component({
    selector: 'respond-edit-form',
    templateUrl: 'edit-form.component.html',
    providers: [FormService, AppService]
})

export class EditFormComponent {

  routes;
  errorMessage;

  // model to store
  model;

  _visible: boolean = false;

  @Input()
  set visible(visible: boolean){

    // set visible
    this._visible = visible;

  }

  get visible() { return this._visible; }

  @Input()
  set form(form){

    // set visible
    this.model = form;

  }

  @Output() onCancel = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();

  constructor (private _formService: FormService, private _appService: AppService) {}

  /**
   * Init
   */
  ngOnInit() {
    this.model = {
      id: '',
      name: '',
      cssClass: '',
      validate: false,
      success: '',
      error: '',
      recaptchaError: '',
      notify: ''
    };
  }

  /**
   * Hides the modal
   */
  hide() {
    this._visible = false;
    this.onCancel.emit(null);
  }

  /**
   * Submits the form
   */
  submit() {

    this._formService.edit(this.model.id, this.model.name, this.model.cssClass, this.model.validate, this.model.success, this.model.error, this.model.recaptchaError, this.model.notify)
                     .subscribe(
                       data => { this.success(); },
                       error =>  { this.onError.emit(<any>error); }
                      );

  }

  /**
   * Handles a successful edit
   */
  success() {

    this._visible = false;
    this.onUpdate.emit(null);

  }

  /**
   * Handles an error
   */
  error() {

    console.log('[respond.error] ' + this.errorMessage);
    this._appService.showToast('failure', '');

  }


}