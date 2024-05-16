import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'allhtml'
})
export class AllhtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(value: any, args?: any): any {
    console.log("THIS PIPE is RUNNING", value);
    return this.sanitizer.bypassSecurityTrustHtml(value)
    

  }

}
