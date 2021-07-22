import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { BecomeATutorStep, TutorVerificationStepDto, TutorVerificationStepStatus } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'li[app-tutor-wizard-step]',
  templateUrl: './tutor-wizard-step.component.html',
  styleUrls: ['./tutor-wizard-step.component.less']
})
export class TutorWizardStepComponent implements OnInit {
  @Input() title: string;
  @Input() link: string;
  @Input() step: BecomeATutorStep;
  @Input() set currentStep(step: BecomeATutorStep) {
    this.isCurrentStep = step === this.step;
    this.isLockedStep = step < this.step;
  }
  @Input() set verificationStep(wizardStep: TutorVerificationStepDto) {
    if (wizardStep != null && wizardStep.step >= 0) {
      this.isDeclinedStep = wizardStep.status === TutorVerificationStepStatus.Declined;
      this.isCompletedStep = wizardStep.status === TutorVerificationStepStatus.Approved;
      this.isSavedStep = wizardStep.status === TutorVerificationStepStatus.Saved;
      this.navigationLink = wizardStep.step >= this.step && this.link ? [this.link] : null;
    }
  }

  @HostBinding('class.current') isCurrentStep: boolean;
  @HostBinding('class.declined') isDeclinedStep: boolean;
  @HostBinding('class.complete') isCompletedStep: boolean;
  @HostBinding('class.saved') isSavedStep: boolean;
  @HostBinding('class.locked') isLockedStep: boolean;
  navigationLink: string[];

  constructor() {
  }

  ngOnInit(): void {
  }

}
