import { Min, IsInt, IsUrl, IsOptional, ValidateNested } from 'class-validator';

import { AssertStatusCode } from '../interfaces';

export default class RequestOptionsDTO {
  @IsOptional()
  @IsUrl({}, { message: 'Invalid URl' })
  webhook?: string;

  @Min(1)
  @IsInt()
  @IsOptional()
  interval?: number;

  @Min(1)
  @IsInt()
  @IsOptional()
  threshold?: number;

  @IsOptional()
  @ValidateNested({ message: 'assert must have a statusCode value' })
  assert?: AssertStatusCode;
}
