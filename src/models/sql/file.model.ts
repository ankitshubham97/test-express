import FileType from '../../enums/fileType.enum';
import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

interface FileAttributes {
  id?: number;
  fileUrl: string;
  fileType: FileType;
  fileName: string;
  fromId: string;
  tenantId: string;
}

@Table
class File extends Model<FileAttributes, FileAttributes> {
  @Column
  fileUrl!: string;

  @Column
  fileType!: FileType;

  @Column
  fileName!: string;

  @Column
  fromId!: string;

  @Column
  tenantId!: string;

  @Column
  @CreatedAt
  createdAt!: Date;

  @Column
  @UpdatedAt
  updatedAt!: Date;
}

export default File;
export { FileAttributes };
