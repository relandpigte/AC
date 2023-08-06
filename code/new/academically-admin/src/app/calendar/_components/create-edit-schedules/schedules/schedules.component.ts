import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AutoSaveComponentBase } from '@shared/auto-save-component-base';
import { DayOfWeek, UserAvailabilityDto } from '@shared/service-proxies/service-proxies';
import { ScheduleType } from '../create-edit-schedules.component';

import * as _ from 'lodash';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
    selector: 'app-schedules',
    templateUrl: './schedules.component.html',
    styleUrls: ['./schedules.component.less'],
})
export class SchedulesComponent extends AutoSaveComponentBase implements OnInit, OnChanges {
    @Input() userAvailabilities: UserAvailabilityDto[] = [];
    @Input() type: ScheduleType = ScheduleType.DEFAULT;

    @Output() modelChanged: EventEmitter<any> = new EventEmitter();

    timeSelections: { label: string; value: Date }[] = [];
    models: {
        [day in DayOfWeek | number]?: {
            availability: any;
            breaks: {
                availability: any;
                startTime: { label: string; value: Date };
                endTime: { label: string; value: Date }
            }[];
            startTime: { label: string; value: Date };
            endTime: { label: string; value: Date };
            type: ScheduleType;
        };
    } = {};

    DayOfWeek = DayOfWeek;
    ScheduleType = ScheduleType;
    datePickerConfig: BsDatepickerConfig;

    nowValue: number;

    newDateDpValue: Date;

    constructor(
        injector: Injector,
    ) {
        super(injector);
        this.datePickerConfig = new BsDatepickerConfig();
        this.datePickerConfig.showWeekNumbers = false;
        this.datePickerConfig.dateInputFormat = 'DD MMM, YYYY';
        this.datePickerConfig.adaptivePosition = true;

        const now = new Date();
        this.nowValue = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).valueOf();
    }

    ngOnInit(): void {
        this.init();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.type) {
            if (this.type === ScheduleType.CUSTOM && !(this.nowValue in this.models)) {
                this.addAvailability(this.nowValue);
            }
        }
    }

    get customDates() {
        return Object.keys(this.models).filter(k => !_.isNil(this.models[k].availability.specificDate)).map(k => +k);
    }

    init(): void {
        this.initTimeselections();
        this.initModels();
        this.initChangesDetector();
    }

    private createDateFromTime(time: string): Date {
        const now = new Date();
        const startTimeParts = time.split(':');
        return new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            +startTimeParts[0],
            +startTimeParts[1],
            0
        );
    }

    private initTimeselections() {
        const now = new Date();
        for (var hour = 0; hour < 24; hour++) {
            for (var min = 0; min < 60; min += 15) {
                this.timeSelections.push({
                    label: `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}${hour < 12 ? 'am' : 'pm'}`,
                    value: new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, min, 0),
                });
            }
        }
    }

    private initModels(): void {
        this.initDefaultModels();
        this.initCustomModels();
    }

    private initDefaultModels(): void {
        const now = new Date();
        const defaultAvailabilities = this.userAvailabilities.filter(a => !_.isNil(a.dayOfWeek));
        for (let i = 0; i < 7; i++) {
            const existing = _.minBy(defaultAvailabilities.filter((e) => e.dayOfWeek == i), (a) => a.startTime);
            const existingStartTimeDate = existing?.startTime ? this.createDateFromTime(existing.startTime) : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
            const existingEndTimeDate = existing?.endTime ? this.createDateFromTime(existing.endTime) : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);

            this.models[i] = {
                availability: existing ?? {},
                breaks: defaultAvailabilities?.filter(a => a.dayOfWeek == i && a.id !== existing?.id)?.map(b => {
                    const existingBreakStartTime = this.createDateFromTime(b.startTime);
                    const existingBreakEndTime = this.createDateFromTime(b.endTime);
                    return {
                        availability: b,
                        startTime: {
                            label: `${existingBreakStartTime.getHours().toString().padStart(2, '0')}:${existingBreakStartTime.getMinutes().toString().padStart(2, '0')}${existingBreakStartTime.getHours() < 12 ? 'am' : 'pm'}`,
                            value: existingBreakStartTime,
                         },
                        endTime: {
                            label: `${existingBreakEndTime.getHours().toString().padStart(2, '0')}:${existingBreakEndTime.getMinutes().toString().padStart(2, '0')}${existingBreakEndTime.getHours() < 12 ? 'am' : 'pm'}`,
                            value: existingBreakEndTime,
                         },
                        type: ScheduleType.DEFAULT
                    }
                }) ?? [],
                startTime: {
                    label: `${existingStartTimeDate.getHours().toString().padStart(2, '0')}:${existingStartTimeDate.getMinutes().toString().padStart(2, '0')}${existingStartTimeDate.getHours() < 12 ? 'am' : 'pm'}`,
                    value: existingStartTimeDate,
                },
                endTime: {
                    label: `${existingEndTimeDate.getHours().toString().padStart(2, '0')}:${existingEndTimeDate.getMinutes().toString().padStart(2, '0')}${existingEndTimeDate.getHours() < 12 ? 'am' : 'pm'}`,
                    value: existingEndTimeDate,
                },
                type: ScheduleType.DEFAULT
            };
        }
    }

    private initCustomModels(): void {
        const now = new Date();
        const filteredAvailabilities = this.userAvailabilities.filter(a => !_.isNil(a.specificDate));
        const specificDates = _.uniq(filteredAvailabilities.map(a => a.specificDate.valueOf()));
        specificDates.forEach(specificDate => {
            const existing = _.minBy(filteredAvailabilities.filter((a) => a.specificDate?.valueOf() == specificDate), (a) => a.startTime);
            const existingStartTimeDate = existing?.startTime ? this.createDateFromTime(existing.startTime) : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
            const existingEndTimeDate = existing?.endTime ? this.createDateFromTime(existing.endTime) : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);

            this.models[specificDate] = {
                availability: { ...existing, specificDateDpValue: existing.specificDate.toDate() },
                breaks: filteredAvailabilities.filter(a => a.specificDate.valueOf() == specificDate && a.id !== existing?.id)?.map(b => {
                    const existingBreakStartTime = this.createDateFromTime(b.startTime);
                    const existingBreakEndTime = this.createDateFromTime(b.endTime);
                    return {
                        availability: b,
                        startTime: {
                            label: `${existingBreakStartTime.getHours().toString().padStart(2, '0')}:${existingBreakStartTime.getMinutes().toString().padStart(2, '0')}${existingBreakStartTime.getHours() < 12 ? 'am' : 'pm'}`,
                            value: existingBreakStartTime,
                         },
                        endTime: {
                            label: `${existingBreakEndTime.getHours().toString().padStart(2, '0')}:${existingBreakEndTime.getMinutes().toString().padStart(2, '0')}${existingBreakEndTime.getHours() < 12 ? 'am' : 'pm'}`,
                            value: existingBreakEndTime,
                         },
                        type: ScheduleType.CUSTOM
                    }
                }) ?? [],
                startTime: {
                    label: `${existingStartTimeDate.getHours().toString().padStart(2, '0')}:${existingStartTimeDate.getMinutes().toString().padStart(2, '0')}${existingStartTimeDate.getHours() < 12 ? 'am' : 'pm'}`,
                    value: existingStartTimeDate,
                },
                endTime: {
                    label: `${existingEndTimeDate.getHours().toString().padStart(2, '0')}:${existingEndTimeDate.getMinutes().toString().padStart(2, '0')}${existingEndTimeDate.getHours() < 12 ? 'am' : 'pm'}`,
                    value: existingEndTimeDate,
                },
                type: ScheduleType.CUSTOM
            };
        });
    }

    private initChangesDetector(): void {
        this.intervalMs = 100;
        this.modelToSave = this.models;
        this.initAutoSave(this.changesDetected);
    }

    blockedTimeSelections(day: number): { label: string; value: Date }[] {
        const startTime = this.models[day].startTime.value;
        const endTime = this.models[day].endTime.value;
        const selections = this.timeSelections.filter(
            (e) =>
                e.value.getTime() >= startTime.getTime() &&
                e.value.getTime() <= endTime.getTime()
        );
        return selections;
    }

    getBreakValue(day: number, idx: number, time: string): string {
        return this.models[day]?.breaks?.[idx]?.[time]?.label ?? this.l('Select');
    }

    changesDetected(): void {
        Object.keys(this.models).forEach(day => {
            this.models[day] = {
                ...this.models[day],
                availability: {
                    ...this.models[day].availability,
                    startTime: this.strPadLeft(this.models[day].startTime.value.getHours(), 2) + ':' + this.strPadLeft(this.models[day].startTime.value.getMinutes(), 2),
                    endTime: this.strPadLeft(this.models[day].endTime.value.getHours(), 2) + ':' + this.strPadLeft(this.models[day].endTime.value.getMinutes(), 2),
                    specificDate: this.models[day].availability.specificDateDpValue ? moment(this.models[day].availability.specificDateDpValue) : null
                },
                breaks: this.models[day].breaks.map(b => {
                    return {
                        ...b,
                        availability: {
                            ...b.availability,
                            startTime: b.startTime?.value ? this.strPadLeft(b.startTime.value.getHours(), 2) + ':' + this.strPadLeft(b.startTime.value.getMinutes(), 2) : null,
                            endTime: b.endTime?.value ? this.strPadLeft(b.endTime.value.getHours(), 2) + ':' + this.strPadLeft(b.endTime.value.getMinutes(), 2) : null,
                        }
                    }
                })
            };
        });
        this.modelChanged.next(this.models);
    }

    addAvailability(day: number): void {
        const specificDate = moment(day);
        const specificDateDpValue = specificDate.toDate();
        const dayOfWeek = (specificDate.day() + 1) % 7;
        const defaultAvailabilities = this.userAvailabilities.filter(a => !_.isNil(a.dayOfWeek));
        const defaultAvailability = _.minBy(defaultAvailabilities.filter((e) => e.dayOfWeek == dayOfWeek), (a) => a.startTime);
        const defaultStartTimeDate = defaultAvailability?.startTime ? this.createDateFromTime(defaultAvailability.startTime) : new Date(specificDateDpValue.getFullYear(), specificDateDpValue.getMonth(), specificDateDpValue.getDate(), 9, 0, 0);
        const defaultEndTimeDate = defaultAvailability?.endTime ? this.createDateFromTime(defaultAvailability.endTime) : new Date(specificDateDpValue.getFullYear(), specificDateDpValue.getMonth(), specificDateDpValue.getDate(), 18, 0, 0);

        this.models[day] = {
            availability: {
                ...defaultAvailability,
                id: null,
                dayOfWeek: null,
                specificDate,
                specificDateDpValue
            },
            breaks: defaultAvailabilities?.filter(b => b.dayOfWeek === dayOfWeek && b.id !== defaultAvailability?.id)?.map(b => {
                const defaultBreakStartTime = this.createDateFromTime(b.startTime);
                const defaultBreakEndTime = this.createDateFromTime(b.endTime);
                return {
                    availability: { ...b, id: null },
                    startTime: {
                        label: `${defaultBreakStartTime.getHours().toString().padStart(2, '0')}:${defaultBreakStartTime.getMinutes().toString().padStart(2, '0')}${defaultBreakStartTime.getHours() < 12 ? 'am' : 'pm'}`,
                        value: defaultBreakStartTime,
                     },
                    endTime: {
                        label: `${defaultBreakEndTime.getHours().toString().padStart(2, '0')}:${defaultBreakEndTime.getMinutes().toString().padStart(2, '0')}${defaultBreakEndTime.getHours() < 12 ? 'am' : 'pm'}`,
                        value: defaultBreakEndTime,
                     },
                    type: ScheduleType.CUSTOM
                }
            }) ?? [],
            startTime: {
                label: `${defaultStartTimeDate.getHours().toString().padStart(2, '0')}:${defaultStartTimeDate.getMinutes().toString().padStart(2, '0')}${defaultStartTimeDate.getHours() < 12 ? 'am' : 'pm'}`,
                value: defaultStartTimeDate,
            },
            endTime: {
                label: `${defaultEndTimeDate.getHours().toString().padStart(2, '0')}:${defaultEndTimeDate.getMinutes().toString().padStart(2, '0')}${defaultEndTimeDate.getHours() < 12 ? 'am' : 'pm'}`,
                value: defaultEndTimeDate,
            },
            type: ScheduleType.CUSTOM
        }
    }

    addBreak(day: number): void {
        const isSpecificDate = !(day in DayOfWeek);
        this.models[day].breaks = [
            ...this.models[day].breaks,
            {
                availability: {
                    dayOfWeek: isSpecificDate ? null : day,
                    specificDate: isSpecificDate ? moment(day) : null,
                    isAvailable: false,
                    startTime: null,
                    endTime: null
                },
                startTime: null,
                endTime: null
            }
        ];
    }

    removeBreak(day: number, index: number): void {
        this.models[day].breaks.splice(index, 1);
    }

    addCustomAvailability(): void {
        const day = new Date(this.newDateDpValue.getFullYear(), this.newDateDpValue.getMonth(), this.newDateDpValue.getDate(), 0, 0, 0).valueOf();
        this.addAvailability(day);
        this.newDateDpValue = null;
    }

    removeCustomAvailability(day: number): void {
        delete this.models[day];
    }

}
