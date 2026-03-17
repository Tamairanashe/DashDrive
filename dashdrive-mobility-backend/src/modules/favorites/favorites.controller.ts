import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':userId/:vehicleId')
  @ApiOperation({ summary: 'Toggle favorite status for a vehicle' })
  toggle(
    @Param('userId') userId: string,
    @Param('vehicleId') vehicleId: string,
  ) {
    return this.favoritesService.toggleFavorite(userId, vehicleId);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get all favorite vehicles for a user' })
  getFavorites(@Param('userId') userId: string) {
    return this.favoritesService.getFavorites(userId);
  }
}
