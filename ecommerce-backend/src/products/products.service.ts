import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { Product } from './entities/product.entity.js';
import { GetProductsResponse } from './product.types.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  createProduct(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAllProducts(
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    sortBy: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    page: number = 1,
    limit: number = 5,
  ) {
    // 1. Initializing QueryBuilder with an alias 'product
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    // 2. Text search
    if (search) {
      queryBuilder.andWhere('(product.title ILIKE :search OR product.description ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    // 3. Range filtering
    if (minPrice) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    // 4. Sorting
    queryBuilder.orderBy(`product.${sortBy}`, sortOrder);
    queryBuilder.addOrderBy('product.id', 'ASC');

    // 5. Pagination (calculate offset or skip)
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // 6.Execute query - GetManyAndCount  returns both the raw items array and total count
    const [items, total] = await queryBuilder.getManyAndCount();

    const getProductsResponse: GetProductsResponse = {
      data: items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
    return getProductsResponse;
  }

  async findProductById(id: number) {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    queryBuilder.andWhere('product.id = :id', { id: id });

    const product = await queryBuilder.getOne();
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
