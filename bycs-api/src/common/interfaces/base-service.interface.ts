import { BaseCreateDto } from "@common/dto/base-create.dto";
import { BaseResponseDto } from "@common/dto/base-response.dto";
import { BaseUpdateDto } from "@common/dto/base-update.dto";
import { PaginatedBaseResponseDto } from "@common/dto/paginated-base-response.dto";
import { PaginationMeta } from "@common/dto/pagination-meta.dto";
import { BaseModel } from "@common/models/base.model";
import { IFindAllOptions, IFindAllResult, IFindOneOptions } from "./base-repository.interface";

export interface IBaseService<
  TModel extends BaseModel,
  TCreateDto extends BaseCreateDto,
  TUpdateDto extends BaseUpdateDto,
  TResponseDto extends BaseResponseDto,
> {
  createOne(createDto: TCreateDto): Promise<TResponseDto>;
  createAll(createDto: TCreateDto[]): Promise<TResponseDto[]>;
  findOne(options: IFindOneOptions<TModel>): Promise<TResponseDto>;
  findOneById(id: string): Promise<TResponseDto>;
  findAll(options?: IFindAllOptions<TModel>): Promise<IFindAllResult<TResponseDto>>;
  paginate(options: IFindAllOptions<TModel>): Promise<PaginatedBaseResponseDto>;
  updateOne(id: string, updateDto: TUpdateDto): Promise<TResponseDto>;
  deleteOne(id: string): Promise<boolean>;
  softDeleteOne(id: string): Promise<boolean>;
  getPaginationMeta(params: { page?: number; limit?: number; itemCount: number }): Promise<PaginationMeta>;
}
