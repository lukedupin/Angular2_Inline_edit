# Angular2 Inline edit
This module is written for Angular2 to smoothly edit div's, and then post those results back to an API.  The goal is to modularize common field editing to avoid cluttering the rest of your code.


## Installation
* Copy field_edit.html and field_edit.ts into your Angular2 project.
* Copy micromarkdown.js into your static javascript files

## Setup markdown

Inside your main HTML, add micromarkdown.js.  Example:

    <script src="/app/node_modules/angular2/bundles/angular2-polyfills.js"></script>
    <script src="/app/node_modules/systemjs/dist/system.src.js"></script>
    <script src="/app/node_modules/rxjs/bundles/Rx.js"></script>
    <script src="/app/node_modules/angular2/bundles/angular2.dev.js"></script>
    <script src="/app/node_modules/angular2/bundles/router.dev.js"></script>
    <script src="/app/node_modules/angular2/bundles/http.dev.js"></script>

    <script src="/app/js/micromarkdown.js"></script>

## Input and output description
**[value]** **(Required)** Defines the user's content that will be edited/displayed.

**[url]** *(optional)* Defines the URL a HTTP POST will happen when editing finishes.

**[post_data]** *(optional)* HTTP POST data that will be sent.  %%% is replaced with the content inside **[value]**

**[label_type]** *(**h1**, h2, div)* Defines the HTML tag used to display data while in viewing mode.  For a textarea, this only affects the header.

**[input_type]** of *(**input**, textarea)* are converted into HTML text inputs.  **textarea** is converted into a textarea, when not in edit mode, the content is displayed using markdown.

**[custom_header]** Defines a custom static header for the content.  %%% will be replaced with the content inside **[value]**

**[hide_header]** *(**true**, false)* Only used for **[input_type]="textarea"**, if **true** and the user's content begins with a '*#*', the default header will be hidden.  If **false** the header will never hide.

**[value_updated]** Output called when editing is completed.


## Usage

A **h1** tag that converts into text area.  This example posts data to a URL, and then writes the updated value back to the name variable:

`<field-edit [value]="name" [url]="'/url?url_variable_id='+ url_var.id" [post_data]="'action=update&name=%%%'" [custom_header]="'User name -- %%%'" (value_updated)="name = $event;"></field-edit>`

Display content in Markdown, when editing show a textarea.  This version also posts data to a remote server:

`<field-edit [value]="container.desc" [url]="'/alter_container?container_id='+ container.id" [post_data]="'action=update&desc=%%%'" [label_type]="'h2'" [input_type]="'textarea'" (value_updated)="container.desc = $event;"></field-edit>`

This version makes a javascript call when the editing is completed:

`<field-edit [value]="s.scope" [label_type]="'div'" [custom_header]="'[%%%]'" (value_updated)="updateScope( s.scope, $event)"></field-edit>`

## Screen shots

**Input view mode**

![Screen shot](http://i.imgur.com/Xbi5kx5.png)

**Input edit mode**

![Screen shot](http://i.imgur.com/y7t8wtY.png)

**textarea Markdown mode**

![Screen shot](http://i.imgur.com/u34Orkc.png)

**textarea edit mode**

![Screen shot](http://i.imgur.com/gEpIm2e.png)
