import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth/auth.guard';

import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  /**
   * Return all NFTs
   * @returns
   */
  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  /**
   * Get one NFT by id
   * @param id
   * @returns
   */
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }

  /**
   * Burn an NFT by id
   * @param id
   * @returns
   */
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(id);
  }
}
