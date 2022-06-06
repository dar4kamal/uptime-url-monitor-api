import https from 'https';
import { Model } from 'mongoose';
import { AxiosRequestConfig } from 'axios';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';

import {
  parseHeaders,
  calculateAvailability,
  calculateResponseTime,
  calculateAvgResponseTime,
} from 'src/axios/utils';
import { URLStatus } from './enums';
import { Report } from 'src/reports/reports.schema';
import { ReportIdConfigs } from 'src/reports/interfaces';
import { AxiosRequestAdditionalConfig } from './interfaces';

import RequestDTO from './dto/request.dto';
import RequestOptionsDTO from './dto/requestOptions.dto';

@Injectable()
export class AxiosService {
  timer: number = 0;
  currentReport: Report;
  requestInterceptorId: number;
  responseInterceptorId: number;

  constructor(
    private httpService: HttpService,
    @InjectModel(Report.name) private reportModel: Model<Report>,
  ) {}

  checkAssertion(
    currentStatusCode: number,
    assertStatusCode: number,
    webhook?: string,
  ) {
    if (currentStatusCode !== assertStatusCode) {
      // TODO send notification to user
      console.log('send notification to user [failed assertions]');
      // TODO send notification to user's webhook
      if (webhook)
        console.log("send notification to user's webhook [failed assertion]");
    }
  }

  checkOutageThreshold(outages: number, threshold: number, webhook?: string) {
    if (outages >= threshold) {
      // TODO send notification to user
      console.log('send notification to user [exceed thresold]');
      // TODO send notification to user's webhook
      if (webhook)
        console.log("send notification to user's webhook [exceed thresold]");
    }
  }

  private setRequestInterceptor() {
    this.requestInterceptorId =
      this.httpService.axiosRef.interceptors.request.use(
        (request: AxiosRequestConfig & AxiosRequestAdditionalConfig) => {
          this.timer = performance.now();
          return request;
        },
        function (error) {
          return Promise.reject(error);
        },
      );
  }

  private setResponseInterceptor(requestOptions: RequestOptionsDTO) {
    const { interval, assert, threshold, webhook } = requestOptions;

    this.responseInterceptorId =
      this.httpService.axiosRef.interceptors.response.use(
        async (response) => {
          const responseTime = calculateResponseTime(this.timer);
          const currentReportTimeStamp = new Date();
          const lastURLStatus =
            this.currentReport.history[this.currentReport.history.length - 1]
              ?.status;

          if (assert?.statusCode)
            this.checkAssertion(response.status, assert?.statusCode, webhook);

          if (this.currentReport.history.length > 0) {
            if (lastURLStatus !== URLStatus.UP) {
              this.currentReport.downtime += interval * 60;

              // TODO send notification to user [down to up]
              console.log('send notification to user [down to up]');
              if (webhook)
                console.log("send notification to user's webhook [down to up]");
            } else {
              this.currentReport.uptime += interval * 60;
            }

            this.currentReport.availability = calculateAvailability(
              this.currentReport.uptime,
              this.currentReport.downtime,
            );
          }

          this.currentReport.history.push({
            responseTime,
            status: URLStatus.UP,
            createdAt: currentReportTimeStamp,
          });
          this.currentReport.responseTime = calculateAvgResponseTime(
            this.currentReport.history,
          );

          await this.currentReport.save();
          return response;
        },
        async (error) => {
          const responseTime = calculateResponseTime(this.timer);
          const currentReportTimeStamp = new Date();
          const lastURLStatus =
            this.currentReport.history[this.currentReport.history.length - 1]
              ?.status;

          if (assert?.statusCode)
            this.checkAssertion(error.status, assert?.statusCode, webhook);

          this.checkOutageThreshold(
            this.currentReport.outages,
            threshold,
            webhook,
          );

          if (this.currentReport.history.length > 0) {
            // Check Past URL status
            if (lastURLStatus === URLStatus.UP) {
              // TODO send notification to user [up to down]
              console.log('send notification to user [up to down]');
              if (webhook)
                console.log("send notification to user's webhook [up to down]");
              this.currentReport.uptime += interval * 60;
            } else this.currentReport.downtime += interval * 60;

            this.currentReport.availability = calculateAvailability(
              this.currentReport.uptime,
              this.currentReport.downtime,
            );
          }
          this.currentReport.history.push({
            responseTime,
            status: URLStatus.DOWN,
            createdAt: currentReportTimeStamp,
          });
          this.currentReport.responseTime = calculateAvgResponseTime(
            this.currentReport.history,
          );
          await this.currentReport.save();
          return Promise.reject(error);
        },
      );
  }

  private setupInterceptors(requestOptions: RequestOptionsDTO) {
    this.setRequestInterceptor();
    this.setResponseInterceptor(requestOptions);
  }

  private clearInterceptors() {
    this.httpService.axiosRef.interceptors.request.eject(
      this.requestInterceptorId,
    );
    this.httpService.axiosRef.interceptors.response.eject(
      this.responseInterceptorId,
    );
  }

  async request(requestDTO: RequestDTO, reportIdConfigs: ReportIdConfigs) {
    const {
      url,
      port,
      path,
      assert,
      timeout,
      webhook,
      protocol,
      interval,
      threshold,
      ignoreSSL,
      httpHeaders,
      authentication,
    } = requestDTO;

    const { userId, checkId } = reportIdConfigs;

    this.currentReport = await this.reportModel.findOne({ userId, checkId });
    if (!this.currentReport) {
      this.currentReport = new this.reportModel({ userId, checkId });
    }

    this.clearInterceptors();
    console.log('Set interceptors');
    this.setupInterceptors({ assert, interval, threshold, webhook });

    try {
      await this.httpService.axiosRef(url, {
        ...(port !== undefined && { port }),
        ...(path !== undefined && { path }),
        ...(timeout !== undefined && { timeout: timeout * 1000 }),
        ...(protocol !== undefined && { protocol }),
        ...(authentication &&
          authentication.username &&
          authentication.password && {
            auth: authentication,
          }),
        ...(httpHeaders &&
          httpHeaders.length > 0 && {
            headers: parseHeaders(httpHeaders),
          }),
        ...(ignoreSSL && {
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        }),
      });
    } catch (error) {
      console.log(error);
    }
    this.clearInterceptors();
  }
}
