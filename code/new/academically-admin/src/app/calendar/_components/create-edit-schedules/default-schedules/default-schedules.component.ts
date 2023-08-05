import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AutoSaveComponentBase } from '@shared/auto-save-component-base';
import { DayOfWeek, UserAvailabilityDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';

@Component({
    selector: 'app-default-schedules',
    templateUrl: './default-schedules.component.html',
    styleUrls: ['./default-schedules.component.less'],
})
export class DefaultSchedulesComponent extends AutoSaveComponentBase implements OnInit {
    @Input() userAvailabilities: UserAvailabilityDto[] = [];
    @Output() modelChanged: EventEmitter<any> = new EventEmitter();

    timeSelections: { label: string; value: Date }[] = [];
    models: {
        [day in DayOfWeek]?: {
            availability: UserAvailabilityDto;
            breaks: {
                availability: UserAvailabilityDto;
                startTime: { label: string; value: Date };
                endTime: { label: string; value: Date }
            }[];
            startTime: { label: string; value: Date };
            endTime: { label: string; value: Date };
        };
    } = {};

    DayOfWeek = DayOfWeek;

    constructor(
        injector: Injector,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.init();
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
                    label: `${hour.toString().padStart(2, '0')}:${min
                        .toString()
                        .padStart(2, '0')}${hour < 12 ? 'am' : 'pm'}`,
                    value: new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate(),
                        hour,
                        min,
                        0
                    ),
                });
            }
        }
    }

    private initModels(): void {
        const now = new Date();
        for (let i = 0; i < 7; i++) {
            const existing = _.minBy(this.userAvailabilities.filter((e) => e.dayOfWeek == i), (a) => a.startTime);
            this.models[i] = {
                availability: existing ?? new UserAvailabilityDto(),
                breaks: this.userAvailabilities?.filter(a => a.dayOfWeek == i && a.id !== existing?.id)?.map(b => ({
                    availability: b,
                    startTime: { label: b.startTime, value: this.createDateFromTime(b.startTime) },
                    endTime: { label: b.endTime, value: this.createDateFromTime(b.endTime) },
                })) ?? [],
                startTime: {
                    label: existing?.startTime ?? '9:00am',
                    value: existing?.startTime
                        ? this.createDateFromTime(existing.startTime)
                        : new Date(
                            now.getFullYear(),
                            now.getMonth(),
                            now.getDate(),
                            9,
                            0,
                            0
                        ),
                },
                endTime: {
                    label: existing?.endTime ?? '18:00pm',
                    value: existing?.endTime
                        ? this.createDateFromTime(existing.endTime)
                        : new Date(
                            now.getFullYear(),
                            now.getMonth(),
                            now.getDate(),
                            18,
                            0,
                            0
                        ),
                },
            };
        }
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
                } as UserAvailabilityDto,
                breaks: this.models[day].breaks.map(b => {
                    return {
                        ...b,
                        availability: {
                            ...b.availability,
                            startTime: b.startTime?.value ? this.strPadLeft(b.startTime.value.getHours(), 2) + ':' + this.strPadLeft(b.startTime.value.getMinutes(), 2) : null,
                            endTime: b.endTime?.value ? this.strPadLeft(b.endTime.value.getHours(), 2) + ':' + this.strPadLeft(b.endTime.value.getMinutes(), 2) : null,
                        } as UserAvailabilityDto
                    }
                })
            };
        });
        this.modelChanged.next(this.models);
    }

    addBreak(day: number): void {
        this.models[day].breaks = [
            ...this.models[day].breaks,
            {
                availability: {
                    dayOfWeek: day,
                    isAvailable: false,
                    startTime: null,
                    endTime: null
                } as UserAvailabilityDto,
                startTime: null,
                endTime: null
            }
        ];
    }

    removeBreak(day: number, index: number): void {
        this.models[day].breaks.splice(index, 1);
    }
}
