import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { GetProductsQueryDto } from './dto/get-products-query.dto.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Get()
  findAllProducts(@Query() getproductsQueryDto: GetProductsQueryDto) {
    return this.productsService.findAllProducts(
      getproductsQueryDto.search,
      getproductsQueryDto.minPrice,
      getproductsQueryDto.maxPrice,
      getproductsQueryDto.sortBy,
      getproductsQueryDto.sortOrder,
      getproductsQueryDto.page,
      getproductsQueryDto.limit,
    );
  }

  @Get(':id')
  findProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findProductById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
