import { Injectable } from "@nestjs/common";

@Injectable()
export class BillingService {
  getConfig() {
    return {
      enabled: false,
      mode: "structure-only" as const
    };
  }
}
