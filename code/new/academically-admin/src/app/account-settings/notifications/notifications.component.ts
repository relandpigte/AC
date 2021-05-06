import { Component, Injector } from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.less"],
})
export class NotificationsComponent extends AppComponentBase {
  constructor(injector: Injector) {
    super(injector);
  }
}
