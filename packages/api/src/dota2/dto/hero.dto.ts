export class HeroDto {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: string;
  attack_type: string;
  roles: string[];
  img: string;
  icon: string;
  base_health: number;
  base_health_regen: number;
  base_mana: number;
  base_mana_regen: number;
  base_armor: number;
  base_mr: number;
  base_attack_min: number;
  base_attack_max: number;
  base_strength: number;
  base_agility: number;
  base_intelligence: number;
  strength_gain: number;
  agility_gain: number;
  intelligence_gain: number;
  attack_range: number;
  projectile_speed: number;
  attack_rate: number;
  move_speed: number;
  turn_rate: number;
  legs: number;
  hero_id: number;
  turbo_picks: number;
  turbo_wins: number;
  pro_ban: number;
  pro_win: number;
  pro_pick: number;
}
