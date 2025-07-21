export class ItemDto {
  id: number;
  name: string;
  cost: number;
  secret_shop: number;
  side_shop: number;
  recipe: number;
  localized_name: string;
  img: string;
  dname?: string; // Display name
  qual?: string; // Quality (e.g., "epic")
  attrib?: any[]; // Attributes
  mc?: number; // Mana cost
  cd?: number; // Cooldown
  notes?: string; // Notes
  lore?: string; // Lore
  components?: string[]; // Components if it's a recipe
  created?: boolean; // If it's a recipe
  charges?: boolean; // If it has charges
  behavior?: string; // Behavior (e.g., "Unit Target")
  target_team?: string; // Target team
  target_type?: string[]; // Target type
  hint?: string[]; // Hint
  // Add other properties as needed based on OpenDota API response
}