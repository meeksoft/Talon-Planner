/* Constants (Our feeble attempt) */
export const TALONPLANNER_VERSION = '1.0.00';

export const PowersetType = {
  ANY: 0,
  PRIMARY: 1,
  SECONDARY: 2,
  POOL: 3,
  EPIC: 4,
  INHERIT: 5,
};

/* Interfaces and Classes */
export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface ILevel {
  level: number;
  powers: number;
  slots: number;
}

export interface IPower {
  loaded: boolean;
  level: number;
  label: string; //"name": "Beanbag",
  value: string; //"full_name": "Blaster_Ranged.Assault_Rifle.Beanbag"
  tooltip: string;
  icon: string;
  description: string;
  requires: string;
  powersetType: number;
  boostsAllowed: Array<string>; //From JSON
  allowedBoostsetCats: Array<string>; //From JSON
  boosts: Array<Boost>; //What we show from boostsAllowed and allowedBoostsetCats.
  assigned: boolean; //Did we assign this to a build.
}

export class Power implements IPower {
  loaded = false;
  level = -1;
  label = '';
  value = '';
  tooltip = '';
  icon = '';
  description = '';
  requires = '';
  powersetType = 0;
  boostsAllowed = [] as string[];
  allowedBoostsetCats = [] as string[];
  boosts = [] as Boost[];
  assigned = false;
}

/* Reusable Default Objects - To save memory */
export const EmptyPower = new Power();

export interface IEnhancementSlot {
  level: number; //The level of the enhancement slot
  assigned: boolean; //Is added to a power slot?
  boost: Boost;
}

export class EnhancementSlot implements IEnhancementSlot {
  level = -1;
  assigned = false;
  boost = EmptyBoost;
}

export interface IBuildSlot {
  level: number;
  power: Power;
  powersetType: number;
  enhancementSlots: Array<EnhancementSlot>;
  selected: boolean;
  disabled: boolean;
}

export class BuildSlot implements IBuildSlot {
  level = -1;
  power = EmptyPower;
  powersetType = 0; //Specify if it has to only accept powers of this type.
  enhancementSlots = [] as EnhancementSlot[];
  selected = false;
  disabled = false;
}

export const EmptyBuildSlot = new BuildSlot();

export interface IBoost {
  label: string;
  value: string;
  group: string; //generic, category, or boost set name
  icon: string;
  aspects: Array<string>;
}

export class Boost implements IBoost {
  label = '';
  value = '';
  group = '';
  icon = '';
  aspects = [];
}

export const EmptyBoost = new Boost();

export interface IBoostSet {
  loaded: boolean;
  label: string; //Display Name
  value: string; //Name
  icon: string;
  boosts: Array<Boost>;
  bonuses: Array<Array<Array<string>>>;
  conversionGroups: Array<string>;
}

export class BoostSet implements IBoostSet {
  loaded = false;
  label = '';
  value = '';
  icon = '';
  boosts = [] as Boost[];
  bonuses = [];
  conversionGroups = [];
}

export interface IBoostGroup {
  loadedN: boolean; //Quick reference instead of loop.
  label: string;
  value: string;
  icon: string;
  boost: Boost; //Pointer to it's Boost representation.
  boostSets: Array<BoostSet>;
}

export class BoostGroup implements IBoostGroup {
  loadedN = false;
  label = '';
  value = '';
  icon = '';
  boost = new Boost();
  boostSets = [] as BoostSet[];

  public get loaded() {
    if (this.loadedN) return true;
    if (this.boostSets.length < 1) return false;
    const index = this.boostSets.findIndex((b) => b.loaded == false);
    if (index >= 0) return false;
    this.loadedN = true;
    return true;
  }

  //Is a BoostSet loaded.
  public isLoaded(value: string) {
    const index = this.boostSets.findIndex(
      (b) => b.value === value && b.loaded
    );
    if (index >= 0) return true;
    return false;
  }
}

export interface IPowerset {
  loadedN: boolean;
  label?: string;
  value?: string; //Blaster_Ranged.Assault_Rifle
  description?: string;
  icon?: string;
  powersetFolder?: string; //Main folder; blaster_ranged
  powerFolder?: string; //Power's folder; assault_rifle
  powersetType?: number;
  powers?: Array<Power>;
}

export class Powerset {
  loadedN = false;
  label = '';
  value = '';
  description = '';
  icon = '';
  powersetFolder = '';
  powerFolder = '';
  powersetType = 0;
  powers = [] as Power[];

  constructor(params: IPowerset = {} as IPowerset) {
    this.loadedN = false;
    this.label = params.label ?? '';
    this.icon = params.icon ?? '';
    this.powers = params.powers ?? ([] as Power[]);
  }

  public get loaded() {
    if (this.loadedN) return true;
    if (this.powers.length < 1) return false;
    const index = this.powers.findIndex((p) => p.loaded == false);
    if (index >= 0) return false;
    this.loadedN = true;
    return true;
  }
}

export interface IArchetype {
  label?: string;
  value?: string;
  icon?: string;
  primary?: string;
  secondary?: string;
  description?: string;
  brief?: string;
  rounded?: boolean;
  primaryPowersets?: Array<Powerset>;
  secondaryPowersets?: Array<Powerset>;
  epicPowersets?: Array<Powerset>;
}

export class Archetype implements IArchetype {
  label = '';
  value = '';
  icon = '';
  primary = '';
  secondary = '';
  description = '';
  brief = '';
  rounded = true;
  primaryPowersets = [] as Powerset[];
  secondaryPowersets = [] as Powerset[];
  epicPowersets = [] as Powerset[];

  constructor(params: IArchetype = {} as IArchetype) {
    this.label = params.label ?? '';
    this.icon = params.icon ?? '';
  }
}

//#region MBD Object

export interface IEnhancement {
  Enhancement: string;
  Grade: string;
  IoLevel: number;
  RelativeLevel: string;
  Obtained: boolean;
}

export class Enhancement implements IEnhancement {
  Enhancement = '';
  Grade = 'None';
  IoLevel = 49;
  RelativeLevel = 'Even';
  Obtained = false;
}
export interface ISlotEntry {
  Level: number;
  IsInherent: boolean;
  Enhancement: Enhancement | null;
  FlippedEnhancement: Enhancement | null;
}

export class SlotEntryWithEnhancement implements ISlotEntry {
  Level = 0;
  IsInherent = false;
  Enhancement = new Enhancement();
  FlippedEnhancement = null;
}
export class SlotEntry implements ISlotEntry {
  Level = 0;
  IsInherent = false;
  Enhancement = null;
  FlippedEnhancement = null;
}

// TODO: SubPowerEntries
export interface ISubPowerEntry {
  PowerName: string; // Place Holder.
}

export class SubPowerEntry implements ISubPowerEntry {
  PowerName = '';
}

export interface IPowerEntry {
  PowerName: string;
  Level: number;
  StatInclude: boolean;
  ProcInclude: boolean;
  VariableValue: number;
  InherentSlotsUsed: number;
  SubPowerEntries: Array<SubPowerEntry>;
  SlotEntries: Array<ISlotEntry>;
}

export class PowerEntry implements IPowerEntry {
  PowerName = '';
  Level = 0;
  StatInclude = false;
  ProcInclude = false;
  VariableValue = 0;
  InherentSlotsUsed = 0;
  SubPowerEntries = [] as SubPowerEntry[];
  SlotEntries = [] as ISlotEntry[];
}

export interface IBuiltWith {
  App: string;
  Version: string;
  Database: string;
  DatabaseVersion: string;
}

export class BuiltWith implements IBuiltWith {
  App = 'Talon Planner ' + TALONPLANNER_VERSION;
  Version = '3.5.5.10'; //Mids Reborn Version
  Database = 'Homecoming';
  DatabaseVersion = '2023.5.544';
}

export interface IMBDObject {
  BuiltWith: BuiltWith;
  Class: string;
  Origin: string;
  Alignment: string;
  Name: string;
  Comment: string;
  PowerSets: Array<string>;
  LastPower: number;
  PowerEntries: Array<PowerEntry>;
}

export class MBDObject implements IMBDObject {
  BuiltWith = new BuiltWith();
  Class = '';
  Origin = 'Natural';
  Alignment = 'Hero';
  Name = '';
  Comment = '';
  PowerSets = [] as string[];
  LastPower = 25;
  PowerEntries = [] as PowerEntry[];
}

//#endregion MBD Object
