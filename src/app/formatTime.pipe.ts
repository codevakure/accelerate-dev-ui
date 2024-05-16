import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Pipe({
    name: 'formatTime'
  })
  export class FormatTimePipe implements PipeTransform {
  
    transform(value: number): string {
      const hours: number = Math.floor(value / 3600);
      const minutes: number = Math.floor((value % 3600) / 60);
      return ('00' + Math.floor(value - minutes * 60)).slice(-2);
    }
  
  }
  