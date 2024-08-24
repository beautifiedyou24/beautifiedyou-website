import { Mapper } from "@automapper/core";
import { HttpException, HttpStatus, NotFoundException } from "@nestjs/common";
import { PartialDeep } from "type-fest";
import { BaseCreateDto } from "./dto/base-create.dto";
import { BaseResponseDto } from "./dto/base-response.dto";
import { BaseUpdateDto } from "./dto/base-update.dto";
import { PaginatedBaseResponseDto } from "./dto/paginated-base-response.dto";
import { PaginationMeta } from "./dto/pagination-meta.dto";
import {
  DeletionType,
  IBaseRepository,
  IFindAllOptions,
  IFindOneOptions,
} from "./interfaces/base-repository.interface";
import { IBaseService } from "./interfaces/base-service.interface";
import { BaseModel } from "./models/base.model";

export abstract class BaseService<
  TModel extends BaseModel,
  TCreateDto extends BaseCreateDto,
  TUpdateDto extends BaseUpdateDto,
  TResponseDto extends BaseResponseDto,
> implements IBaseService<TModel, TCreateDto, TUpdateDto, TResponseDto>
{
  private ModelClass: any;
  private CreateDtoClass: any;
  private UpdateDtoClass: any;
  private ResponseDtoClass: any;

  constructor(
    private readonly _repository: IBaseRepository<TModel>,
    private readonly _mapper: Mapper,
    { modelClass, createDtoClass, updateDtoClass, responseDtoClass },
  ) {
    this.ModelClass = modelClass;
    this.CreateDtoClass = createDtoClass;
    this.UpdateDtoClass = updateDtoClass;
    this.ResponseDtoClass = responseDtoClass;
  }

  async createOne(createDto: TCreateDto): Promise<TResponseDto> {
    const data = await this._repository.saveOne(createDto as PartialDeep<TModel>);
    const mappedData = this._mapper.map<TModel, TResponseDto>(data, this.ModelClass, this.ResponseDtoClass);
    return mappedData;
  }

  async createAll(createDto: TCreateDto[]): Promise<TResponseDto[]> {
    const list = await this._repository.saveAll(createDto as any[]);
    const mappedList = this._mapper.mapArray<TModel, TResponseDto>(list, this.ModelClass, this.ResponseDtoClass);
    return mappedList;
  }

  async findOne(options: IFindOneOptions<TModel>): Promise<TResponseDto> {
    const data = await this._repository.findOne(options);
    const mappedData = this._mapper.map<TModel, TResponseDto>(data, this.ModelClass, this.ResponseDtoClass);
    return mappedData;
  }

  async findOneById(id: string): Promise<TResponseDto> {
    const data = await this._repository.findById(id);
    if (!data) throw new NotFoundException("NOT FOUND");
    const mappedData = this._mapper.map<TModel, TResponseDto>(data, this.ModelClass, this.ResponseDtoClass);
    return mappedData;
  }

  async findAll(options?: IFindAllOptions<TModel>): Promise<{ list: TResponseDto[]; totalFilteredItemCount: number }> {
    const { list, totalFilteredItemCount } = await this._repository.findAll(options);
    const mappedList = this._mapper.mapArray<TModel, TResponseDto>(list, this.ModelClass, this.ResponseDtoClass);
    return { list: mappedList, totalFilteredItemCount };
  }

  async paginate(options: IFindAllOptions<TModel>): Promise<PaginatedBaseResponseDto> {
    const { list, totalFilteredItemCount } = await this.findAll(options);

    const { page, limit } = options;
    const itemCount = list.length;

    const meta = await this.getPaginationMeta({ page, limit, itemCount, totalFilteredItemCount });

    const paginatedData = {
      meta,
      items: list,
    };

    return paginatedData;
  }

  async updateOne(id: string, updateDto: TUpdateDto): Promise<TResponseDto> {
    const updated = await this._repository.updateOne(id, updateDto as PartialDeep<TModel>);

    if (!updated) throw new HttpException("Update failed", HttpStatus.INTERNAL_SERVER_ERROR);

    const data = await this._repository.findById(id);

    const mappedData = this._mapper.map<TModel, TResponseDto>(data, this.ModelClass, this.ResponseDtoClass);
    return mappedData;
  }

  async deleteOne(id: string): Promise<boolean> {
    const deleted = await this._repository.deleteOne(id);
    if (!deleted) throw new NotFoundException("NOT FOUND");
    return deleted;
  }

  async softDeleteOne(id: string): Promise<boolean> {
    const deleted = await this._repository.deleteOne(id, DeletionType.SOFT);
    if (!deleted) throw new NotFoundException("NOT FOUND");
    return deleted;
  }

  async getPaginationMeta(params: {
    page?: number;
    limit?: number;
    itemCount: number;
    totalFilteredItemCount: number;
  }): Promise<PaginationMeta> {
    const { page, limit, itemCount, totalFilteredItemCount } = params;

    let totalItemCount = itemCount;
    if (page && limit) totalItemCount = await this._repository.countTotalItem();

    let actualLimit = totalItemCount;
    if (page && limit) actualLimit = Math.min(totalItemCount, limit);

    return {
      itemCount: itemCount,
      totalFilteredItemCount: totalFilteredItemCount,
      totalItemCount: totalItemCount,
      currentPage: page ?? 1,
      totalPageCount: actualLimit > 0 ? Math.ceil(totalFilteredItemCount / actualLimit) : 1,
      itemPerPage: actualLimit,
    };
  }
}
