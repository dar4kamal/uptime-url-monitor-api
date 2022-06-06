import {
  Min,
  IsIn,
  IsInt,
  // IsUrl,
  IsArray,
  // Matches,
  IsString,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
// import { PortRegex } from '../utils';
import { ProtocolOptions } from '../enums';
import RequestOptionsDTO from './requestOptions.dto';
import { URLAuth, HTTPHeaders } from '../interfaces';

export default class RequestDTO extends RequestOptionsDTO {
  // @IsUrl({}, { message: 'Invalid Check URL' })
  @IsString({ message: "Check's url is required" })
  url: string;

  @IsString({ message: "Check's protocol is required" })
  @IsIn(Object.values(ProtocolOptions))
  protocol: ProtocolOptions;

  @IsOptional()
  @IsString({ message: "Check's path is required" })
  path?: string;

  @IsOptional()
  // @Matches(PortRegex, { message: 'Invalid Port number' })
  port?: number;

  @Min(1)
  @IsInt()
  @IsOptional()
  timeout?: number;

  @IsOptional()
  @ValidateNested({
    message: 'authentication must have username/password properties',
  })
  authentication?: URLAuth;

  @IsOptional()
  @IsArray({ message: 'HTTP Headers must be an array' })
  @ValidateNested({ each: true, message: 'HTTP Header must be key-value pair' })
  httpHeaders?: HTTPHeaders[];

  @IsBoolean({ message: 'ignoreSSL is required' })
  ignoreSSL: boolean;
}
