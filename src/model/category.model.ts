import { Model, Optional } from "sequelize";

export interface CategoryAttributes {
  id: number;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryCreationAttributes extends Optional<CategoryAttributes, "id"> {}

export interface CategoryInstance
  extends Model<CategoryAttributes, CategoryCreationAttributes>,
    CategoryAttributes {}

export interface CategoryModel extends Model<CategoryAttributes>, CategoryAttributes {};

class Category extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

export default Category;
