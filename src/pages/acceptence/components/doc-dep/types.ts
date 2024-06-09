export type IDoctorDepsProp = IDoctorDeps[]

export interface IDoctorDeps {
    id: string
    doctorId: string
    hours?: number
    workDays?: string[]
    startWorkDay?: string
    createdDate: string
    modifiedDate: string
    type: string
    first: string
    last: string
    middle: string
    start?: string
    end?: string
}