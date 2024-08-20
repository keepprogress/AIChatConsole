import { Routes } from '@angular/router';
import { GeminiChatConsoleComponent } from './gemini-chat-console/gemini-chat-console.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

export const routes: Routes = [
  {
    path: 'GeminiChatConsole',
    component: GeminiChatConsoleComponent,
    providers: [
      importProvidersFrom(HttpClientModule)
    ],
  },
];
