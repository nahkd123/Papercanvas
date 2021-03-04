import { SettingOption } from "./SettingOption.js";

export interface SettingsSection extends SettingOption {
    list: (SettingOption | SettingsSection)[];
}