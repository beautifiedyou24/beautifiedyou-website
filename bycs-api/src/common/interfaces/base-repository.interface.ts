import { BaseModel } from "@common/models/base.model";
import { FilterQuery } from "mongoose";
import { PartialDeep } from "type-fest";

export interface IFindOneOptions<T> {
  filter?: FilterQuery<T>;
  relations?: string[] | any;
}

export interface IFindAllOptions<T> extends IFindOneOptions<T> {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export enum DeletionType {
  SOFT = "SOFT",
  HARD = "HARD",
}

export interface IFindAllResult<T> {
  list: T[];
  totalFilteredItemCount: number;
}

export interface IBaseRepository<T extends BaseModel> {
  getOneInstance(data: PartialDeep<T>): T;
  getAllInstance(data: PartialDeep<T>[]): T[];
  isExists(filterBy: PartialDeep<T>): Promise<boolean>;
  saveOne(data: PartialDeep<T>): Promise<T>;
  saveAll(data: PartialDeep<T>[]): Promise<T[]>;
  findOne(options: IFindOneOptions<T>): Promise<T>;
  findById(id: string): Promise<T>;
  findAll(options?: IFindAllOptions<T>): Promise<IFindAllResult<T>>;
  updateOne(id: string, data: PartialDeep<T>): Promise<boolean>;
  deleteOne(id: string, type?: DeletionType): Promise<boolean>;
  deleteAll(ids: string[], type?: DeletionType): Promise<boolean>;
  countTotalItem(): Promise<number>;
}
