import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  channel: string = undefined;
  @Output() channelChanged: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.channel = 'froggedtv'
  }
}
