import {ApplicationConfig, provideZoneChangeDetection, importProvidersFrom} from '@angular/core';

import {provideHttpClient} from "@angular/common/http";
import {HttpClientInMemoryWebApiModule} from "angular-in-memory-web-api";
import {InMemoryDataService} from "./services/in-memoty-data.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideHttpClient(),
    importProvidersFrom(HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {dataEncapsulation: false}))
  ]
};
