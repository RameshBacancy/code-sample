import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { CustomerChatComponent } from './customer-chat/customer-chat.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';

// Routing module
import { CustomerChatRoutingModule } from './customer-chat.routing.module';

// Core module
import { CoreModule } from '../../../core/core.module';


@NgModule({
  declarations: [CustomerChatComponent, ChatWindowComponent],
  imports: [
    CommonModule,
    CustomerChatRoutingModule,
    CoreModule
  ]
})
export class CustomerChatModule { }
