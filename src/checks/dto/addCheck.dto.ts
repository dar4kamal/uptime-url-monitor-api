import {
  Min,
  IsIn,
  IsInt,
  IsUrl,
  IsPort,
  IsArray,
  IsString,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import {
  URLAuth,
  HTTPHeaders,
  ProtocolOptions,
  AssertStatusCode,
} from '../checks.schema';

export default class AddCheckDTO {
  @IsString({ message: "Check's name is required" })
  name: string;

  @IsUrl({}, { message: 'Invalid Check URL' })
  @IsString({ message: "Check's url is required" })
  url: string;

  @IsString({ message: "Check's protocol is required" })
  @IsIn(Object.values(ProtocolOptions))
  protocol: ProtocolOptions;

  @IsOptional()
  @IsString({ message: "Check's path is required" })
  path?: string;

  @IsOptional()
  @IsPort({ message: 'Invalid Port number' })
  port?: number;

  @IsOptional()
  @IsUrl({}, { message: 'Invalid URl' })
  webhook?: string;

  @Min(1)
  @IsInt()
  @IsOptional()
  timeout?: number;

  @Min(1)
  @IsInt()
  @IsOptional()
  interval?: number;

  @Min(1)
  @IsInt()
  @IsOptional()
  threshold?: number;

  @IsOptional()
  @ValidateNested({
    message: 'authentication must have username/password properties',
  })
  authentication?: URLAuth;

  @IsOptional()
  @IsArray({ message: 'HTTP Headers must be an array' })
  @ValidateNested({ each: true, message: 'HTTP Header must be key-value pair' })
  httpHeaders?: HTTPHeaders;

  @IsOptional()
  @ValidateNested({ message: 'assert must have a statusCode value' })
  assert?: AssertStatusCode;

  @IsOptional()
  @IsString({ each: true, message: 'tag must be a valid string' })
  @IsArray({ message: 'tags must be an array of strings' })
  tags?: string[];

  @IsBoolean({ message: 'ignoreSSL is required' })
  ignoreSSL: boolean;
}
