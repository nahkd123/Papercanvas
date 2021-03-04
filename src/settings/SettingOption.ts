export interface SettingOption {
    name: string;
    description?: string;
}

export interface ToggleOption extends SettingOption {
    state: boolean;
    toggle(v: boolean): void;
}

export interface SliderOption extends SettingOption {
    min: number;
    max: number;
    
    snapping?: boolean;
    snappingDistance?: number;
    getValue(): number;
    sliderChange(v: number): void;
}

export interface ListOption extends SettingOption {
    availableOptions: string[];
    getValue(): string;
    optionChange(v: string): void;
}