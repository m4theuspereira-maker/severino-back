import {
  Body,
  Controller,
  Patch,
  Post,
  Res,
  Headers,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  badRequest,
  conflictError,
  insufficientFunds,
  notFoundError,
  ok,
  unauthorizedError,
} from '../@handlers/handlers';
import { NotFoundError } from 'rxjs';
import { AuthenticationGuard } from '../authentication/guards/authenticaiton.guard';
import { Public } from '../@decorators/public';
