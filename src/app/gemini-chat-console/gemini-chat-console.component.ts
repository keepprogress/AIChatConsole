import { Component, importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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
export class GeminiChatConsoleComponent {
  constructor(
    private http: HttpClient
  ) {}

  userInput: string = '';
  generatedText: string = '';

  sendQuestion() {
    this.http.post('http://localhost:8080/chat', this.userInput, {
      responseType: 'text',
    }).subscribe(
      (text) => {
        this.generatedText += text; // Append the received text
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
