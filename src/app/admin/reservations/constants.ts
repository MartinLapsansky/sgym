export type Option = { value: string; label: string };

export type Reservation = {
    id: string;
    notes: string | null;
    status: string;
    services: string[] | string;
    createdAt: string;
};

export type Filters = {
    category: string;
    plan: string;
    name: string;
    from: string;
    month: string;
};

export const CATEGORY_OPTIONS: Option[] = [
    { value: "", label: "Všetky kategórie" },
    { value: "GROUP", label: "MAXI SKUPINA" },
    { value: "MINI", label: "MINI (Ut/Št)" },
    { value: "MINI_ONE_CLIENT", label: "MINI Po/Str/Pia" },
    { value: "INDIVIDUAL_DUO", label: "INDIVIDUAL DUO" },
    { value: "INDIVIDUAL_SINGLE", label: "INDIVIDUAL SINGLE" },
];

export const PLAN_OPTIONS_BY_CATEGORY: Record<string, Option[]> = {
    "": [
        { value: "", label: "Všetky plány" },
        { value: "BASIC", label: "BASIC" },
        { value: "STANDARD", label: "STANDARD" },
        { value: "FULL", label: "FULL" },
        { value: "FULL_PLUS", label: "FULL_PLUS" },
    ],
    GROUP: [
        { value: "", label: "Všetky plány" },
        { value: "BASIC", label: "BASIC" },
        { value: "STANDARD", label: "STANDARD" },
        { value: "FULL", label: "FULL" },
    ],
    MINI: [
        { value: "", label: "Všetky plány" },
        { value: "BASIC", label: "BASIC" },
        { value: "STANDARD", label: "STANDARD" },
        { value: "FULL", label: "FULL" },
        { value: "FULL_PLUS", label: "FULL_PLUS" },
    ],
    MINI_ONE_CLIENT: [
        { value: "", label: "Všetky plány" },
        { value: "BASIC", label: "BASIC" },
        { value: "STANDARD", label: "STANDARD" },
        { value: "FULL", label: "FULL / Neobmedzený" },
    ],
    INDIVIDUAL_DUO: [
        { value: "", label: "Všetky plány" },
        { value: "BASIC", label: "BASIC" },
        { value: "STANDARD", label: "STANDARD" },
        { value: "FULL", label: "FULL" },
    ],
    INDIVIDUAL_SINGLE: [
        { value: "", label: "Všetky plány" },
        { value: "BASIC", label: "BASIC" },
        { value: "STANDARD", label: "STANDARD" },
        { value: "FULL", label: "FULL" },
    ],
};