import { Injectable, NgZone } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventSourceService {
  // this is Imitated from
  // https://medium.com/@andrewkoliaka/implementing-server-sent-events-in-angular-a5e40617cb78

  /**
   * constructor
   * @param zone - we need to use zone while working with server-sent events
   * because it's an asynchronous operations which are run outside of change detection scope
   * && we need to notify Angular about changes related to SSE events
   * @param eventSource
   */
  constructor(
    private zone: NgZone,
    private eventSource: EventSource
  ) {}

  /**
   * Method for creation of the EventSource instance
   * @param url
   * @param options
   */
  getEventSource(url: string, options: EventSourceInit) {
    return new EventSource(url, options);
  }

  /**
   * Method for establishing connection and subscribing to events from SSE
   * @param url - SSE server api path
   * @param options - configuration object for SSE
   * @param eventNames - all event names except error (listens by default) you want to listen to
   */
  connectToServerEvents(
    url: string,
    options: EventSourceInit,
    eventNames: string[] = []
  ): Observable<Event> {
    return new Observable((subscriber: Subscriber<Event>) => {
      this.eventSource.onerror = error => {
        this.zone.run(() => subscriber.error(error));
      };

      eventNames.forEach((event: string) => {
        this.eventSource.addEventListener(event, data => {
          this.zone.run(() => subscriber.next(data));
        });
      })
    });
  }
}
