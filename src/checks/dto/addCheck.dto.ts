import { IsArray, IsString, IsOptional } from 'class-validator';

import RequestDTO from 'src/axios/dto/request.dto';

export default class AddCheckDTO extends RequestDTO {
  @IsString({ message: "Check's name is required" })
  name: string;

  @IsOptional()
  @IsString({ each: true, message: 'tag must be a valid string' })
  @IsArray({ message: 'tags must be an array of strings' })
  tags?: string[];
}
