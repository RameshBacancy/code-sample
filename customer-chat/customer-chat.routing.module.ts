import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// Components
import { CustomerChatComponent } from './customer-chat/customer-chat.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerChatComponent,
    children: [
      {
        path: ':id/:type',
        component: ChatWindowComponent
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerChatRoutingModule {}
