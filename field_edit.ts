import { Directive, ElementRef, Component, View, Input, Output, Inject, Pipe, PipeTransform, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {Http, Headers, HTTP_PROVIDERS} from 'angular2/http';
import {RouteParams, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import { BrowserDomAdapter } from 'angular2/platform/browser'
import 'rxjs/add/operator/map';

declare var micromarkdown: any;

  //Auto focus when ifNg becomes true
@Directive({
  selector: '[focusMe]'
})
export class FocusMe {
    constructor(private elementRef: ElementRef) {}
    ngAfterViewInit() {
      // set focus when element first appears
      this.setFocus();
    }
    setFocus() {
      this.elementRef.nativeElement.focus();
    }
}

// We use the @Pipe decorator to register the name of the pipe
@Pipe({
  name: 'headerValue'
})
// The work of the pipe is handled in the tranform method with our pipe's class
class HeaderValuePipe implements PipeTransform
{
  transform(value: string, args: any[])
  {
      //Wrap info
    if ( args.length == 0 || args[0] == null || args[0] == '' )
      return value;
    else
      return args[0].replace( /%%%/g, value );
  }
}


// We use the @Pipe decorator to register the name of the pipe
@Pipe({
  name: 'markDown'
})
// The work of the pipe is handled in the tranform method with our pipe's class
class MarkDownPipe implements PipeTransform
{
  transform(value: string, args: any[])
  {
    return micromarkdown.parse( value );
  }
}


@Component({
  selector: 'field-edit'
})
@View({
  templateUrl: './app/field_edit/field_edit.html',
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES, FocusMe],
  pipes: [HeaderValuePipe, MarkDownPipe],
})
export class FieldEditComponent
{
  _http: Http;
  value_check: string;
  md_desc: string;
  editing: boolean = false;
  show_desc: boolean = true;

  @Input() value: string;
  @Input() url: string;
  @Input() post_data: string;

  @Input() label_type: string = 'h1';
  @Input() input_type: string = 'input';
  @Input() custom_header: string = '';
  @Input() hide_header: boolean = true;

  @Output() value_updated = new EventEmitter();

  constructor( http: Http )
  {
    this._http = http;
  }

  ngOnInit()
  {
      //Setup the value variable
    if ( this.value === undefined || this.value == null )
      this.value = '';

    //Bait and switch for the custom header logic
    if ( this.input_type == 'textarea' && (this.custom_header == '' || this.custom_header == null))
      this.custom_header = 'Description';

      //Setup the description logic
    this.show_desc = (this.hide_header && (this.value.search(/^#.*[a-zA-Z]/) < 0));
  }

    //Toggle to edit mode
  toggleEdit()
  {
    if ( !this.editing )
      this.editing = true;
    else
      this.updatedEdit();
  }
  updatedEdit( event=null )
  {
      //If enter is pressed, we save, unless shift enter is pressed
    if ( event != null )
    {
      if ( this.input_type == 'input' && event.keyCode != 13 )
        return;
      if ( this.input_type == 'textarea' && (event.keyCode != 13 || !event.shiftKey) )
        return;
    }

      //Toggle that we aren't editing now
    this.editing = false;

      //Simple callback?
    if ( this.url === undefined || this.url == null ||
         this.post_data === undefined || this.post_data == null )
    {
      this.show_desc = (this.hide_header && (this.value.search(/^#.*[a-zA-Z]/) < 0));
      this.value_updated.emit(this.value);
    }

      //HTTP post
    else
    {
        //Setup my data
      let data = this.post_data.replace(/%%%/g, this.value);

      //Store my info
      this._http.post(this.url, data)
        .map(res => res.json())
        .subscribe(
          data => {
          },
          err => this.logError(err),
          () => {
            this.show_desc = (this.hide_header && (this.value.search(/^#.*[a-zA-Z]/) < 0));
            this.value_updated.emit(this.value);
          }
        );
    }
  }

  logError(err) {
    console.error('There was an error: ' + err);
  }
}


