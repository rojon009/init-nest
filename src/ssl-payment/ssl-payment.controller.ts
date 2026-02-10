import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { SslPaymentService } from './ssl-payment.service';
import { InitSslPaymentDto } from './dto/init-ssl-payment.dto';
import { ValidateSslPaymentDto } from './dto/validate-ssl-payment.dto';
import { SslPaymentCallbackDto } from './dto/ssl-payment-callback.dto';
import { InitiateSslRefundDto, RefundQueryDto } from './dto/ssl-refund.dto';
import {
  SslTransactionQueryByTransactionIdDto,
  SslTransactionQueryBySessionIdDto,
} from './dto/ssl-transaction-query.dto';
@Controller('ssl-payment')
export class SslPaymentController {
  constructor(private readonly SslPaymentService: SslPaymentService) {}

  /**
   * Initialize a transaction. Returns gateway response (use GatewayPageURL to redirect user).
   * POST /payment/init
   */
  @Post('init')
  async init(@Body() dto: InitSslPaymentDto) {
    return this.SslPaymentService.init(dto);
  }

  /**
   * Validate a transaction (call from success/IPN with val_id from SSLCommerz response).
   * GET /payment/validate?val_id=...
   */
  @Get('validate')
  async validate(@Query() query: ValidateSslPaymentDto) {
    return this.SslPaymentService.validate(query.val_id);
  }

  /**
   * Initiate a refund.
   * GET /payment/refund/initiate (query params or use POST with body)
   */
  @Post('refund/initiate')
  async initiateRefund(@Body() dto: InitiateSslRefundDto) {
    return this.SslPaymentService.initiateRefund(dto);
  }

  /**
   * Query refund status.
   * GET /payment/refund/query?refund_ref_id=...
   */
  @Get('refund/query')
  async refundQuery(@Query() query: RefundQueryDto) {
    return this.SslPaymentService.refundQuery(query.refund_ref_id);
  }

  /**
   * Query transaction by transaction ID.
   * GET /payment/transaction?tran_id=...
   */
  @Get('transaction')
  async transactionQueryByTransactionId(
    @Query() query: SslTransactionQueryByTransactionIdDto,
  ) {
    return this.SslPaymentService.transactionQueryByTransactionId(
      query.tran_id,
    );
  }

  /**
   * Query transaction by session ID.
   * GET /payment/transaction/session?sessionkey=...
   */
  @Get('transaction/session')
  async transactionQueryBySessionId(
    @Query() query: SslTransactionQueryBySessionIdDto,
  ) {
    return this.SslPaymentService.transactionQueryBySessionId(query.sessionkey);
  }

  @Post('success')
  success(@Body() dto: SslPaymentCallbackDto) {
    if (!dto.val_id) return dto;
    return this.SslPaymentService.validate(dto.val_id);
  }

  @Post('fail')
  failure(@Body() dto: SslPaymentCallbackDto) {
    return dto;
  }

  @Post('cancel')
  cancel(@Body() dto: SslPaymentCallbackDto) {
    console.log('cancel', dto);
    return dto;
  }

  @Post('ipn')
  ipn(@Body() dto: SslPaymentCallbackDto) {
    console.log('ipn', dto);
    // if (dto.val_id) return this.SslPaymentService.validate(dto.val_id);
    return dto;
  }
}
