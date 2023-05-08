import { IsEnum, IsNotEmpty } from 'class-validator';
import FileType from '../../../enums/fileType.enum';

class FileUploadViaUrlDto {
  @IsNotEmpty()
  fileUrl!: string;

  @IsNotEmpty()
  @IsEnum(FileType)
  fileType!: FileType;

  @IsNotEmpty()
  fileName!: string;

  @IsNotEmpty()
  fromId!: string;

  @IsNotEmpty()
  tenantId!: string;
}

export default FileUploadViaUrlDto;
