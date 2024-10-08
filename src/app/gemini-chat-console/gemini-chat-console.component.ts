import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { tap } from 'rxjs';

@Component({
  selector: 'app-gemini-chat-console',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    AsyncPipe,
  ],
  templateUrl: './gemini-chat-console.component.html',
  styleUrl: './gemini-chat-console.component.sass'
})
export class GeminiChatConsoleComponent implements OnInit, OnDestroy {

  private chatUrl = 'ws://localhost:8080/chat'

  generatedText = '';
  userInput = '';
  socket: WebSocketSubject<any> | undefined;




  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.socket = webSocket({
        url: this.chatUrl,
        binaryType: 'blob',
        deserializer: (event) => {
          if (typeof event.data === 'string') {
            return event.data;
          }
          return new Error('Unsupported data type');
        }
      });
      this.connectToChat();
    }
  }

  ngOnInit() {

  }

  connectToChat(): void {
    if (isPlatformBrowser(this.platformId) && this.socket) {
      this.socket.pipe(
        tap({
          next: (data: any) => {
            console.log('Received message from server:', data);
            this.generatedText += data;
            // Handle the received message as needed
          },
          error: (error: any) => {
            console.error('WebSocket error:', error);
          }
        })
      ).subscribe();
    }
  }

  sendQuestion(): void {
    if (isPlatformBrowser(this.platformId) && this.socket) {
      this.socket.next(this.userInput);
    }
  }

  closeConnection(): void {
    if (isPlatformBrowser(this.platformId) && this.socket) {
      this.socket.complete();
    }
  }

  ngOnDestroy() {
    this.closeConnection();
  }
}

interface WebSocketMessageEvent extends MessageEvent {
  data: Blob | ArrayBuffer | string;
}

