/* Constants (Our feeble attempt) */
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

export interface IPower {
  level: number;
  label: string;
  value: string;
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
  enhancement: Boost;
}

export class EnhancementSlot implements IEnhancementSlot {
  level = -1;
  assigned = false;
  enhancement = new Boost();
}

export interface IPowerSlot {
  level: number;
  power: Power;
  powersetType: number;
  enhancementSlots: Array<EnhancementSlot>;
  selected: boolean;
}

export class PowerSlot implements IPowerSlot {
  level = -1;
  power = EmptyPower;
  powersetType = 0;
  enhancementSlots = [] as EnhancementSlot[];
  selected = false;
}

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

export interface IBoostSet {
  label: string; //Display Name
  value: string; //Name
  icon: string;
  boosts: Array<Boost>;
  bonuses: Array<Array<Array<string>>>;
  conversionGroups: Array<string>;
}

export class BoostSet implements IBoostSet {
  label = '';
  value = '';
  icon = '';
  boosts = [] as Boost[];
  bonuses = [];
  conversionGroups = [];
}

export interface IBoostGroup {
  label: string;
  value: string;
  icon: string;
  boost: Boost; //Pointer to it's Boost representation.
  boostSets: Array<BoostSet>;
}

export class BoostGroup implements IBoostGroup {
  label = '';
  value = '';
  icon = '';
  boost = new Boost();
  boostSets = [] as BoostSet[];
}

export interface IPowerset {
  label: string;
  value: string;
  description: string;
  icon: string;
  powersetFolder: string; //Main folder; blaster_ranged
  powerFolder: string; //Power's folder; assault_rifle
  powersetType: number;
  powers: Array<Power>;
}

export class Powerset {
  label = '';
  value = '';
  description = '';
  icon = '';
  powersetFolder = '';
  powerFolder = '';
  powersetType = 0;
  powers = [] as Power[];
}

export interface IArchetype {
  label: string;
  value: string;
  icon: string;
  primary: string;
  secondary: string;
  description: string;
  brief: string;
  rounded: boolean;
  primaryPowersets: Array<Powerset>;
  secondaryPowersets: Array<Powerset>;
  epicPowersets: Array<Powerset>;
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
}
