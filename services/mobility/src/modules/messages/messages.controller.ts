import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Send a message' })
  sendMessage(
    @Body() data: { senderId: string; receiverId: string; tripId?: string; content: string },
  ) {
    return this.messagesService.sendMessage(data);
  }

  @Get('conversation/:user1/:user2')
  @ApiOperation({ summary: 'Get conversation history between two users' })
  getConversation(@Param('user1') user1: string, @Param('user2') user2: string) {
    return this.messagesService.getConversation(user1, user2);
  }

  @Get('my-conversations/:userId')
  @ApiOperation({ summary: 'Get list of active conversations for a user' })
  getMyConversations(@Param('userId') userId: string) {
    return this.messagesService.getMyConversations(userId);
  }
}
