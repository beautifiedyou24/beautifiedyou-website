import { NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { PartialDeep } from "type-fest";
import {
  DeletionType,
  IBaseRepository,
  IFindAllOptions,
  IFindAllResult,
  IFindOneOptions,
} from "./interfaces/base-repository.interface";
import { BaseModel } from "./models/base.model";

export class BaseRepository<T extends BaseModel> implements IBaseRepository<T> {
  constructor(private readonly _model: Model<T>) {}

  getOneInstance(data: PartialDeep<T>): T {
    return new this._model(data);
  }

  getAllInstance(data: PartialDeep<T>[]): T[] {
    return data.map((partial) => new this._model(partial));
  }

  async isExists(filterBy: PartialDeep<T>): Promise<boolean> {
    const exist = await this._model.exists(filterBy);
    return exist ? true : false;
  }

  async saveOne(data: PartialDeep<T>): Promise<T> {
    const savedData = new this._model(data);
    await savedData.save();
    return savedData;
  }

  async saveAll(): Promise<T[]> {
    throw new Error("Method not implemented.");
  }

  async findOne(options: IFindOneOptions<T>): Promise<T> {
    const { filter = {}, relations = [] } = options;
    const data = await this._model.findOne({ ...filter }).populate(relations);
    return data;
  }

  async findById(id: string | number, relations?: string[]): Promise<T> {
    const data = await this._model.findById(id).populate(relations);
    return data;
  }

  async findAll(options?: IFindAllOptions<T>): Promise<IFindAllResult<T>> {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      filter = {},
      relations = [],
    } = options ? options : ({} as any);

    const order = { [sortBy]: sortOrder };

    const [list, total] = await Promise.all([
      this._model
        .find({ ...filter })
        .sort(order)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate(relations),
      this._model.countDocuments({ ...filter }),
    ]);

    return { list: list, totalFilteredItemCount: total };
  }

  async updateOne(id: string, data: PartialDeep<T>): Promise<boolean> {
    const updatedOption = await this._model.updateOne({ _id: id }, { $set: { ...data } });
    if (!updatedOption.matchedCount) throw new NotFoundException("NOT FOUND");
    return true;
  }

  async deleteOne(id: string, type?: DeletionType): Promise<boolean> {
    if (type === DeletionType.SOFT) {
      const updatedOption = await this._model.updateOne({ _id: id }, { $set: { deletedAt: Date.now() } });
      if (!updatedOption.matchedCount) throw new NotFoundException("NOT FOUND");
    } else {
      const deleteOption = await this._model.deleteOne({ _id: id });
      if (!deleteOption.deletedCount) throw new NotFoundException("NOT FOUND");
    }
    return true;
  }

  deleteAll(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async countTotalItem(): Promise<number> {
    const count = await this._model.estimatedDocumentCount();
    return count;
  }
}
