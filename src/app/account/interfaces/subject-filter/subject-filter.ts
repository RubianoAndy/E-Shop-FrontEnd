import { Subject } from "rxjs";

export interface SubjectFilter {
    subject: Subject<Event>;
    field: string;
}